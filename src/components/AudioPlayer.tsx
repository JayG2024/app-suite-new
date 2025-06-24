import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  Loader2,
  Headphones,
  Settings,
  X
} from 'lucide-react';
import { useTextToSpeech, VOICE_OPTIONS } from '@/hooks/useTextToSpeech';
import { toast } from 'sonner';

interface AudioPlayerProps {
  text: string;
  title?: string;
  estimatedDuration?: string;
  className?: string;
}

const AudioPlayer = ({ text, title, estimatedDuration, className = '' }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('nova');
  const [speed, setSpeed] = useState(1.0);
  const [audioGenerated, setAudioGenerated] = useState(false);
  
  const { generateAudio, isGenerating, audioUrl, progress } = useTextToSpeech();

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      setAudioGenerated(true);
    }
  }, [audioUrl]);

  const handleGenerateAndPlay = async () => {
    try {
      if (!audioGenerated) {
        const result = await generateAudio(text, {
          voice: selectedVoice,
          speed: speed,
          model: 'tts-1-hd' // Use HD for better quality
        });
        
        if (result && audioRef.current) {
          audioRef.current.src = result.url;
          setAudioGenerated(true);
          
          // Auto-play after generation
          setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
          }, 100);
        }
      } else if (audioRef.current) {
        // If already generated, just play/pause
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Audio generation error:', error);
    }
  };

  const handleDownload = async () => {
    if (!audioGenerated) {
      toast.info('Generating audio for download...');
      const result = await generateAudio(text, {
        voice: selectedVoice as any,
        speed: speed,
        model: 'tts-1-hd'
      });
      
      if (result) {
        result.download();
        toast.success('Audio downloaded!');
      }
    } else if (audioUrl) {
      // Download existing audio
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `${title || 'audio'}-${Date.now()}.mp3`;
      a.click();
      toast.success('Audio downloaded!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">{title || 'Listen to this article'}</h3>
              <p className="text-sm text-muted-foreground">
                {estimatedDuration || 'AI-narrated audio version'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-4 p-4 bg-slate-50 rounded-lg space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Voice</label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map(voice => (
                    <SelectItem key={voice.value} value={voice.value}>
                      <div>
                        <div className="font-medium">{voice.label}</div>
                        <div className="text-xs text-muted-foreground">{voice.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Speed: {speed}x
              </label>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                min={0.5}
                max={2}
                step={0.25}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Audio Player Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating audio...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Audio element */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Seek Bar */}
          {audioGenerated && (
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              onClick={handleGenerateAndPlay}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {audioGenerated ? 'Play' : 'Generate & Play'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="w-5 h-5" />
            </Button>

            {/* Volume Control */}
            {audioGenerated && (
              <div className="flex items-center gap-2 ml-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-24"
                />
              </div>
            )}
          </div>
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Powered by OpenAI Text-to-Speech • High-quality AI narration
        </p>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;