import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      text, 
      voice = 'nova', // nova, alloy, echo, fable, onyx, shimmer
      model = 'tts-1', // tts-1 or tts-1-hd
      speed = 1.0 // 0.25 to 4.0
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Limit text length to prevent abuse (OpenAI has a 4096 character limit anyway)
    const truncatedText = text.substring(0, 4000);

    // Generate audio using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: truncatedText,
      speed: speed
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    // Set appropriate headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    
    // Send the audio buffer
    res.send(buffer);

  } catch (error) {
    console.error('TTS generation error:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    return res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error.message 
    });
  }
}