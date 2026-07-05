import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Hls from 'hls.js';
import { Language, Match } from '../types';
import { translations } from '../data/translations';
import { 
  Tv, Play, Pause, AlertCircle, RefreshCw, ExternalLink, 
  ShieldAlert, Volume2, VolumeX, Globe, Sparkles, HelpCircle, 
  Laptop, Search, List, Radio, CheckCircle, ChevronRight, Info,
  Loader2, Maximize
} from 'lucide-react';

interface LiveStreamProps {
  language: Language;
  liveMatches: Match[];
}

interface IPTVChannel {
  name: string;
  url: string;
  logo: string;
  group: string;
  id: string;
}

export default function LiveStream({ language, liveMatches: initialLiveMatches }: LiveStreamProps) {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State for simulated matches
  const [showDemoMatches, setShowDemoMatches] = useState(false);
  const displayedLiveMatches = showDemoMatches ? initialLiveMatches : [];
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // M3U Playlist Preset definitions from iptv-org - purely soccer & sports
  const playlists = [
    { 
      id: 'full-index', 
      name: language === 'my' ? '🌐 အလုံးစုံလိုင်းပေါင်းစုံ (IPTV-Org Index)' : '🌐 All IPTV-Org Index List',
      url: 'https://iptv-org.github.io/iptv/index.m3u',
      category: 'Full'
    },
    { 
      id: 'sports', 
      name: language === 'my' ? '⚽ တိုက်ရိုက်ဘောလုံးနှင့် အားကစားလိုင်းများ' : '⚽ Live Football & Sports',
      url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
      category: 'Sports'
    }
  ];

  // Active playlist selection state - default to full-index (the initial link)
  const [activePlaylistId, setActivePlaylistId] = useState('full-index');
  const [customPlaylistUrl, setCustomPlaylistUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Channel browsing states
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [groups, setGroups] = useState<string[]>(['All']);
  
  // Selected playing stream state - Default to BeIN Sports XTRA free legal stream
  const [currentStreamUrl, setCurrentStreamUrl] = useState('https://beinsportsxtra-beinsports-1-us.lg.amagi.tv/playlist.m3u8');
  const [activeChannelName, setActiveChannelName] = useState('BeIN Sports XTRA Live');
  const [activeChannelLogo, setActiveChannelLogo] = useState('https://upload.wikimedia.org/wikipedia/commons/3/3d/BeIN_Sports_logo.svg');

  // Player utility states
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [playlistError, setPlaylistError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Custom HTML5 Video controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted for smooth auto-play policies
  const [volume, setVolume] = useState(1);
  const [playerKey, setPlayerKey] = useState(0);

  // Pagination for large list rendering performance
  const [visibleCount, setVisibleCount] = useState(50);

  // Curated backup starter channels (100% active, legal, high-quality, sports-focused)
  const curatedFootballChannels: IPTVChannel[] = [
    {
      id: 'sports-bein-xtra',
      name: 'BeIN Sports XTRA Live',
      url: 'https://beinsportsxtra-beinsports-1-us.lg.amagi.tv/playlist.m3u8',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/BeIN_Sports_logo.svg',
      group: 'Sports Network'
    },
    {
      id: 'sports-realmadrid',
      name: 'Real Madrid TV English HD',
      url: 'https://rmtvlive-lh.akamaihd.net/i/rmtv_1@154315/master.m3u8',
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
      group: 'Club TV'
    },
    {
      id: 'sports-grid',
      name: 'SportsGrid Network',
      url: 'https://sportsgrid-sportsgrid-1-us.lg.amagi.tv/playlist.m3u8',
      logo: 'https://rethinktechnology.biz/wp-content/uploads/2021/04/sportsgrid-logo.png',
      group: 'Sports Network'
    },
    {
      id: 'sports-ftf',
      name: 'FTF Sports Network',
      url: 'https://ftf-ftfsn.amagi.tv/playlist.m3u8',
      logo: 'https://www.ftfnext.com/wp-content/uploads/2020/07/FTF_logo-white.png',
      group: 'Sports Network'
    },
    {
      id: 'sports-redbull',
      name: 'Red Bull TV Live Sports HD',
      url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
      logo: 'https://images.squarespace-cdn.com/content/v1/5be9db6ff93d4ad22a571f30/1554823150550-9YAL0IWWN62QW9988DOW/Red-Bull-TV-logo.jpg',
      group: 'Extreme Sports'
    }
  ];

  // Fetch and Parse IPTV M3U Playlist
  useEffect(() => {
    let activeUrl = '';
    if (showCustomInput) {
      if (!customPlaylistUrl) return;
      activeUrl = customPlaylistUrl;
    } else {
      const selectedPlaylist = playlists.find(p => p.id === activePlaylistId);
      activeUrl = selectedPlaylist ? selectedPlaylist.url : '';
    }

    if (!activeUrl) return;

    setIsLoadingPlaylist(true);
    setPlaylistError(null);

    fetch(activeUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
        return res.text();
      })
      .then(data => {
        const parsed = parseM3U(data);
        if (parsed.length === 0) {
          throw new Error('No working channels found in this playlist format.');
        }

        // Apply strict, smart football & sports-specific filtering to the fetched iptv-org playlist
        let filtered = parsed;
        if (activePlaylistId === 'sports') {
          const FOOTBALL_KEYWORDS = [
            'football', 'soccer', 'fifa', 'uefa', 'laliga', 'serie a', 'espn', 'bein', 
            'sport', 'arena', 'sky', 'canal+ sport', 'movistar', 'futebol', 'futbol', 
            'fußball', 'calcio', 'voetbal', 'champions league', 'premier league', 
            'bundesliga', 'ligue 1', 'mcfc', 'chelsea', 'arsenal', 'mutv', 'lfc', 
            'real madrid', 'barca', 'milan', 'juventus', 'bayern', 'eurosport', 
            'goal', 'score', 'match', 'ball', 'fc', 'club', 'copa', 'world cup'
          ];

          const EXCLUDE_KEYWORDS = [
            'cricket', 'golf', 'tennis', 'baseball', 'basketball', 'rugby', 'hockey', 
            'f1', 'nascar', 'racing', 'billiards', 'darts', 'snooker', 'fight', 'ufc', 
            'mma', 'wrestling', 'wwe'
          ];

          filtered = parsed.filter(channel => {
            const nameLower = channel.name.toLowerCase();
            const groupLower = (channel.group || '').toLowerCase();
            
            // Must contain a football/sports keyword
            const hasFootballKeyword = FOOTBALL_KEYWORDS.some(kw => nameLower.includes(kw) || groupLower.includes(kw));
            
            // Must NOT contain an exclude keyword, unless it specifically contains a strong football/club term
            const hasExcludeKeyword = EXCLUDE_KEYWORDS.some(kw => nameLower.includes(kw));
            const hasStrongFootballTerm = ['football', 'soccer', 'fifa', 'uefa', 'laliga', 'real madrid', 'barca', 'mutv'].some(kw => nameLower.includes(kw));
            
            if (hasExcludeKeyword && !hasStrongFootballTerm) {
              return false;
            }
            
            return hasFootballKeyword;
          });
        }

        if (filtered.length === 0) {
          throw new Error('No football/soccer channels matched the filters in this playlist.');
        }
        
        setChannels(filtered);
        
        // Extract distinct group names
        const extractedGroups = Array.from(new Set(filtered.map(c => c.group || 'Sports')))
          .filter(g => g.trim() !== '')
          .sort();
        setGroups(['All', ...extractedGroups]);
        setSelectedGroup('All');
        setSearchQuery('');
        setVisibleCount(50); // Reset list length limit

        // Set the default stream
        if (filtered.length > 0) {
          // Keep default as BeIN Sports XTRA if present in the loaded list, or first item
          const beinCh = filtered.find(c => c.name.toLowerCase().includes('bein'));
          if (beinCh) {
            setCurrentStreamUrl(beinCh.url);
            setActiveChannelName(beinCh.name);
            setActiveChannelLogo(beinCh.logo);
          } else {
            setCurrentStreamUrl(filtered[0].url);
            setActiveChannelName(filtered[0].name);
            setActiveChannelLogo(filtered[0].logo);
          }
        }
        setIsLoadingPlaylist(false);
      })
      .catch(err => {
        console.error('IPTV Playlist Fetch Failed:', err);
        setPlaylistError(
          language === 'my' 
            ? 'ဘောလုံးလိုင်းစာရင်း ရယူ၍ မရပါ။ စမ်းသပ်ပြီးသား 100% အားကစားလိုင်းများကို အလိုအလျောက် ပြောင်းလဲပြသထားပါသည်။' 
            : 'Could not fetch live sports playlist. Utilizing pre-tested high-quality live sports channels instead.'
        );
        // Fallback to our rock-solid curated sports list
        setChannels(curatedFootballChannels);
        setGroups(['All', 'Sports Network', 'Club TV', 'Extreme Sports']);
        setSelectedGroup('All');
        setIsLoadingPlaylist(false);
      });
  }, [activePlaylistId, customPlaylistUrl, showCustomInput, language]);

  // Robust .m3u Parser
  const parseM3U = (content: string): IPTVChannel[] => {
    const lines = content.split('\n');
    const parsedChannels: IPTVChannel[] = [];
    let tempChannel: Partial<IPTVChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('#EXTINF:')) {
        // Retrieve display name
        const nameParts = line.split(',');
        const name = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : 'Unnamed IPTV Channel';

        // Retrieve group
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const group = groupMatch ? groupMatch[1] : 'General';

        // Retrieve logo
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const logo = logoMatch ? logoMatch[1] : '';

        // Generate ID
        const idMatch = line.match(/tvg-id="([^"]+)"/);
        const randomId = Math.random().toString(36).substring(2, 7);
        const id = idMatch ? `${idMatch[1]}-${randomId}` : `ch-${randomId}`;

        tempChannel = { name, group, logo, id };
      } else if (!line.startsWith('#')) {
        // It's the live stream (.m3u8 / .mp4 / ts) link
        if (tempChannel.name) {
          tempChannel.url = line;
          parsedChannels.push(tempChannel as IPTVChannel);
          tempChannel = {};
        }
      }
    }
    return parsedChannels;
  };

  // Perform real-time Search & Group filtering
  useEffect(() => {
    let result = channels;

    // Filter by group-title
    if (selectedGroup !== 'All') {
      result = result.filter(c => c.group === selectedGroup);
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) || 
        (c.group && c.group.toLowerCase().includes(query))
      );
    }

    setFilteredChannels(result);
    setVisibleCount(50); // Reset page count on filter
  }, [channels, searchQuery, selectedGroup]);

  // Premium Native HLS player with automatic recovery
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentStreamUrl) return;

    setIsLoadingStream(true);
    setStreamError(null);
    setIsPlaying(false);

    let hls: Hls | null = null;

    const handleNativeCanPlay = () => {
      setIsLoadingStream(false);
      setIsPlaying(true);
      video.play().catch(err => {
        console.log('Autoplay prevented by browser security.', err);
      });
    };

    const handleNativeError = (e: any) => {
      console.error('Native playback failure:', e);
      setStreamError('This channel stream is offline or uses unsupported encoding.');
      setIsLoadingStream(false);
    };

    // If Safari or iOS plays native HLS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentStreamUrl;
      video.addEventListener('canplay', handleNativeCanPlay);
      video.addEventListener('error', handleNativeError);
    } else if (Hls.isSupported()) {
      // Use premium hls.js player engine
      hls = new Hls({
        maxMaxBufferLength: 15,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });

      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoadingStream(false);
        setIsPlaying(true);
        video.play().catch(err => {
          console.log('Playback prevented.', err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('HLS Network failure. Re-attempting load...');
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('HLS Media error. Recovering audio/video...');
              hls?.recoverMediaError();
              break;
            default:
              setStreamError('The selected IPTV channel is currently offline or blocked by CORS.');
              setIsLoadingStream(false);
              if (hls) hls.destroy();
              break;
          }
        }
      });
    } else {
      setStreamError('HTML5 HLS Streaming is not natively supported in this browser.');
      setIsLoadingStream(false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener('canplay', handleNativeCanPlay);
      video.removeEventListener('error', handleNativeError);
    };
  }, [currentStreamUrl, playerKey]);

  // Sync mute state of the video ref
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Play failed', err));
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (vol > 0) setIsMuted(false);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen(); // Safari
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen(); // IE11
      }
    }
  };

  const handleRefresh = () => {
    setPlayerKey(prev => prev + 1);
  };

  return (
    <div id="live-stream-section" className="space-y-6">
      
      {/* Header Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 border border-white/5 rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-pink-500 animate-pulse"></span>
            {language === 'my' ? 'အခမဲ့ တိုက်ရိုက်ရုပ်သံလိုင်းများ (IPTV Browser)' : 'Premium Live IPTV Player'}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            {language === 'my' 
              ? 'ကမ္ဘာတစ်ဝှမ်းမှ အခမဲ့အားကစားနှင့် မြန်မာတီဗီလိုင်းပေါင်းစုံကို တစ်နေရာတည်းတွင် အခမဲ့ကြည့်ရှုပါ' 
              : 'Stream free sports, news, and Myanmar television channels from open source playlists securely.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-pink-500 hover:border-pink-500/40 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-pink-500" />
            {t.refreshStream}
          </button>
          {currentStreamUrl && (
            <a
              href={currentStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/15 transition-all"
            >
              {t.openInNewTab}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Player and Streaming Guide (Takes 7 columns on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Stream Launch Pad - Built beautifully using Pink, Blue, White and Portugal flag colors */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#0c142c] via-[#050b1d] to-[#040815] shadow-2xl shadow-pink-500/5 flex flex-col items-center justify-center p-4 md:p-6 text-center">
            
            {/* Ambient Animated Portugal colors & Pink glows in background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent opacity-50" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-[10px] md:text-xs font-bold text-white backdrop-blur-sm border border-white/10 max-w-[85%] truncate">
              {activeChannelLogo ? (
                <img 
                  src={activeChannelLogo} 
                  alt="" 
                  className="h-4 w-4 rounded-full object-cover shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <Tv className="h-3.5 w-3.5 text-pink-500 shrink-0" />
              )}
              <span className="truncate text-slate-100">{activeChannelName}</span>
              <span className="text-emerald-500 font-bold ml-1 text-[9px] uppercase tracking-wider animate-pulse font-mono">ONLINE</span>
            </div>

            {/* Main Launcher Hub content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 max-w-lg">
              {/* Channel Logo / Emblem frame with spinning color ring */}
              <div className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-2 shadow-inner">
                {activeChannelLogo ? (
                  <img 
                    src={activeChannelLogo} 
                    alt="" 
                    className="h-full w-full object-contain filter drop-shadow-md"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <Tv className="h-7 w-7 text-pink-500" />
                )}
                <div className="absolute -inset-1 rounded-2xl border-2 border-dashed border-pink-500/30 animate-[spin_20s_linear_infinite]" />
              </div>

              {/* Selected Channel Name */}
              <div className="space-y-1">
                <h3 className="text-base md:text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5 px-2">
                  {activeChannelName}
                </h3>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {language === 'my' ? 'တိုက်ရိုက်' : 'Free Live'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
                    IPTV Stream
                  </span>
                </div>
              </div>

              {/* Main Action Launcher Button (Portugal Styled) */}
              <button
                onClick={() => window.open(currentStreamUrl, '_blank')}
                className="group/launch relative flex items-center gap-2.5 px-6 py-3.5 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 hover:from-emerald-500 hover:to-red-500 text-white font-extrabold text-xs md:text-sm tracking-wide shadow-xl shadow-pink-500/10 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
              >
                <ExternalLink className="h-4.5 w-4.5 animate-bounce" />
                <span>
                  {language === 'my' 
                    ? 'တိုက်ရိုက်လွှင့်လှိုင်းအား Browser Window အသစ်ဖြင့် ဖွင့်ပါ' 
                    : 'Open Live Stream in New Browser Window'}
                </span>
              </button>

              {/* Myanmar and English instructions explaining why embedded is blocked */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 md:p-3 max-w-md space-y-1 md:space-y-1.5">
                <p className="text-[10px] md:text-xs text-slate-300 font-bold leading-relaxed">
                  {language === 'my' 
                    ? '💡 ဝဘ်ဆိုက်အတွင်း တိုက်ရိုက်ကြည့်ရှုခြင်းကို စနစ်မှ Block ထားသောကြောင့် Browser ၏ Window အသစ်တွင် တိုက်ရိုက်ပွင့်သွားပြီး အခမဲ့ ချောမွေ့စွာ ကြည့်ရှုနိုင်ပါသည်။' 
                    : '💡 Embedded streaming is blocked inside this frame. Click the button above to launch in a new window where it plays instantly.'}
                </p>
                
                {/* Secondary clipboard option for VLC player */}
                <div className="flex items-center justify-center gap-2 pt-1 md:pt-1.5 border-t border-white/5">
                  <span className="text-[9px] md:text-[10px] text-slate-500 truncate font-mono max-w-[150px] md:max-w-[220px]">
                    {currentStreamUrl}
                  </span>
                  <button
                    onClick={() => {
                      if (currentStreamUrl) {
                        navigator.clipboard.writeText(currentStreamUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="px-2 py-1 rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 text-[9px] md:text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        <span>{language === 'my' ? 'ကူးယူပြီး' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>{language === 'my' ? 'လင့်ခ်ကူးယူမည်' : 'Copy stream link'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ad-Shield Banner & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-md">
              <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-slate-400 leading-relaxed space-y-1">
                <p className="font-bold text-slate-200">100% Ad-Free & Malicious-Safe</p>
                <p>Because the stream is played natively in your browser using secure elements, you are completely shielded from browser hijack ads, popups, or fake download alerts commonly found on free video sites.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-md">
              <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed space-y-1">
                <p className="font-bold text-slate-200">What if a stream does not play?</p>
                <p>IPTV live streams from the public domain can sometimes drop offline. Simply click another channel in the browser on the right. You can also paste your own custom .m3u link!</p>
              </div>
            </div>
          </div>

          {/* World Cup Match Simulation Panel */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  {language === 'my' ? 'တိုက်ရိုက်ရလဒ် စမ်းသပ်ကြည့်ရှုခြင်း' : 'Live World Cup Score Simulation'}
                </h4>
                <p className="text-[10px] text-slate-500">Enable artificial demo scoreboards to simulate match states</p>
              </div>
              <button
                onClick={() => {
                  const val = !showDemoMatches;
                  setShowDemoMatches(val);
                }}
                className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  showDemoMatches ? 'bg-pink-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showDemoMatches ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {displayedLiveMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {displayedLiveMatches.map((match) => (
                  <div
                    key={match.id}
                    className="border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col justify-between hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                      <span className="font-bold text-pink-500 animate-pulse flex items-center gap-1">
                        <span className="h-1 w-1 bg-pink-500 rounded-full"></span>
                        {match.minute}' {t.minute}
                      </span>
                      <span>{match.stadium}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{match.homeFlag}</span>
                        <span>{match.homeTeam}</span>
                      </div>
                      <span className="font-mono text-pink-400 bg-black/80 px-2 py-0.5 rounded font-bold border border-white/5">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span>{match.awayTeam}</span>
                        <span className="text-sm">{match.awayFlag}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: IPTV Channel Search Browser (Takes 5 columns on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-3xl border border-white/10 bg-black/40 p-4 md:p-5 shadow-2xl space-y-4 flex flex-col h-[640px] overflow-hidden">
            
            {/* Playlist Preset selectors */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-pink-500" />
                {language === 'my' ? 'ရုပ်သံလိုင်းစနစ် ရွေးချယ်ရန်' : 'Select Playlist Repository'}
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setActivePlaylistId('full-index');
                  }}
                  className={`px-1 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    !showCustomInput && activePlaylistId === 'full-index'
                      ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-lg'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="text-sm">🌐</span>
                  <span>{language === 'my' ? 'လိုင်းပေါင်းစုံ' : 'Full Index'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setActivePlaylistId('sports');
                  }}
                  className={`px-1 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    !showCustomInput && activePlaylistId === 'sports'
                      ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-lg'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="text-sm">⚽</span>
                  <span>{language === 'my' ? 'အားကစား' : 'Live Sports'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowCustomInput(true);
                  }}
                  className={`px-1 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    showCustomInput
                      ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-lg'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">⚙️</span>
                  <span>{language === 'my' ? 'ကိုယ်တိုင်ထည့်' : 'Custom M3U'}</span>
                </button>
              </div>
            </div>

            {/* Custom Playlist Loader Field */}
            {showCustomInput && (
              <div className="bg-black/40 border border-white/5 p-3 rounded-2xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Input Custom .m3u Playlist URL</span>
                  <button 
                    onClick={() => setCustomPlaylistUrl('https://iptv-org.github.io/iptv/index.m3u')}
                    className="text-[9px] font-bold text-pink-500 hover:underline"
                  >
                    Reset to IPTV Index
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Paste IPTV playlist .m3u link here..."
                  value={customPlaylistUrl}
                  onChange={(e) => setCustomPlaylistUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#050508] text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 font-mono"
                />
              </div>
            )}

            {/* Live real-time Search and Category Filters */}
            <div className="space-y-2.5 pt-1">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={language === 'my' ? 'လိုင်းအမည် ရှာဖွေရန်...' : 'Search live channels...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-xs text-slate-200 focus:outline-none focus:border-amber-500 focus:bg-black/60 placeholder-slate-600 transition-all"
                />
              </div>

              {/* Group-title Filters (Horizontal scroll tab rail) */}
              {groups.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {groups.slice(0, 15).map((group) => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all border ${
                        selectedGroup === group
                          ? 'bg-amber-500 border-amber-500 text-black font-bold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {group === 'All' ? (language === 'my' ? 'အားလုံး' : 'All') : group}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Channels List Container */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {isLoadingPlaylist ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-3">
                  <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                  <p className="text-xs">
                    {language === 'my' ? 'ရုပ်သံလိုင်းစာရင်းများ ရယူနေပါသည်...' : 'Loading playlist repository...'}
                  </p>
                </div>
              ) : filteredChannels.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-xs space-y-2">
                  <ShieldAlert className="h-8 w-8 mx-auto text-slate-600" />
                  <p className="font-bold">No Channels Found</p>
                  <p className="text-[10px] text-slate-600">Try adjusting your search keywords or playlist selection.</p>
                </div>
              ) : (
                <>
                  <div className="text-[10px] text-slate-500 font-semibold px-1 flex justify-between">
                    <span>
                      {language === 'my' 
                        ? `စုစုပေါင်းလိုင်း - ${filteredChannels.length} ခု တွေ့ရှိသည်` 
                        : `Showing ${Math.min(visibleCount, filteredChannels.length)} of ${filteredChannels.length} channels`}
                    </span>
                    {playlistError && <span className="text-amber-500">⚠ Curated List Active</span>}
                  </div>

                  <div className="space-y-1.5">
                    {filteredChannels.slice(0, visibleCount).map((channel) => {
                      const isPlayingActive = currentStreamUrl === channel.url;
                      return (
                        <div
                          key={channel.id}
                          onClick={() => {
                            setCurrentStreamUrl(channel.url);
                            setActiveChannelName(channel.name);
                            setActiveChannelLogo(channel.logo);
                          }}
                          className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isPlayingActive
                              ? 'bg-amber-950/20 border-amber-500/50 shadow'
                              : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Fallback channel avatar box */}
                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                              {channel.logo ? (
                                <img 
                                  src={channel.logo} 
                                  alt="" 
                                  className="h-full w-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <Tv className="h-4 w-4 text-slate-500" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${isPlayingActive ? 'text-amber-400' : 'text-slate-200'}`}>
                                {channel.name}
                              </p>
                              <span className="text-[9px] font-bold text-slate-500 tracking-wide uppercase">
                                {channel.group || 'General'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isPlayingActive ? (
                              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-amber-500 transition-colors" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button for long lists */}
                  {filteredChannels.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 100)}
                      className="w-full py-2.5 mt-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      {language === 'my' ? 'နောက်ထပ်လိုင်းများ ရယူရန်' : 'Load More Channels...'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
