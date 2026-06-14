import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Sparkles, Music2, Disc3, Headphones, Mic2, Globe2, Waves, Zap, Film, Coffee, Heart, Podcast, Music, Volume2, Speaker, Crown } from 'lucide-react';
import { Header } from '@/components/Header';
import { AudioPlayer } from '@/components/AudioPlayer';
import { SearchBar } from '@/components/SearchBar';
import { RegionTabs } from '@/components/RegionTabs';
import { StationGrid } from '@/components/StationGrid';
import { REGIONS } from '@/types/radio';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { RadioStation } from '@/types/radio';
import { Link } from 'react-router-dom';

const stationIcons: Record<string, any> = {
  'kexp': Radio, 'nts': Disc3, 'worldwide': Globe2, 'dublab': Waves,
  'fip': Music2, 'tsfjazz': Music, 'balamii': Zap, 'netil': Headphones,
  'soho': Mic2, 'cinemix': Film, 'boxout': Speaker, 'indiegini': Music2,
  'air-rainbow': Radio, 'radiocity': Podcast, 'kuoi': Headphones, 'kdvs': Disc3,
  'kzsc': Music2, 'kvsc': Radio, 'wmnf': Mic2, 'kfai': Globe2, 'wncw': Music,
  'wyep': Waves, 'wfmu': Zap, 'kcrw': Podcast, 'thelot': Speaker,
  'radiooooo': Globe2, 'refuge': Waves, 'oroko': Heart, 'kutx': Music2,
};

const GRADIENT_PAIRS: [string, string][] = [
  ['#ff6b35', '#ffb690'], ['#f7931e', '#ffd700'], ['#e65c00', '#f9a825'],
  ['#d84315', '#ff8a65'], ['#bf360c', '#ffab91'], ['#e65100', '#ffb74d'],
];

function getGradient(id: string): [string, string] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
  return GRADIENT_PAIRS[Math.abs(h) % GRADIENT_PAIRS.length];
}

function getInitials(name: string) { return name.slice(0, 2).toUpperCase(); }

const editorsPicks: RadioStation[] = [
  { id:'kexp', stationuuid:'kexp-seattle', name:'KEXP', url:'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', url_resolved:'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', favicon:'https://www.kexp.org/apple-touch-icon.png', country:'USA', countrycode:'US', language:'english', tags:'indie,alternative,rock', votes:5000, codec:'MP3', bitrate:128, homepage:'https://www.kexp.org' },
  { id:'nts', stationuuid:'nts-london', name:'NTS Radio', url:'https://stream-relay-geo.ntslive.net/stream', url_resolved:'https://stream-relay-geo.ntslive.net/stream', favicon:'https://www.nts.live/favicon.ico', country:'UK', countrycode:'GB', language:'english', tags:'alternative,electronic,eclectic', votes:4500, codec:'MP3', bitrate:128, homepage:'https://www.nts.live' },
  { id:'worldwide', stationuuid:'worldwide-fm', name:'Worldwide FM', url:'https://worldwidefm.out.airtime.pro/worldwidefm_a', url_resolved:'https://worldwidefm.out.airtime.pro/worldwidefm_a', favicon:'https://worldwidefm.net/favicon.ico', country:'France', countrycode:'FR', language:'english', tags:'eclectic,world,electronic', votes:4000, codec:'MP3', bitrate:128, homepage:'https://worldwidefm.net' },
  { id:'dublab', stationuuid:'dublab-la', name:'dublab', url:'https://dublab.out.airtime.pro/dublab_a', url_resolved:'https://dublab.out.airtime.pro/dublab_a', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'electronic,experimental', votes:3800, codec:'MP3', bitrate:128, homepage:'https://dublab.com' },
  { id:'fip', stationuuid:'fip-france', name:'FIP', url:'https://icecast.radiofrance.fr/fip-midfi.mp3', url_resolved:'https://icecast.radiofrance.fr/fip-midfi.mp3', favicon:'', country:'France', countrycode:'FR', language:'french', tags:'eclectic,jazz,world', votes:4200, codec:'MP3', bitrate:128, homepage:'https://www.fip.fr' },
  { id:'tsfjazz', stationuuid:'tsf-jazz', name:'TSF JAZZ', url:'https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3', url_resolved:'https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3', favicon:'', country:'France', countrycode:'FR', language:'french', tags:'jazz,smooth', votes:3600, codec:'MP3', bitrate:128, homepage:'https://www.tsfjazz.com' },
  { id:'balamii', stationuuid:'balamii-london', name:'Balamii', url:'https://balamii.out.airtime.pro/balamii_a', url_resolved:'https://balamii.out.airtime.pro/balamii_a', favicon:'', country:'UK', countrycode:'GB', language:'english', tags:'electronic,underground', votes:3400, codec:'MP3', bitrate:128, homepage:'https://balamii.com' },
  { id:'netil', stationuuid:'netil-radio', name:'Netil Radio', url:'https://netilradio.out.airtime.pro/netilradio_a', url_resolved:'https://netilradio.out.airtime.pro/netilradio_a', favicon:'', country:'UK', countrycode:'GB', language:'english', tags:'electronic,indie', votes:3200, codec:'MP3', bitrate:128, homepage:'https://netilradio.com' },
  { id:'soho', stationuuid:'soho-radio', name:'Soho Radio', url:'https://sohoradiomusic.doughunt.co.uk:8010/320mp3', url_resolved:'https://sohoradiomusic.doughunt.co.uk:8010/320mp3', favicon:'', country:'UK', countrycode:'GB', language:'english', tags:'eclectic,indie,electronic', votes:3500, codec:'MP3', bitrate:320, homepage:'https://sohoradiolondon.com' },
  { id:'cinemix', stationuuid:'cinemix', name:'Cinemix', url:'https://cinemix.out.airtime.pro/cinemix_a', url_resolved:'https://cinemix.out.airtime.pro/cinemix_a', favicon:'', country:'Global', countrycode:'XX', language:'english', tags:'soundtrack,film,cinematic', votes:3000, codec:'MP3', bitrate:128, homepage:'https://cinemix.com' },
];

