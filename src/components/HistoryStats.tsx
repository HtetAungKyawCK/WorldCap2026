import { useState } from 'react';
import { Language, WorldCupWinner, HistoricalMatchup } from '../types';
import { translations } from '../data/translations';
import { Trophy, History, ArrowRightLeft, ShieldAlert, Sparkles, Calendar, CalendarRange } from 'lucide-react';
import { pastWinnersData, historicalMatchupsData } from '../data/tournamentData';

interface HistoryStatsProps {
  language: Language;
}

export default function HistoryStats({ language }: HistoryStatsProps) {
  const t = translations[language];
  const [teamA, setTeamA] = useState('Argentina');
  const [teamB, setTeamB] = useState('France');
  const [analyzedH2H, setAnalyzedH2H] = useState<HistoricalMatchup | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // List of unique teams for dropdowns
  const availableTeams = ['Argentina', 'Brazil', 'Germany', 'France', 'England', 'Italy', 'Spain', 'Portugal', 'Netherlands'];

  const translateTeam = (teamName: string): string => {
    if (language === 'en') return teamName;
    const map: Record<string, string> = {
      'Argentina': 'အာဂျင်တီးနား',
      'Brazil': 'ဘရာဇီး',
      'Germany': 'ဂျာမနီ',
      'France': 'ပြင်သစ်',
      'England': 'အင်္ဂလန်',
      'Italy': 'အီတလီ',
      'Spain': 'စပိန်',
      'Portugal': 'ပေါ်တူဂီ',
      'Netherlands': 'နယ်သာလန်',
      'Croatia': 'ခရိုအေးရှား',
      'Qatar': 'ကာတာ',
      'Russia': 'ရုရှား',
      'South Africa': 'တောင်အာဖရိက',
      'Korea/Japan': 'ကိုရီးယား/ဂျပန်',
      'United States': 'ယူအက်စ်အေ',
      'Semifinals': 'ဆီမီးဖိုင်နယ်',
      'Final': 'ဗိုလ်လုပွဲ',
      'Round of 16': '၁၆ သင်းအဆင့်',
      'Group Stage': 'အုပ်စုအဆင့်',
      'Quarterfinals': 'ကွာတားဖိုင်နယ်',
      'Second Round': 'ဒုတိယအဆင့်',
      'Third Place Match': 'တတိယနေရာလုပွဲ'
    };
    return map[teamName] || teamName;
  };

  const getTeamFlag = (teamName: string): string => {
    const flags: Record<string, string> = {
      'Argentina': '🇦🇷',
      'Brazil': '🇧🇷',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'Netherlands': '🇳🇱',
      'Croatia': '🇭🇷',
      'Uruguay': '🇺🇾'
    };
    return flags[teamName] || '🏳️';
  };

  const handleAnalyze = () => {
    setHasSearched(true);
    // Find matchup in pre-seeded data in either order
    const match = historicalMatchupsData.find(
      (m) =>
        (m.teamA.toLowerCase() === teamA.toLowerCase() && m.teamB.toLowerCase() === teamB.toLowerCase()) ||
        (m.teamA.toLowerCase() === teamB.toLowerCase() && m.teamB.toLowerCase() === teamA.toLowerCase())
    );

    if (match) {
      // Normalize layout so that teamA selected is always on the left in result display
      if (match.teamA.toLowerCase() === teamA.toLowerCase()) {
        setAnalyzedH2H(match);
      } else {
        // Swap values to match user selection
        setAnalyzedH2H({
          teamA: match.teamB,
          teamB: match.teamA,
          played: match.played,
          winA: match.winB,
          winB: match.winA,
          draws: match.draws,
          meetings: match.meetings.map(meeting => ({
            ...meeting,
            // Flip scores if they were in the other order, simple representation is fine
            score: meeting.score.split('-').reverse().join('-')
          }))
        });
      }
    } else {
      setAnalyzedH2H(null);
    }
  };

  return (
    <div id="history-stats-section" className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <History className="h-5 w-5 text-amber-500 shrink-0" />
          {t.historyTitle}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {t.historySubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive H2H Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-extrabold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" />
              {t.h2hAnalyzer}
            </h3>
            
            <p className="text-xs text-slate-400 mb-4">{t.selectTeamsToCompare}</p>

            {/* Selection Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center bg-black/60 p-4 rounded-xl border border-white/5 mb-5">
              {/* Dropdown Team A */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">{t.teamA}</label>
                <div className="flex items-center gap-2 bg-[#050508] border border-white/10 rounded-lg px-3 py-1">
                  <span className="text-lg leading-none">{getTeamFlag(teamA)}</span>
                  <select
                    id="h2h-select-team-a"
                    value={teamA}
                    onChange={(e) => {
                      setTeamA(e.target.value);
                      if (e.target.value === teamB) {
                        // Prevent choosing identical teams
                        setTeamB(availableTeams.find(t => t !== e.target.value) || '');
                      }
                    }}
                    className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {availableTeams.map(tName => (
                      <option key={tName} value={tName} className="bg-[#050508] text-white">{translateTeam(tName)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow spacer */}
              <div className="sm:col-span-1 flex items-center justify-center pt-4 sm:pt-0">
                <ArrowRightLeft className="h-4 w-4 text-slate-600 rotate-90 sm:rotate-0" />
              </div>

              {/* Dropdown Team B */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">{t.teamB}</label>
                <div className="flex items-center gap-2 bg-[#050508] border border-white/10 rounded-lg px-3 py-1">
                  <span className="text-lg leading-none">{getTeamFlag(teamB)}</span>
                  <select
                    id="h2h-select-team-b"
                    value={teamB}
                    onChange={(e) => {
                      setTeamB(e.target.value);
                      if (e.target.value === teamA) {
                        // Prevent choosing identical teams
                        setTeamA(availableTeams.find(t => t !== e.target.value) || '');
                      }
                    }}
                    className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {availableTeams.map(tName => (
                      <option key={tName} value={tName} className="bg-[#050508] text-white">{translateTeam(tName)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Compare Button */}
            <button
              id="h2h-analyze-btn"
              onClick={handleAnalyze}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/10 cursor-pointer transition-all duration-200"
            >
              {t.compareBtn}
            </button>

            {/* Results Display */}
            {hasSearched && (
              <div className="mt-6 pt-5 border-t border-slate-900/80">
                {!analyzedH2H ? (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/40 text-xs text-slate-500 leading-relaxed">
                    <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p>{t.noH2hData}</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                      {t.h2hStats}
                    </h4>

                    {/* H2H Stat Cards */}
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="bg-black/60 border border-white/5 rounded-xl p-3">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">{translateTeam(analyzedH2H.teamA)}</span>
                        <span className="block text-xl font-black text-white font-mono mt-1">{analyzedH2H.winA}</span>
                        <span className="text-[9px] text-slate-600 font-bold">{t.wins}</span>
                      </div>
                      <div className="bg-black/60 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">{t.totalPlayed}</span>
                        <span className="block text-xl font-black text-amber-500 font-mono mt-1">{analyzedH2H.played}</span>
                        <span className="text-[9px] text-slate-600 font-bold">{analyzedH2H.draws} {t.draws}</span>
                      </div>
                      <div className="bg-black/60 border border-white/5 rounded-xl p-3">
                        <span className="block text-[10px] text-slate-500 uppercase font-semibold">{translateTeam(analyzedH2H.teamB)}</span>
                        <span className="block text-xl font-black text-white font-mono mt-1">{analyzedH2H.winB}</span>
                        <span className="text-[9px] text-slate-600 font-bold">{t.wins}</span>
                      </div>
                    </div>

                    {/* Meetings List */}
                    <div className="space-y-2.5">
                      <h5 className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                        {t.wcMeetings}
                      </h5>
                      <div className="divide-y divide-white/5 bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                        {analyzedH2H.meetings.map((meeting, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <CalendarRange className="h-3.5 w-3.5 text-slate-600" />
                              <span className="font-mono font-bold text-white">{meeting.year}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-[10px]">{translateTeam(meeting.stage)}</span>
                            </span>
                            <span className="font-mono font-bold text-amber-500 px-3 py-1 bg-[#050508]/60 border border-white/10 rounded-md">
                              {meeting.score}
                            </span>
                            <span className="font-bold text-slate-300">
                              🏆 {translateTeam(meeting.winner)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timeline of Past Champions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-extrabold text-amber-500 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-amber-400" />
              {t.pastChampions}
            </h3>

            {/* List */}
            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
              {pastWinnersData.map((winner) => (
                <div key={winner.year} id={`champion-row-${winner.year}`} className="relative pl-7 group">
                  {/* Bullet */}
                  <span className="absolute left-1 top-1 w-4 h-4 rounded-full border-2 border-white/10 bg-[#050508] group-hover:border-amber-400 group-hover:bg-amber-500 transition-all flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                  </span>

                  {/* Winner Card Info */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-black text-amber-500 text-sm">
                        {winner.year}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                        📍 {translateTeam(winner.host)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {/* Champion info */}
                      <span className="text-white font-bold flex items-center gap-1.5">
                        <span className="text-lg leading-none">{winner.championFlag}</span>
                        {translateTeam(winner.champion)}
                        <span className="text-amber-400 text-[10px]">👑</span>
                      </span>

                      {/* Score */}
                      <span className="font-mono text-[11px] text-slate-400 font-semibold">
                        {winner.score}
                      </span>

                      {/* Runner-up */}
                      <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                        <span className="text-lg leading-none">{winner.runnerUpFlag}</span>
                        {translateTeam(winner.runnerUp)}
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 border-t border-white/5 pt-1.5 flex items-center justify-between">
                      <span>{t.topScorer}:</span>
                      <span className="font-bold text-slate-400">{winner.topScorer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
