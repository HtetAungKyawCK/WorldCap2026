import React, { useState } from 'react';
import { Language } from '../types';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, Sparkles, Star } from 'lucide-react';

interface TournamentTreeProps {
  language: Language;
}

export default function TournamentTree({ language }: TournamentTreeProps) {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  // Translation helpers
  const translateTeam = (teamName: string): string => {
    if (language === 'en') return teamName;
    const map: Record<string, string> = {
      'England': 'အင်္ဂလန်',
      'France': 'ပြင်သစ်',
      'Brazil': 'ဘရာဇီး',
      'United States': 'ယူနိုက်တက်စတိတ်',
      'Portugal': 'ပေါ်တူဂီ',
      'Netherlands': 'နယ်သာလန်',
      'Argentina': 'အာဂျင်တီးနား',
      'Germany': 'ဂျာမနီ',
      'Spain': 'စပိန်',
      'Japan': 'ဂျပန်',
      'Winner R16 Match 1': 'Match 1 အနိုင်ရသူ',
      'Winner R16 Match 2': 'Match 2 အနိုင်ရသူ',
      'Winner R16 Match 5': 'Match 5 အနိုင်ရသူ',
      'Semifinalist 1': 'ဆီမီးဖိုင်နယ်ဝင် ၁',
      'Semifinalist 2': 'ဆီမီးဖိုင်နယ်ဝင် ၂',
      'Semifinalist 3': 'ဆီမီးဖိုင်နယ်ဝင် ၃',
      'Semifinalist 4': 'ဆီမီးဖိုင်နယ်ဝင် ၄',
      'Finalist 1': 'ဗိုလ်လုပွဲတက်သူ ၁',
      'Finalist 2': 'ဗိုလ်လုပွဲတက်သူ ၂',
      'TBD': 'ဆုံးဖြတ်ရန်ကျန်'
    };
    return map[teamName] || teamName;
  };

  // Bracket data nodes
  const roundOf16Matches = [
    {
      id: 'r16-1',
      home: 'England',
      homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      homeScore: '1',
      away: 'France',
      awayFlag: '🇫🇷',
      awayScore: '1',
      status: 'Live 72\'',
      isLive: true,
      time: 'Today 18:00'
    },
    {
      id: 'r16-2',
      home: 'Brazil',
      homeFlag: '🇧🇷',
      homeScore: '2',
      away: 'United States',
      awayFlag: '🇺🇸',
      awayScore: '1',
      status: 'Live 24\'',
      isLive: true,
      time: 'Today 21:00'
    },
    {
      id: 'r16-3',
      home: 'Portugal',
      homeFlag: '🇵🇹',
      homeScore: '-',
      away: 'Netherlands',
      awayFlag: '🇳🇱',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 6 18:00'
    },
    {
      id: 'r16-4',
      home: 'Argentina',
      homeFlag: '🇦🇷',
      homeScore: '-',
      away: 'Germany',
      awayFlag: '🇩🇪',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 7 17:00'
    }
  ];

  const quarterfinalsMatches = [
    {
      id: 'qf-1',
      home: 'Winner R16 Match 1',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Winner R16 Match 2',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      time: 'Jul 11 18:00'
    },
    {
      id: 'qf-2',
      home: 'Spain',
      homeFlag: '🇪🇸',
      homeScore: '-',
      away: 'Winner R16 Match 5',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      time: 'Jul 10 19:00'
    }
  ];

  const semifinalsMatches = [
    {
      id: 'sf-1',
      home: 'Semifinalist 1',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Semifinalist 2',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      time: 'Jul 14 20:00'
    },
    {
      id: 'sf-2',
      home: 'Semifinalist 3',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Semifinalist 4',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      time: 'Jul 15 20:00'
    }
  ];

  const finalMatch = {
    id: 'final-1',
    home: 'Finalist 1',
    homeFlag: '🏳️',
    homeScore: '-',
    away: 'Finalist 2',
    awayFlag: '🏳️',
    awayScore: '-',
    status: 'Upcoming',
    time: 'Jul 19 18:00'
  };

  const isHighlighted = (team: string) => {
    if (!hoveredTeam) return false;
    if (team === 'TBD' || team.includes('Winner') || team.includes('Semifinalist') || team.includes('Finalist')) return false;
    return team.toLowerCase() === hoveredTeam.toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-pink-500/10 bg-gradient-to-r from-pink-500/5 to-transparent p-5 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-500 border border-pink-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-extrabold text-white uppercase tracking-tight">
              {language === 'my' ? 'ရှုံးထွက်လမ်းပြမြေပုံ (Playoff Tree Bracket)' : 'Interactive Playoff Bracket Map'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
              {language === 'my'
                ? '၁၆ သင်းအဆင့်မှ ဗိုလ်လုပွဲအထိ တိုက်ရိုက်တက်လှမ်းမည့် အဆင့်ဆင့်သော ပွဲစဉ်လမ်းကြောင်းကို Tree ဖြင့် ကြည့်ရှုပါ။ သက်ဆိုင်ရာအသင်းများအပေါ် Mouse တင်ကာ လမ်းကြောင်းကို ထင်ရှားစွာ ကြည့်ရှုနိုင်ပါသည်။'
                : 'Track the road to the FIFA World Cup 2026 glory. Hover over any country to trace their prospective path through the knockout bracket tree.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bracket Tree Container with horizontal scrolling on mobile, full flex layout on desktop */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
        <div className="min-w-[850px] relative px-4 py-8 flex items-center justify-between gap-6">
          
          {/* COLUMN 1: ROUND OF 16 */}
          <div className="flex flex-col justify-around h-[480px] w-56 space-y-6">
            <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest pl-2 mb-1 border-l-2 border-pink-500/30">
              {language === 'my' ? '၁၆ သင်းအဆင့်' : 'Round of 16'}
            </div>
            {roundOf16Matches.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="relative group/card"
              >
                {/* Match Box Card */}
                <div className="rounded-xl border border-white/10 bg-[#050b1d]/90 p-3 shadow-lg space-y-2.5 transition-all duration-300 hover:border-pink-500/40 hover:shadow-pink-500/5 select-none">
                  {/* Team A Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.home)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.home) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate">
                      <span className="text-base shrink-0">{match.homeFlag}</span>
                      <span className="truncate">{translateTeam(match.home)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-300">
                      {match.homeScore}
                    </span>
                  </div>

                  {/* Team B Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.away)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.away) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate">
                      <span className="text-base shrink-0">{match.awayFlag}</span>
                      <span className="truncate">{translateTeam(match.away)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-300">
                      {match.awayScore}
                    </span>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-white/5 font-mono">
                    <span className="text-slate-500">{match.time}</span>
                    {match.isLive ? (
                      <span className="text-emerald-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="h-1 w-1 bg-emerald-500 rounded-full"></span>
                        {match.status}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-semibold">{match.status}</span>
                    )}
                  </div>
                </div>

                {/* Connector Branch Graphic */}
                <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-white/15 group-hover/card:bg-pink-500/30 transition-all pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* COLUMN 2: QUARTERFINALS */}
          <div className="flex flex-col justify-around h-[480px] w-56 space-y-6">
            <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest pl-2 mb-1 border-l-2 border-pink-500/30">
              {language === 'my' ? 'ကွာတားဖိုင်နယ်' : 'Quarterfinals'}
            </div>
            {quarterfinalsMatches.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                className="relative group/card"
              >
                {/* Connector Left branches feeding into the card */}
                <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-white/15 pointer-events-none" />

                {/* Match Box Card */}
                <div className="rounded-xl border border-white/10 bg-[#050b1d]/90 p-3 shadow-lg space-y-2.5 transition-all duration-300 hover:border-pink-500/40 hover:shadow-pink-500/5 select-none">
                  {/* Team A Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.home)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.home) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate text-slate-400">
                      <span className="text-base shrink-0">{match.homeFlag}</span>
                      <span className="truncate">{translateTeam(match.home)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                      {match.homeScore}
                    </span>
                  </div>

                  {/* Team B Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.away)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.away) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate text-slate-400">
                      <span className="text-base shrink-0">{match.awayFlag}</span>
                      <span className="truncate">{translateTeam(match.away)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                      {match.awayScore}
                    </span>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-white/5 font-mono">
                    <span className="text-slate-500">{match.time}</span>
                    <span className="text-slate-600 font-semibold">{match.status}</span>
                  </div>
                </div>

                {/* Connector Right Branch Graphic */}
                <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-white/15 group-hover/card:bg-pink-500/30 transition-all pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* COLUMN 3: SEMIFINALS */}
          <div className="flex flex-col justify-around h-[480px] w-56 space-y-6">
            <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest pl-2 mb-1 border-l-2 border-pink-500/30">
              {language === 'my' ? 'ဆီမီးဖိုင်နယ်' : 'Semifinals'}
            </div>
            {semifinalsMatches.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.4 }}
                className="relative group/card"
              >
                {/* Connector Left branch */}
                <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-white/15 pointer-events-none" />

                {/* Match Box Card */}
                <div className="rounded-xl border border-white/10 bg-[#050b1d]/90 p-3 shadow-lg space-y-2.5 transition-all duration-300 hover:border-pink-500/40 hover:shadow-pink-500/5 select-none">
                  {/* Team A Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.home)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.home) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate text-slate-500">
                      <span className="text-base shrink-0">{match.homeFlag}</span>
                      <span className="truncate">{translateTeam(match.home)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                      {match.homeScore}
                    </span>
                  </div>

                  {/* Team B Row */}
                  <div 
                    onMouseEnter={() => setHoveredTeam(match.away)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                      isHighlighted(match.away) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs truncate text-slate-500">
                      <span className="text-base shrink-0">{match.awayFlag}</span>
                      <span className="truncate">{translateTeam(match.away)}</span>
                    </div>
                    <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                      {match.awayScore}
                    </span>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-white/5 font-mono">
                    <span className="text-slate-500">{match.time}</span>
                    <span className="text-slate-600 font-semibold">{match.status}</span>
                  </div>
                </div>

                {/* Connector Right Branch to Final */}
                <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-white/15 group-hover/card:bg-pink-500/30 transition-all pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* COLUMN 4: THE GRAND FINAL & CHAMPION */}
          <div className="flex flex-col justify-center h-[480px] w-56 space-y-8">
            <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest pl-2 mb-1 border-l-2 border-pink-500/30">
              {language === 'my' ? 'ဗိုလ်လုပွဲ' : 'Grand Final'}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative group/card"
            >
              {/* Connector Left branch from SF */}
              <div className="absolute top-1/2 -left-6 w-6 h-[1px] bg-white/15 pointer-events-none" />

              {/* Match Box Card (Grand Final Highlighted in Gold/Pink Gradient Border) */}
              <div className="rounded-xl border-2 border-dashed border-pink-500/40 bg-[#0c142c] p-4 shadow-xl space-y-3 transition-all duration-300 hover:border-pink-500 hover:shadow-pink-500/10 select-none">
                {/* Team A Row */}
                <div 
                  onMouseEnter={() => setHoveredTeam(finalMatch.home)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                    isHighlighted(finalMatch.home) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs truncate text-slate-500 font-bold">
                    <span className="text-base shrink-0">{finalMatch.homeFlag}</span>
                    <span className="truncate">{translateTeam(finalMatch.home)}</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                    {finalMatch.homeScore}
                  </span>
                </div>

                {/* Team B Row */}
                <div 
                  onMouseEnter={() => setHoveredTeam(finalMatch.away)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                    isHighlighted(finalMatch.away) ? 'bg-pink-500/15 border-l-2 border-pink-500 pl-2 text-white font-bold' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs truncate text-slate-500 font-bold">
                    <span className="text-base shrink-0">{finalMatch.awayFlag}</span>
                    <span className="truncate">{translateTeam(finalMatch.away)}</span>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 bg-black/40 rounded border border-white/5 text-slate-500">
                    {finalMatch.awayScore}
                  </span>
                </div>

                {/* Status Indicator Bar */}
                <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-white/5 font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 text-pink-400">
                    🏆 {language === 'my' ? 'ဗိုလ်လုပွဲ' : 'WORLD CUP FINAL'}
                  </span>
                  <span className="text-slate-400 font-bold">{finalMatch.time}</span>
                </div>
              </div>
            </motion.div>

            {/* Champion Pod representation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />
              <Trophy className="h-10 w-10 text-yellow-400 drop-shadow-lg mb-2 animate-bounce" />
              <div className="text-[10px] font-black uppercase tracking-wider text-pink-400 flex items-center gap-1 justify-center">
                <Star className="h-3 w-3 fill-pink-500 text-pink-500" />
                <span>{language === 'my' ? '၂၀၂၆ ချန်ပီယံ' : '2026 Champion'}</span>
                <Star className="h-3 w-3 fill-pink-500 text-pink-500" />
              </div>
              <span className="text-xs font-bold text-slate-400 mt-1">TBD</span>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
