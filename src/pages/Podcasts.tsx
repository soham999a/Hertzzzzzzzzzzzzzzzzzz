import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Podcast, Search, Play, Pause, ExternalLink, Headphones } from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  category: string;
}

const DEMO_PODCASTS: PodcastEpisode[] = [
  {
    id: '1',
    title: 'The Future of FM Radio',
    description: 'Exploring how digital streaming is transforming traditional radio broadcasting across India and the world.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    imageUrl: '',
    duration: '28:15',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Indie Music Spotlight',
    description: 'A curated journey through the best independent artists emerging from the underground scene.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    imageUrl: '',
    duration: '42:30',
    category: 'Music',
  },
  {
    id: '3',
    title: 'Radio Culture in India',
    description: 'From AIR to private FM - the evolution of radio culture in the Indian subcontinent.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    imageUrl: '',
    duration: '35:00',
    category: 'Culture',
  },
];

export default function Podcasts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  const filtered = DEMO_PODCASTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = (podcast: PodcastEpisode) => {
    if (selectedPodcast?.id === podcast.id && isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      if (audio) audio.pause();
      const newAudio = new Audio(podcast.audioUrl);
      newAudio.play();
      setAudio(newAudio);
      setSelectedPodcast(podcast);
      setIsPlaying(true);
      newAudio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Podcast className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Podcasts</h1>
            <p className="text-sm text-muted-foreground">Discover audio stories and shows</p>
          </div>
        </div>

        <div className="relative mb-6 mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search podcasts..."
            className="pl-9"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((podcast) => (
            <div
              key={podcast.id}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{podcast.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{podcast.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {podcast.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{podcast.duration}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0"
                  onClick={() => togglePlay(podcast)}
                >
                  {selectedPodcast?.id === podcast.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Podcast className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No podcasts found</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
          <h3 className="text-sm font-semibold text-foreground mb-1">More podcasts coming soon</h3>
          <p className="text-xs text-muted-foreground">
            We're building a curated podcast library. Stay tuned for updates!
          </p>
        </div>
      </main>
      <AudioPlayer />
    </div>
  );
}
