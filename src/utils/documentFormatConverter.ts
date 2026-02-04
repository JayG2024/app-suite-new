/**
 * Document Format Converter Utility
 * Task 8.6: Multi-format download support for resources
 * 
 * This utility provides functions for converting documents between different formats
 * (PDF, Word, PowerPoint) for partner resource downloads.
 */

export type DocumentFormat = 'pdf' | 'docx' | 'pptx' | 'original';

export interface ConversionOptions {
  quality?: 'low' | 'medium' | 'high';
  preserveFormatting?: boolean;
  includeImages?: boolean;
}

/**
 * Check if format conversion is supported
 */
export const isConversionSupported = (
  fromFormat: string,
  toFormat: DocumentFormat
): boolean => {
  if (toFormat === 'original') return true;

  const conversionMatrix: Record<string, DocumentFormat[]> = {
    'pdf': ['docx'],
    'docx': ['pdf', 'pptx'],
    'doc': ['pdf', 'pptx'],
    'pptx': ['pdf'],
    'ppt': ['pdf']
  };

  const supportedFormats = conversionMatrix[fromFormat.toLowerCase()] || [];
  return supportedFormats.includes(toFormat);
};

/**
 * Get available conversion formats for a given document type
 */
export const getAvailableFormats = (contentType: string): DocumentFormat[] => {
  const formats: DocumentFormat[] = ['original'];
  const lowerType = contentType.toLowerCase();

  if (lowerType === 'pdf') {
    formats.push('docx');
  } else if (lowerType === 'docx' || lowerType === 'doc') {
    formats.push('pdf', 'pptx');
  } else if (lowerType === 'pptx' || lowerType === 'ppt') {
    formats.push('pdf');
  }

  return formats;
};

/**
 * Get human-readable format label
 */
export const getFormatLabel = (format: DocumentFormat, originalType?: string): string => {
  if (format === 'original' && originalType) {
    return `${originalType.toUpperCase()} (Original)`;
  }

  const labels: Record<DocumentFormat, string> = {
    'pdf': 'PDF',
    'docx': 'Word Document',
    'pptx': 'PowerPoint',
    'original': 'Original Format'
  };

  return labels[format] || format.toUpperCase();
};

/**
 * Get file extension for format
 */
export const getFileExtension = (format: DocumentFormat, originalType?: string): string => {
  if (format === 'original' && originalType) {
    return originalType.toLowerCase();
  }
  return format;
};

/**
 * Estimate converted file size
 * Returns size in KB
 */
export const estimateConvertedSize = (
  originalSize: number,
  fromFormat: string,
  toFormat: DocumentFormat
): number => {
  if (toFormat === 'original') return originalSize;

  // Conversion size multipliers (approximate)
  const sizeMultipliers: Record<string, Record<string, number>> = {
    'pdf': {
      'docx': 1.2 // PDF to Word typically increases size
    },
    'docx': {
      'pdf': 0.8, // Word to PDF typically reduces size
      'pptx': 1.5 // Word to PowerPoint increases size
    },
    'pptx': {
      'pdf': 0.7 // PowerPoint to PDF reduces size
    }
  };

  const multiplier = sizeMultipliers[fromFormat.toLowerCase()]?.[toFormat] || 1.0;
  return Math.round(originalSize * multiplier);
};

/**
 * Format file size for display
 */
export const formatFileSize = (sizeInKB?: number): string => {
  if (!sizeInKB) return 'N/A';
  if (sizeInKB < 1024) return `${Math.round(sizeInKB)} KB`;
  return `${(sizeInKB / 1024).toFixed(1)} MB`;
};

/**
 * Validate conversion request
 */
export const validateConversion = (
  fromFormat: string,
  toFormat: DocumentFormat
): { valid: boolean; error?: string } => {
  if (toFormat === 'original') {
    return { valid: true };
  }

  if (!isConversionSupported(fromFormat, toFormat)) {
    return {
      valid: false,
      error: `Conversion from ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} is not supported`
    };
  }

  return { valid: true };
};

/**
 * Get conversion quality options
 */
export const getQualityOptions = (toFormat: DocumentFormat): string[] => {
  if (toFormat === 'pdf') {
    return ['low', 'medium', 'high'];
  }
  return ['medium']; // Default for other formats
};

/**
 * Simulate document conversion (placeholder for actual implementation)
 * In production, this would call a backend service or API
 */
export const convertDocument = async (
  resourceId: string,
  fromFormat: string,
  toFormat: DocumentFormat,
  options: ConversionOptions = {}
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> => {
  // Validate conversion
  const validation = validateConversion(fromFormat, toFormat);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Simulate conversion delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In production, this would:
  // 1. Call backend API with resource ID and target format
  // 2. Backend would use conversion service (e.g., LibreOffice, Pandoc, CloudConvert API)
  // 3. Return download URL for converted file

  return {
    success: true,
    downloadUrl: `/api/resources/${resourceId}/download?format=${toFormat}`
  };
};

/**
 * Get recommended format for specific use cases
 */
export const getRecommendedFormat = (useCase: 'print' | 'edit' | 'present' | 'share'): DocumentFormat => {
  const recommendations: Record<string, DocumentFormat> = {
    'print': 'pdf',
    'edit': 'docx',
    'present': 'pptx',
    'share': 'pdf'
  };

  return recommendations[useCase] || 'pdf';
};

/**
 * Check if format supports customization/branding
 */
export const supportsCustomization = (format: DocumentFormat): boolean => {
  // Word and PowerPoint documents support customization
  return ['docx', 'pptx'].includes(format);
};

/**
 * Get format icon class
 */
export const getFormatIconColor = (format: string): string => {
  const colors: Record<string, string> = {
    'pdf': 'text-red-500',
    'docx': 'text-blue-500',
    'doc': 'text-blue-500',
    'pptx': 'text-orange-500',
    'ppt': 'text-orange-500',
    'xlsx': 'text-green-500',
    'xls': 'text-green-500'
  };

  return colors[format.toLowerCase()] || 'text-gray-500';
};
