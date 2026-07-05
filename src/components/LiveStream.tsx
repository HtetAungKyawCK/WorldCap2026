import { useState } from 'react';
import { Language, Match } from '../types';
import { translations } from '../data/translations';
import { Tv, Play, AlertCircle, RefreshCw, ExternalLink, ShieldAlert, Clock, Star, Volume2 } from 'lucide-react';

interface LiveStreamProps {
  language: Language;
  liveMatches: Match[];
}

export default function LiveStream({ language, liveMatches }: LiveStreamProps) {
  const t = translations[language];
  const [playerKey, setPlayerKey] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(liveMatches[0] || null);

  const streamUrl = "https://th.livesports077.com/";

  const handleRefresh = () => {
    setPlayerKey(prev => prev + 1);
  };

  return (
    <div id="live-stream-section" className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 animate-pulse"></span>
            {t.liveTitle}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {t.liveSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-amber-500 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t.refreshStream}
          </button>
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-lg shadow-amber-500/10 transition-all"
          >
            {t.openInNewTab}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stream Player Frame */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            {/* Top Player Indicator */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
              <Tv className="h-3.5 w-3.5 text-amber-500" />
              <span>Livesports Server 1</span>
            </div>

            {/* Embed Iframe */}
            <iframe
              key={playerKey}
              src={streamUrl}
              className="h-full w-full"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Livesports Streaming Player"
              id="live-stream-iframe"
            />
          </div>

          {/* Streaming Note Alert Box */}
          <div className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-4">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-200">{t.liveServerNote}</p>
              <p>{t.adBlockerWarning}</p>
            </div>
          </div>
        </div>

        {/* Live Matches List & Real-time Scorers side-panel */}
        <div className="space-y-4">
          {/* Active Live Matches Panel Header */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase mb-4 flex items-center justify-between">
              <span>{t.navLive}</span>
              <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 animate-pulse tracking-wide">
                {t.liveBadge}
              </span>
            </h3>

            {liveMatches.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <ShieldAlert className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p>{t.noLiveMatches}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {liveMatches.map((match) => {
                  const isSelected = selectedMatch?.id === match.id;
                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`group relative overflow-hidden rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-950/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {/* Match Minute Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          {match.minute}' {t.minute}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {match.stadium}, {match.city}
                        </span>
                      </div>

                      {/* Team vs Team Layout */}
                      <div className="grid grid-cols-7 items-center gap-1.5 py-1">
                        {/* Home Team */}
                        <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                          <span className="text-xs font-semibold text-white truncate max-w-[85px] md:max-w-none">
                            {language === 'my' && match.homeTeam === 'England' ? 'အင်္ဂလန်' : 
                             language === 'my' && match.homeTeam === 'Brazil' ? 'ဘရာဇီး' : 
                             language === 'my' && match.homeTeam === 'United States' ? 'ယူအက်စ်အေ' : 
                             language === 'my' && match.homeTeam === 'France' ? 'ပြင်သစ်' : match.homeTeam}
                          </span>
                          <span className="text-lg leading-none shrink-0" role="img" aria-label={match.homeTeam}>{match.homeFlag}</span>
                        </div>

                        {/* Scores */}
                        <div className="col-span-1 flex items-center justify-center bg-black/80 py-1 rounded-md border border-white/10 font-mono text-sm font-bold text-amber-500">
                          {match.homeScore} - {match.awayScore}
                        </div>

                        {/* Away Team */}
                        <div className="col-span-3 flex items-center gap-2 text-left">
                          <span className="text-lg leading-none shrink-0" role="img" aria-label={match.awayTeam}>{match.awayFlag}</span>
                          <span className="text-xs font-semibold text-white truncate max-w-[85px] md:max-w-none">
                            {language === 'my' && match.awayTeam === 'England' ? 'အင်္ဂလန်' : 
                             language === 'my' && match.awayTeam === 'Brazil' ? 'ဘရာဇီး' : 
                             language === 'my' && match.awayTeam === 'United States' ? 'ယူအက်စ်အေ' : 
                             language === 'my' && match.awayTeam === 'France' ? 'ပြင်သစ်' : match.awayTeam}
                          </span>
                        </div>
                      </div>

                      {/* Expand Scorer section if selected */}
                      {isSelected && match.scorers && match.scorers.length > 0 && (
                        <div className="mt-3.5 pt-2.5 border-t border-white/10">
                          <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                            <Volume2 className="h-3 w-3" />
                            {t.scorersLabel}
                          </p>
                          <div className="space-y-1">
                            {match.scorers.map((scorer, i) => (
                              <div key={i} className="flex items-center justify-between text-[11px] text-slate-400">
                                <span className={scorer.team === 'home' ? 'font-medium text-slate-300' : 'text-slate-500 text-right w-full pr-1'}>
                                  {scorer.team === 'home' ? `⚽ ${scorer.name}` : ''}
                                </span>
                                <span className="text-slate-500 font-mono px-1.5">{scorer.time}'</span>
                                <span className={scorer.team === 'away' ? 'font-medium text-slate-300 text-right w-full pl-1' : 'text-slate-500 text-left w-full'}>
                                  {scorer.team === 'away' ? `${scorer.name} ⚽` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Tip / Support card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              {t.videoSettings}
            </h4>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>{language === 'my' ? 'ဗီဒီယို မပွင့်ပါက ညာဖက်အပေါ်ရှိ Window အသစ်ဖြင့် ကြည့်ရန် ကို နှိပ်ကြည့်ပါ' : 'If the video doesn\'t load, use the external launch button.'}</li>
              <li>{language === 'my' ? 'မြန်နှုန်းမြင့် အင်တာနက် လိုင်းဖြစ်ရန် လိုအပ်ပါသည်' : 'Ensure you have a stable, high-speed internet connection.'}</li>
              <li>{language === 'my' ? 'ပလေယာတွင် အသံပိတ်ထားပါက အသံဖွင့်ရန် Speaker ပုံကို နှိပ်ပါ' : 'Unmute the player controls if no sound is playing.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
