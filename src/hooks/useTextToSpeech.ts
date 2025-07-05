import { useState } from 'react';
import { toast } from 'sonner';

interface TTSOptions {
  voice?: 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer';
  model?: 'tts-1' | 'tts-1-hd';
  speed?: number;
  onProgress?: (progress: number) => void;
}

export const useTextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateAudio = async (text: string, options: TTSOptions = {}) => {
    const {
      voice = 'nova',
      model = 'tts-1',
      speed = 1.0,
      onProgress
    } = options;

    setIsGenerating(true);
    setProgress(0);

    try {
      // Update progress
      setProgress(10);
      onProgress?.(10);

      const response = await fetch('/api/audio-generate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          model,
          speed
        })
      });

      setProgress(50);
      onProgress?.(50);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate audio');
      }

      // Get the audio blob
      const blob = await response.blob();
      
      setProgress(80);
      onProgress?.(80);

      // Create a URL for the audio blob
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setProgress(100);
      onProgress?.(100);

      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-${Date.now()}.mp3`;
      
      return {
        url,
        blob,
        download: () => {
          a.click();
        },
        play: () => {
          const audio = new Audio(url);
          audio.play();
        }
      };

    } catch (error) {
      console.error('TTS error:', error);
      toast.error(error.message || 'Failed to generate audio');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanup = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return {
    generateAudio,
    isGenerating,
    audioUrl,
    progress,
    cleanup
  };
};

// Voice descriptions for UI
export const VOICE_OPTIONS = [
  { value: 'nova', label: 'Nova', description: 'Friendly and conversational' },
  { value: 'alloy', label: 'Alloy', description: 'Neutral and balanced' },
  { value: 'echo', label: 'Echo', description: 'Warm and engaging' },
  { value: 'fable', label: 'Fable', description: 'Expressive British accent' },
  { value: 'onyx', label: 'Onyx', description: 'Deep and authoritative' },
  { value: 'shimmer', label: 'Shimmer', description: 'Soft and pleasant' }
] as const;