const notableStations: RadioStation[] = [
  { id:'boxout', stationuuid:'boxout-fm', name:'Boxout.fm', url:'https://boxout.fm/stream', url_resolved:'https://boxout.fm/stream', favicon:'', country:'India', countrycode:'IN', language:'english', tags:'electronic,underground', votes:3200, codec:'MP3', bitrate:128, homepage:'https://boxout.fm' },
  { id:'indiegini', stationuuid:'indiegini', name:'IndieGini', url:'https://stream.indiegini.com/live', url_resolved:'https://stream.indiegini.com/live', favicon:'', country:'Global', countrycode:'XX', language:'english', tags:'indie,rock,alternative', votes:2800, codec:'MP3', bitrate:128, homepage:'https://indiegini.com' },
  { id:'air-rainbow', stationuuid:'air-fm-rainbow', name:'AIR FM Rainbow', url:'https://air.pc.cdn.bitgravity.com/air/live/pbaudio056/playlist.m3u8', url_resolved:'https://air.pc.cdn.bitgravity.com/air/live/pbaudio056/playlist.m3u8', favicon:'', country:'India', countrycode:'IN', language:'hindi', tags:'bollywood,hindi', votes:3800, codec:'AAC', bitrate:128, homepage:'https://allindiaradio.gov.in' },
  { id:'radiocity', stationuuid:'radiocity-freedom', name:'Radio City Freedom', url:'https://prclive1.listenon.in/Freedom', url_resolved:'https://prclive1.listenon.in/Freedom', favicon:'', country:'India', countrycode:'IN', language:'hindi', tags:'bollywood,hindi', votes:3500, codec:'MP3', bitrate:128, homepage:'https://www.radiocity.in' },
  { id:'kuoi', stationuuid:'kuoi-fm', name:'KUOI', url:'https://kuoi.org:8000/stream', url_resolved:'https://kuoi.org:8000/stream', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'college,indie,alternative', votes:2600, codec:'MP3', bitrate:128, homepage:'https://kuoi.org' },
  { id:'kdvs', stationuuid:'kdvs-fm', name:'KDVS', url:'https://archives.kdvs.org:8443/stream', url_resolved:'https://archives.kdvs.org:8443/stream', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'college,freeform', votes:2900, codec:'MP3', bitrate:128, homepage:'https://kdvs.org' },
  { id:'kzsc', stationuuid:'kzsc-fm', name:'KZSC', url:'https://kzsc.org:8443/stream', url_resolved:'https://kzsc.org:8443/stream', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'college,indie', votes:2700, codec:'MP3', bitrate:128, homepage:'https://kzsc.org' },
  { id:'kvsc', stationuuid:'kvsc-fm', name:'KVSC', url:'https://kvsc.org/listen', url_resolved:'https://kvsc.org/listen', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'college,indie,rock', votes:2500, codec:'MP3', bitrate:128, homepage:'https://kvsc.org' },
  { id:'wmnf', stationuuid:'wmnf-fm', name:'WMNF', url:'https://stream.wmnf.org/wmnf_high', url_resolved:'https://stream.wmnf.org/wmnf_high', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'community,eclectic', votes:2800, codec:'MP3', bitrate:128, homepage:'https://wmnf.org' },
  { id:'kfai', stationuuid:'kfai-fm', name:'KFAI', url:'https://stream.kfai.org/live', url_resolved:'https://stream.kfai.org/live', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'community,eclectic,world', votes:2600, codec:'MP3', bitrate:128, homepage:'https://kfai.org' },
  { id:'wncw', stationuuid:'wncw-fm', name:'WNCW', url:'https://wncw.org/listen', url_resolved:'https://wncw.org/listen', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'americana,folk,roots', votes:2700, codec:'MP3', bitrate:128, homepage:'https://wncw.org' },
  { id:'wyep', stationuuid:'wyep-fm', name:'WYEP', url:'https://wyep-ice.streamguys1.com/wyep-mp3', url_resolved:'https://wyep-ice.streamguys1.com/wyep-mp3', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'indie,alternative', votes:2900, codec:'MP3', bitrate:128, homepage:'https://wyep.org' },
  { id:'wfmu', stationuuid:'wfmu-fm', name:'WFMU', url:'https://stream0.wfmu.org/freeform-128k', url_resolved:'https://stream0.wfmu.org/freeform-128k', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'freeform,eclectic,experimental', votes:3100, codec:'MP3', bitrate:128, homepage:'https://wfmu.org' },
  { id:'kcrw', stationuuid:'kcrw-la', name:'KCRW', url:'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air', url_resolved:'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air', favicon:'https://www.kcrw.com/favicon.ico', country:'USA', countrycode:'US', language:'english', tags:'npr,news,music', votes:4200, codec:'MP3', bitrate:192, homepage:'https://www.kcrw.com' },
  { id:'thelot', stationuuid:'the-lot-radio', name:'The Lot Radio', url:'https://thelotradio.com/listen', url_resolved:'https://thelotradio.com/listen', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'electronic,underground', votes:3300, codec:'MP3', bitrate:128, homepage:'https://thelotradio.com' },
  { id:'radiooooo', stationuuid:'radiooooo', name:'Radiooooo', url:'https://radiooooo.com/stream', url_resolved:'https://radiooooo.com/stream', favicon:'', country:'Global', countrycode:'XX', language:'multi', tags:'world,vintage', votes:3000, codec:'MP3', bitrate:128, homepage:'https://radiooooo.com' },
  { id:'refuge', stationuuid:'refuge-worldwide', name:'Refuge Worldwide', url:'https://refugeworldwide.out.airtime.pro/refugeworldwide_a', url_resolved:'https://refugeworldwide.out.airtime.pro/refugeworldwide_a', favicon:'', country:'Germany', countrycode:'DE', language:'english', tags:'electronic,underground', votes:3100, codec:'MP3', bitrate:128, homepage:'https://refugeworldwide.com' },
  { id:'oroko', stationuuid:'oroko-radio', name:'Oroko Radio', url:'https://orokoradio.out.airtime.pro/orokoradio_a', url_resolved:'https://orokoradio.out.airtime.pro/orokoradio_a', favicon:'', country:'Ghana', countrycode:'GH', language:'english', tags:'african,electronic', votes:2900, codec:'MP3', bitrate:128, homepage:'https://orokoradio.com' },
  { id:'kutx', stationuuid:'kutx-fm', name:'KUTX', url:'https://kut.streamguys1.com/kutx-web', url_resolved:'https://kut.streamguys1.com/kutx-web', favicon:'', country:'USA', countrycode:'US', language:'english', tags:'indie,alternative', votes:3200, codec:'MP3', bitrate:128, homepage:'https://kutx.org' },
];

