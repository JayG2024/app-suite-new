import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SEO from "@/components/SEO";
import Newsletter from "@/components/Newsletter";
import { 
  Headphones, 
  Play, 
  Pause, 
  Download, 
  Volume2,
  Clock,
  Calendar,
  Share2,
  Rss,
  ChevronRight,
  Mic,
  Radio,
  Twitter,
  Linkedin,
  Facebook,
  Copy
} from "lucide-react";
import { toast } from "sonner";

interface Episode {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  topics: string[];
  featured?: boolean;
}

const Podcast = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Episodes data
  const episodes: Episode[] = [
    {
      id: 3,
      title: "Double Trouble, Single Solution: Unifying Your Google Business Profiles & Untangling Reviews",
      description: "Learn how to merge duplicate Google Business Profiles and consolidate reviews without losing valuable customer feedback. We cover step-by-step strategies for cleaning up multiple listings and maintaining your online reputation during the merge process.",
      date: "July 2, 2025",
      duration: "12:28",
      audioUrl: "/podcasts/Double-Trouble-Single-Solution-Google-Business-Profiles.mp3",
      topics: ["Google Business Profile", "Local SEO", "Review Management", "Business Listings"],
      featured: true
    },
    {
      id: 2,
      title: "Geo-Blocking's Hidden Cost: AI Search Visibility",
      description: "Research reveals how traditional geo-blocking strategies may be hurting your visibility in AI-powered search. Learn why 95% of AI crawlers are blocked by geographic restrictions and discover modern alternatives that protect without limiting AI discovery.",
      date: "July 1, 2025",
      duration: "18:45",
      audioUrl: "/podcasts/Geo-Blocking's Hidden Cost_ AI Search Visibility.wav",
      topics: ["Geo-blocking", "AI Crawlers", "Website Accessibility", "GEO"],
      featured: false
    },
    {
      id: 1,
      title: "AI Ate SEO: The Rise of Generative Engine Optimization",
      description: "A deep dive into how AI is transforming search and what Generative Engine Optimization (GEO) means for businesses. We explore the shift from traditional SEO to AI-first optimization strategies.",
      date: "June 20, 2025",
      duration: "15:32",
      audioUrl: "/podcasts/AI Ate SEO_ The Rise of Generative Engine Optimization.mp3",
      topics: ["GEO", "AI Search", "ChatGPT", "SEO Evolution"],
      featured: false
    }
  ];

  const handlePlayPause = (episode: Episode) => {
    if (currentEpisode?.id !== episode.id) {
      setCurrentEpisode(episode);
      if (audioRef.current) {
        audioRef.current.src = episode.audioUrl;
        audioRef.current.load();
      }
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async (episode: Episode, platform?: string) => {
    const shareUrl = window.location.href;
    const shareTitle = episode.title;
    const shareText = `Listen to "${episode.title}" on the App Suite Insights Podcast`;
    
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    } else if (platform === 'linkedin') {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(linkedinUrl, '_blank', 'width=550,height=520');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank', 'width=550,height=420');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error('Copy failed:', error);
        toast.error(`Failed to copy link: ${errorMessage}`);
      }
    } else {
      // Native share fallback
      const shareData = {
        title: shareTitle,
        text: shareText,
        url: shareUrl
      };

      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.error('Share failed:', error);
        toast.error(`Share failed: ${errorMessage}`);
      }
    }
  };

  const handleDownload = (episode: Episode) => {
    const a = document.createElement('a');
    a.href = episode.audioUrl;
    a.download = `App-Suite-Podcast-${episode.title.replace(/[^a-z0-9]/gi, '-')}.mp3`;
    a.click();
    toast.success('Download started!');
  };

  return (
    <>
      <SEO 
        title="App Suite Insights Podcast - AI, Business & Technology"
        description="Deep dives into AI, custom software development, and business technology. Learn about GEO, AI search, and the future of digital business."
        keywords="podcast, AI podcast, business technology, GEO, generative engine optimization, custom software"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-grid-white/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
                <Mic className="w-3 h-3 mr-1" />
                Podcast Series
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                App Suite Insights Podcast
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                Deep dives into AI, custom software development, and the future of business technology. 
                New episodes exploring the topics that matter to modern businesses.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary">
                  <Rss className="w-4 h-4 mr-2" />
                  Subscribe to RSS
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Radio className="w-4 h-4 mr-2" />
                  Listen on Spotify
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Player */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Sticky Player (when episode is playing) */}
        {currentEpisode && (
          <div className="sticky top-0 z-50 bg-white border-b shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={() => handlePlayPause(currentEpisode)}
                  className="flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">{currentEpisode.title}</p>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[currentTime]}
                      onValueChange={handleSeek}
                      max={duration || 100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.1}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Episodes Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Latest Episodes</h2>
            
            <div className="space-y-6">
              {episodes.map((episode) => (
                <Card key={episode.id} className={`overflow-hidden ${episode.featured ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {episode.featured && (
                            <Badge variant="secondary" className="bg-purple-100">
                              Featured Episode
                            </Badge>
                          )}
                          <Badge variant="outline">Episode {episode.id}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{episode.title}</CardTitle>
                        <CardDescription className="text-base">
                          {episode.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {episode.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {episode.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        {episode.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={() => handlePlayPause(episode)}
                        className="flex-1 sm:flex-initial"
                      >
                        {isPlaying && currentEpisode?.id === episode.id ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Play Episode
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownload(episode)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleShare(episode, 'twitter')}>
                            <Twitter className="w-4 h-4 mr-2" />
                            Share on X
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(episode, 'linkedin')}>
                            <Linkedin className="w-4 h-4 mr-2" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(episode, 'facebook')}>
                            <Facebook className="w-4 h-4 mr-2" />
                            Share on Facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(episode, 'copy')}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">More Episodes Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're producing new episodes weekly covering AI, custom software development, and business technology trends.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowNewsletter(true)}>
                  Subscribe for Updates
                </Button>
                <Link to="/resources">
                  <Button variant="outline">
                    View All Resources
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Newsletter Popup */}
      {showNewsletter && (
        <Newsletter onClose={() => setShowNewsletter(false)} />
      )}
    </>
  );
};

export default Podcast;