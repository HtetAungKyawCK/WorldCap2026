import { useState } from 'react';
import { Language, Match } from '../types';
import { translations } from '../data/translations';
import { Search, Calendar, MapPin, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import Flag from './Flag';

interface FixturesProps {
  language: Language;
  matches: Match[];
}

export default function Fixtures({ language, matches }: FixturesProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'upcoming' | 'live'>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Burmese Team Names Translation Map helper
  const translateTeam = (teamName: string): string => {
    if (language === 'en') return teamName;
    const map: Record<string, string> = {
      'England': 'အင်္ဂလန်',
      'France': 'ပြင်သစ်',
      'Brazil': 'ဘရာဇီး',
      'United States': 'ယူအက်စ်အေ',
      'Portugal': 'ပေါ်တူဂီ',
      'Netherlands': 'နယ်သာလန်',
      'Argentina': 'အာဂျင်တီးနား',
      'Germany': 'ဂျာမနီ',
      'Spain': 'စပိန်',
      'Japan': 'ဂျပန်',
      'Croatia': 'ခရိုအေးရှား',
      'Saudi Arabia': 'ဆော်ဒီအာရေဗျ',
      'Italy': 'အီတလီ',
      'Mexico': 'မက္ကဆီကို',
      'Canada': 'ကနေဒါ',
      'Morocco': 'မော်ရိုကို',
      'Winner R16 Match 5': 'Round 16 အနိုင်ရသူ (၅)',
      'Winner R16 Match 1': 'Round 16 အနိုင်ရသူ (၁)',
      'Winner R16 Match 2': 'Round 16 အနိုင်ရသူ (၂)',
      'Semifinalist 1': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ (၁)',
      'Semifinalist 2': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ (၂)',
      'Semifinalist 3': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ (၃)',
      'Semifinalist 4': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ (၄)',
      'Loser SF1': 'ဆီမီးရှုံးသူ (၁)',
      'Loser SF2': 'ဆီမီးရှုံးသူ (၂)',
      'Finalist 1': 'ဗိုလ်လုပွဲတက်ရောက်သူ (၁)',
      'Finalist 2': 'ဗိုလ်လုပွဲတက်ရောက်သူ (၂)',
    };
    return map[teamName] || teamName;
  };

  const getStageLabel = (stage: Match['stage']): string => {
    switch (stage) {
      case 'group': return t.groupStage;
      case 'round_32': return t.knockout32;
      case 'round_16': return t.knockout16;
      case 'quarter': return t.quarterFinals;
      case 'semi': return t.semiFinals;
      case 'third_place': return t.thirdPlace;
      case 'final': return t.final;
      default: return stage;
    }
  };

  // Filter & Search Logic
  const filteredMatches = matches.filter((match) => {
    // Search match
    const homeTrans = translateTeam(match.homeTeam).toLowerCase();
    const awayTrans = translateTeam(match.awayTeam).toLowerCase();
    const homeEng = match.homeTeam.toLowerCase();
    const awayEng = match.awayTeam.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      homeTrans.includes(searchLower) ||
      awayTrans.includes(searchLower) ||
      homeEng.includes(searchLower) ||
      awayEng.includes(searchLower);

    // Filter by status
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'completed' && match.status === 'completed') ||
      (activeFilter === 'upcoming' && match.status === 'upcoming') ||
      (activeFilter === 'live' && match.status === 'live');

    // Filter by stage
    const matchesStage = selectedStage === 'all' || match.stage === selectedStage;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const formatDate = (dateStr: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString(language === 'en' ? 'en-US' : 'my-MM', options);
  };

  return (
    <div id="fixtures-results-section" className="space-y-6">
      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Bar */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            id="fixtures-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/20 transition-all"
          />
        </div>

        {/* Stage Filter Dropdown */}
        <div className="md:col-span-3">
          <select
            id="stage-filter-select"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#040815] text-sm text-slate-300 focus:outline-none focus:border-pink-500/60 cursor-pointer"
          >
            <option className="bg-[#050508] text-white" value="all">{t.allStages}</option>
            <option className="bg-[#050508] text-white" value="group">{t.groupStage}</option>
            <option className="bg-[#050508] text-white" value="round_32">{t.knockout32}</option>
            <option className="bg-[#050508] text-white" value="round_16">{t.knockout16}</option>
            <option className="bg-[#050508] text-white" value="quarter">{t.quarterFinals}</option>
            <option className="bg-[#050508] text-white" value="semi">{t.semiFinals}</option>
            <option className="bg-[#050508] text-white" value="third_place">{t.thirdPlace}</option>
            <option className="bg-[#050508] text-white" value="final">{t.final}</option>
          </select>
        </div>

        {/* Status Filter Tabs (Live, Completed, Upcoming) */}
        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'live', 'upcoming', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              id={`filter-btn-${filter}`}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-pink-500/10 text-pink-500 border border-pink-500/30'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              {filter === 'all' && t.filterAll}
              {filter === 'completed' && t.filterCompleted}
              {filter === 'upcoming' && t.filterUpcoming}
              {filter === 'live' && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                  {t.filterLive}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div id="fixtures-list" className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5 text-slate-500 text-sm">
            <Calendar className="h-10 w-10 mx-auto text-slate-700 mb-2" />
            <p>{t.noMatchesFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((match) => {
              const stageLabel = getStageLabel(match.stage);
              return (
                <div
                  key={match.id}
                  id={`fixture-card-${match.id}`}
                  className={`group relative overflow-hidden rounded-2xl border bg-black/40 p-5 transition-all hover:bg-white/5 ${
                    match.status === 'live'
                      ? 'border-red-500/40 shadow-lg shadow-red-500/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Status & Stage Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 text-xs">
                    <span className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-400 tracking-wide">
                      {stageLabel} {match.group ? `• ${match.group}` : ''}
                    </span>

                    {match.status === 'live' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-[10px] font-bold text-red-500 animate-pulse uppercase tracking-wider">
                        ● {t.liveBadge} ({match.minute}')
                      </span>
                    )}

                    {match.status === 'completed' && (
                      <span className="flex items-center gap-1 text-slate-500 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-pink-500/80" />
                        {language === 'my' ? 'ပြီးဆုံး' : 'FT'}
                      </span>
                    )}

                    {match.status === 'upcoming' && (
                      <span className="flex items-center gap-1 text-slate-400 font-semibold">
                        <Clock className="h-3.5 w-3.5 text-pink-500" />
                        {match.time}
                      </span>
                    )}
                  </div>

                  {/* Competitors Frame */}
                  <div className="flex items-center justify-between gap-2 my-2 py-1.5">
                    {/* Home Side */}
                    <div className="flex flex-col items-center justify-center flex-1 text-center min-w-[100px]">
                      <Flag country={match.homeTeam} emoji={match.homeFlag} size="lg" className="mb-2 scale-110 filter drop-shadow-md transition-transform group-hover:scale-125" />
                      <span className="text-sm font-bold text-white tracking-tight line-clamp-1">
                        {translateTeam(match.homeTeam)}
                      </span>
                    </div>

                    {/* Versus/Score Center Board */}
                    <div className="flex flex-col items-center justify-center shrink-0 px-4">
                      {match.status === 'upcoming' ? (
                        <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold text-slate-400">
                          VS
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-2xl font-black ${match.status === 'live' ? 'text-pink-500 font-extrabold animate-pulse' : 'text-slate-100'}`}>
                            {match.homeScore}
                          </span>
                          <span className="text-slate-600 font-bold">:</span>
                          <span className={`font-mono text-2xl font-black ${match.status === 'live' ? 'text-pink-500 font-extrabold animate-pulse' : 'text-slate-100'}`}>
                            {match.awayScore}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Side */}
                    <div className="flex flex-col items-center justify-center flex-1 text-center min-w-[100px]">
                      <Flag country={match.awayTeam} emoji={match.awayFlag} size="lg" className="mb-2 scale-110 filter drop-shadow-md transition-transform group-hover:scale-125" />
                      <span className="text-sm font-bold text-white tracking-tight line-clamp-1">
                        {translateTeam(match.awayTeam)}
                      </span>
                    </div>
                  </div>

                  {/* Scorer Details (For Completed & Live Matches) */}
                  {match.scorers && match.scorers.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-white/5">
                      <div className="space-y-1">
                        {match.scorers.map((scorer, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className={scorer.team === 'home' ? 'font-medium text-slate-300' : 'text-slate-600 text-right w-full pr-1'}>
                              {scorer.team === 'home' ? `⚽ ${scorer.name}` : ''}
                            </span>
                            <span className="text-slate-600 font-mono text-[10px] px-1">{scorer.time}'</span>
                            <span className={scorer.team === 'away' ? 'font-medium text-slate-300 text-right w-full pl-1' : 'text-slate-600 text-left w-full'}>
                              {scorer.team === 'away' ? `${scorer.name} ⚽` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Stats Line: Stadium, City & Date */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-600" />
                      <span className="truncate max-w-[200px]">{match.stadium} • {match.city}</span>
                    </span>
                    <span className="font-semibold text-slate-400">
                      {formatDate(match.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