const StationListItem = ({ station, isPlaying, onPlay }: { station: RadioStation; isPlaying: boolean; onPlay: (s: RadioStation) => void }) => {
  const [g1, g2] = getGradient(station.id);
  const Icon = stationIcons[station.id] || Radio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onPlay(station)}
      className="flex items-center gap-3 p-3 rounded-xl glass-card cursor-pointer transition-all hover:bg-white/[0.04] group border border-white/5"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground truncate">{station.name}</h3>
        <p className="text-[11px] text-muted-foreground/60 truncate">{station.country} · {station.tags.split(',')[0]}</p>
      </div>
      {isPlaying && (
        <div className="flex gap-[2px] items-end h-4 flex-shrink-0">
          {[0,1,2,3].map(i => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-gradient-gold"
              animate={{ height: [4, 12, 4, 8, 4] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('india');
  const [showAllEditorsPicks, setShowAllEditorsPicks] = useState(false);
  const [showAllNotable, setShowAllNotable] = useState(false);
  const region = REGIONS.find(r => r.id === selectedRegion);
  const { play, currentStation, isPlaying } = usePlayer();
  const { isPremium } = useAuth();

  const handlePlay = (station: RadioStation) => play(station);

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-0">
      <Header />

      {/* Hero */}
      <section className="relative pt-8 pb-4">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-primary/20 mb-5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Live Radio Worldwide</span>
            </motion.div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-[1.15] tracking-tight">
              Tune Into the
              <br />
              <span className="text-gradient-gold">World</span>
            </h1>

            <p className="text-sm text-muted-foreground/70 mb-6 max-w-sm mx-auto leading-relaxed">
              Discover and stream thousands of live radio stations from every corner of the globe.
            </p>

            <SearchBar className="w-full max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="gold-bar my-3" />
      </div>

      <main className="max-w-2xl mx-auto px-4">
        {/* Region Tabs */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-primary/80" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Browse by Region</h2>
          </div>
          <RegionTabs selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
        </motion.section>

        {/* Region Header */}
        <motion.div key={selectedRegion} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{region?.emoji}</span>
          <div>
            <h3 className="font-bold text-base text-foreground">{region?.name}</h3>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Broadcasting Live Now</p>
          </div>
        </motion.div>

        {/* Stations */}
        <StationGrid regionId={selectedRegion} />

        {/* Gold Divider */}
        <div className="gold-bar my-8" />

        {/* Editor's Picks */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary/80" />
            <h2 className="font-bold text-base text-foreground">Editor's Picks</h2>
          </div>
          <div className="flex flex-col gap-2">
            {editorsPicks.slice(0, showAllEditorsPicks ? editorsPicks.length : 5).map((station) => (
              <StationListItem key={station.id} station={station} isPlaying={currentStation?.id === station.id && isPlaying} onPlay={handlePlay} />
            ))}
          </div>
          {editorsPicks.length > 5 && (
            <button onClick={() => setShowAllEditorsPicks(!showAllEditorsPicks)} className="mt-2 w-full py-2.5 rounded-xl glass-card text-xs font-medium text-muted-foreground/60 hover:text-foreground transition-colors border border-white/5">
              {showAllEditorsPicks ? 'Show Less' : `Show ${editorsPicks.length - 5} More`}
            </button>
          )}
        </motion.section>

        {/* Gold Divider */}
        <div className="gold-bar my-8" />

        {/* Other Notable Stations */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="w-4 h-4 text-primary/80" />
            <h2 className="font-bold text-base text-foreground">Notable Stations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {notableStations.slice(0, showAllNotable ? notableStations.length : 8).map((station) => (
              <StationListItem key={station.id} station={station} isPlaying={currentStation?.id === station.id && isPlaying} onPlay={handlePlay} />
            ))}
          </div>
          {notableStations.length > 8 && (
            <button onClick={() => setShowAllNotable(!showAllNotable)} className="mt-2 w-full py-2.5 rounded-xl glass-card text-xs font-medium text-muted-foreground/60 hover:text-foreground transition-colors border border-white/5">
              {showAllNotable ? 'Show Less' : `Show ${notableStations.length - 8} More`}
            </button>
          )}
        </motion.section>

        {/* Premium CTA */}
        {!isPremium && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 mb-4 relative overflow-hidden rounded-2xl glass-card border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-amber-500/5 pointer-events-none" />
            <div className="h-0.5 bg-gradient-gold w-full relative" />
            <div className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-gold-dark flex items-center justify-center shadow-[0_0_16px_rgba(255,182,144,0.2)]">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Upgrade Experience</h3>
                  <p className="text-[11px] text-muted-foreground/70">HD audio · No ads · All regions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/premium" className="flex-1 text-center py-2.5 rounded-xl bg-gradient-gold-dark text-white font-bold text-sm transition-all hover:shadow-[0_0_24px_rgba(255,182,144,0.3)] active:scale-[0.98]">
                  Go Premium
                </Link>
                <button className="px-3 py-2.5 rounded-xl glass-card text-xs text-muted-foreground/60 hover:text-foreground transition-colors border border-white/5">
                  Learn More
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <AudioPlayer />
    </div>
  );
};

export default Index;
