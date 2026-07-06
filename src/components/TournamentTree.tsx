import React, { useState } from 'react';
import { Language, Match } from '../types';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, Sparkles, Star } from 'lucide-react';
import Flag from './Flag';

interface TournamentTreeProps {
  language: Language;
  matches: Match[];
}

export default function TournamentTree({ language, matches }: TournamentTreeProps) {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  // Translation helpers
  const translateTeam = (teamName: string): string => {
    if (language === 'en') return teamName;
    const map: Record<string, string> = {
      'England': 'အင်္ဂလန်',
      'France': 'ပြင်သစ်',
      'Brazil': 'ဘရာဇီး',
      'Norway': 'နော်ဝေ',
      'United States': 'ယူနိုက်တက်စတိတ်',
      'Portugal': 'ပေါ်တူဂီ',
      'Netherlands': 'နယ်သာလန်',
      'Argentina': 'အာဂျင်တီးနား',
      'Germany': 'ဂျာမနီ',
      'Spain': 'စပိန်',
      'Japan': 'ဂျပန်',
      'Mexico': 'မက္ကဆီကို',
      'Paraguay': 'ပါရာဂွေး',
      'Canada': 'ကနေဒါ',
      'Morocco': 'မော်ရိုကို',
      'Winner R16 Match 1': 'Match 1 အနိုင်ရသူ',
      'Winner R16 Match 2': 'Match 2 အနိုင်ရသူ',
      'Winner R16 Match 3': 'Match 3 အနိုင်ရသူ',
      'Winner R16 Match 4': 'Match 4 အနိုင်ရသူ',
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

  // Helper to determine the winner of a match by ID
  const getMatchWinnerObj = (matchId: string): { name: string; flag: string } | null => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;
    if (match.status !== 'completed') return null;
    
    const homeScore = match.homeScore || 0;
    const awayScore = match.awayScore || 0;
    
    if (homeScore > awayScore) {
      return { name: match.homeTeam, flag: match.homeFlag };
    } else if (awayScore > homeScore) {
      return { name: match.awayTeam, flag: match.awayFlag };
    } else {
      return { name: match.homeTeam, flag: match.homeFlag };
    }
  };

  // Helper to resolve team name and flag (handling placeholders dynamically!)
  const resolveTeam = (teamName: string, defaultFlag: string): { name: string; flag: string } => {
    if (teamName === 'Winner R16 Match 1') {
      const winner = getMatchWinnerObj('live-2'); // Winner of Mexico vs England
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Winner R16 Match 2') {
      const winner = getMatchWinnerObj('live-4'); // Winner of Paraguay vs France
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Winner R16 Match 3') {
      const winner = getMatchWinnerObj('live-1'); // Winner of Brazil vs Norway
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Winner R16 Match 4') {
      const winner = getMatchWinnerObj('live-3'); // Winner of Canada vs Morocco
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Winner R16 Match 5') {
      const winner = getMatchWinnerObj('up-1'); // Winner of Portugal vs Netherlands
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Semifinalist 1') {
      const winner = getMatchWinnerObj('up-4'); // Winner of QF1
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Semifinalist 2') {
      const winner = getMatchWinnerObj('up-3'); // Winner of QF2
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Finalist 1') {
      const winner = getMatchWinnerObj('up-5'); // Winner of SF1
      return winner || { name: teamName, flag: defaultFlag };
    }
    if (teamName === 'Finalist 2') {
      const winner = getMatchWinnerObj('up-6'); // Winner of SF2
      return winner || { name: teamName, flag: defaultFlag };
    }
    return { name: teamName, flag: defaultFlag };
  };

  const getTreeMatch = (matchId: string, fallback: {
    id: string;
    home: string;
    homeFlag: string;
    homeScore: string;
    away: string;
    awayFlag: string;
    awayScore: string;
    status: string;
    isLive: boolean;
    time: string;
  }) => {
    const matchObj = matches.find(m => m.id === matchId);
    if (!matchObj) return fallback;

    const isLive = matchObj.status === 'live';
    const isCompleted = matchObj.status === 'completed';
    
    let statusText = '';
    if (isLive) {
      statusText = language === 'my' 
        ? `တိုက်ရိုက် ${matchObj.minute}'` 
        : `Live ${matchObj.minute}'`;
    } else if (isCompleted) {
      statusText = language === 'my' ? 'ပြီးဆုံး' : 'Completed';
    } else {
      statusText = language === 'my' ? 'လာမည့်ပွဲ' : 'Upcoming';
    }

    let timeText = '';
    if (isLive) {
      timeText = language === 'my' ? 'ယနေ့ တိုက်ရိုက်' : 'Live Today';
    } else {
      if (matchObj.date === '2026-07-06' || matchObj.date === '2026-07-05') {
        timeText = language === 'my' ? `ယနေ့ ${matchObj.time}` : `Today ${matchObj.time}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const parts = matchObj.date.split('-');
        const monthNum = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthName = months[monthNum] || 'Jul';
        timeText = `${monthName} ${day} ${matchObj.time}`;
      }
    }

    // Resolve placeholders dynamically
    const resolvedHome = resolveTeam(matchObj.homeTeam, matchObj.homeFlag || '🏳️');
    const resolvedAway = resolveTeam(matchObj.awayTeam, matchObj.awayFlag || '🏳️');

    return {
      id: matchObj.id,
      home: resolvedHome.name,
      homeFlag: resolvedHome.flag,
      homeScore: matchObj.homeScore !== undefined ? String(matchObj.homeScore) : '-',
      away: resolvedAway.name,
      awayFlag: resolvedAway.flag,
      awayScore: matchObj.awayScore !== undefined ? String(matchObj.awayScore) : '-',
      status: statusText,
      isLive,
      time: timeText
    };
  };

  // Bracket data nodes (dynamically synchronized)
  const roundOf16Matches = [
    getTreeMatch('live-2', {
      id: 'r16-1',
      home: 'Mexico',
      homeFlag: '🇲🇽',
      homeScore: '2',
      away: 'England',
      awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      awayScore: '3',
      status: 'Completed',
      isLive: false,
      time: 'Today 07:00'
    }),
    getTreeMatch('live-4', {
      id: 'r16-2',
      home: 'Paraguay',
      homeFlag: '🇵🇾',
      homeScore: '0',
      away: 'France',
      awayFlag: '🇫🇷',
      awayScore: '1',
      status: 'Completed',
      isLive: false,
      time: 'Yesterday 18:00'
    }),
    getTreeMatch('live-1', {
      id: 'r16-3',
      home: 'Brazil',
      homeFlag: '🇧🇷',
      homeScore: '1',
      away: 'Norway',
      awayFlag: '🇳🇴',
      awayScore: '2',
      status: 'Completed',
      isLive: false,
      time: 'Today 03:00'
    }),
    getTreeMatch('live-3', {
      id: 'r16-4',
      home: 'Canada',
      homeFlag: '🇨🇦',
      homeScore: '0',
      away: 'Morocco',
      awayFlag: '🇲🇦',
      awayScore: '3',
      status: 'Completed',
      isLive: false,
      time: 'Yesterday 15:00'
    })
  ];

  const quarterfinalsMatches = [
    getTreeMatch('up-4', {
      id: 'qf-1',
      home: 'Winner R16 Match 1',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Winner R16 Match 2',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 11 18:00'
    }),
    getTreeMatch('up-3', {
      id: 'qf-2',
      home: 'Winner R16 Match 3',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Winner R16 Match 4',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 10 19:00'
    })
  ];

  const semifinalsMatches = [
    getTreeMatch('up-5', {
      id: 'sf-1',
      home: 'Semifinalist 1',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Semifinalist 2',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 14 20:00'
    }),
    getTreeMatch('up-6', {
      id: 'sf-2',
      home: 'Semifinalist 3',
      homeFlag: '🏳️',
      homeScore: '-',
      away: 'Semifinalist 4',
      awayFlag: '🏳️',
      awayScore: '-',
      status: 'Upcoming',
      isLive: false,
      time: 'Jul 15 20:00'
    })
  ];

  const finalMatch = getTreeMatch('up-8', {
    id: 'final-1',
    home: 'Finalist 1',
    homeFlag: '🏳️',
    homeScore: '-',
    away: 'Finalist 2',
    awayFlag: '🏳️',
    awayScore: '-',
    status: 'Upcoming',
    isLive: false,
    time: 'Jul 19 18:00'
  });

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
                      <Flag country={match.home} emoji={match.homeFlag} size="sm" />
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
                      <Flag country={match.away} emoji={match.awayFlag} size="sm" />
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
                      <Flag country={match.home} emoji={match.homeFlag} size="sm" />
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
                      <Flag country={match.away} emoji={match.awayFlag} size="sm" />
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
                      <Flag country={match.home} emoji={match.homeFlag} size="sm" />
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
                      <Flag country={match.away} emoji={match.awayFlag} size="sm" />
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
                    <Flag country={finalMatch.home} emoji={finalMatch.homeFlag} size="sm" />
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
                    <Flag country={finalMatch.away} emoji={finalMatch.awayFlag} size="sm" />
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
              {(() => {
                const champ = getMatchWinnerObj('up-8');
                if (champ) {
                  return (
                    <span className="text-xs font-black text-yellow-400 mt-1 flex items-center gap-1.5 animate-pulse">
                      <Flag country={champ.name} emoji={champ.flag} size="sm" />
                      {translateTeam(champ.name)}
                    </span>
                  );
                }
                return (
                  <span className="text-xs font-bold text-slate-400 mt-1">TBD</span>
                );
              })()}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
