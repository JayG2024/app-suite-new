import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure S3 client if AWS credentials are available
const s3Client = process.env.AWS_ACCESS_KEY_ID ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}) : null;

// Configure multer for local storage fallback
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: images, PDF, Word, Excel, text, CSV'));
    }
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle file upload
  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      let fileUrl;
      let fileKey;

      if (s3Client && process.env.AWS_BUCKET_NAME) {
        // Upload to S3
        const key = `uploads/${Date.now()}-${req.file.originalname}`;
        const fileContent = await fs.readFile(req.file.path);

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType: req.file.mimetype,
        });

        await s3Client.send(command);
        
        // Generate signed URL for private buckets or use public URL
        if (process.env.AWS_BUCKET_PUBLIC === 'true') {
          fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
        } else {
          fileUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 }); // 7 days
        }
        
        fileKey = key;

        // Clean up local file
        await fs.unlink(req.file.path);
      } else {
        // Use local storage
        fileUrl = `/uploads/${req.file.filename}`;
        fileKey = req.file.filename;
      }

      // Save file info to database
      const { db } = await import('@/lib/db');
      
      const result = await db.query(
        `INSERT INTO documents (
          filename, 
          original_name, 
          mime_type, 
          size, 
          url, 
          storage_key,
          uploaded_by,
          project_id,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *`,
        [
          req.file.filename,
          req.file.originalname,
          req.file.mimetype,
          req.file.size,
          fileUrl,
          fileKey,
          req.body.userId || null,
          req.body.projectId || null
        ]
      );

      return res.status(200).json({
        success: true,
        file: {
          id: result.rows[0].id,
          filename: req.file.originalname,
          url: fileUrl,
          size: req.file.size,
          type: req.file.mimetype,
        }
      });
    } catch (error) {
      console.error('Error processing upload:', error);
      
      // Clean up local file on error
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      
      return res.status(500).json({ error: 'Failed to process upload' });
    }
  });
}