import { useState } from 'react';
import { Language, GroupStanding } from '../types';
import { translations } from '../data/translations';
import { Trophy, Shield, Info, GitMerge, LayoutGrid } from 'lucide-react';
import TournamentTree from './TournamentTree';

interface StandingsProps {
  language: Language;
  standings: GroupStanding[];
}

export default function Standings({ language, standings }: StandingsProps) {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'tree' | 'groups'>('tree'); // Default to the beautiful Tree structure requested by user!

  // Team names translation maps
  const translateTeam = (teamName: string): string => {
    if (language === 'en') return teamName;
    const map: Record<string, string> = {
      'Mexico': 'မက္ကဆီကို',
      'Italy': 'အီတလီ',
      'Sweden': 'ဆွီဒင်',
      'New Zealand': 'နယူးဇီလန်',
      'England': 'အင်္ဂလန်',
      'South Korea': 'တောင်ကိုရီးယား',
      'Ecuador': 'အီကွေဒေါ',
      'Cameroon': 'ကင်မရွန်း',
      'Argentina': 'အာဂျင်တီးနား',
      'Poland': 'ပိုလန်',
      'Saudi Arabia': 'ဆော်ဒီအာရေဗျ',
      'Mali': 'မာလီ',
      'France': 'ပြင်သစ်',
      'Denmark': 'ဒိန်းမတ်',
      'Tunisia': 'တူနီးရှား',
      'Australia': 'ဩစတြေးလျ',
      'Spain': 'စပိန်',
      'Japan': 'ဂျပန်',
      'Costa Rica': 'ကိုစတာရီကာ',
      'Zambia': 'ဇမ်ဘီယာ',
      'Germany': 'ဂျာမနီ',
      'Croatia': 'ခရိုအေးရှား',
      'Canada': 'ကနေဒါ',
      'Morocco': 'မော်ရိုကို',
      'Brazil': 'ဘရာဇီး',
      'Switzerland': 'ဆွစ်ဇာလန်',
      'Serbia': 'ဆားဘီးယား',
      'Ghana': 'ဂါနာ',
      'Portugal': 'ပေါ်တူဂီ',
      'Uruguay': 'ဥရုဂွေး'
    };
    return map[teamName] || teamName;
  };

  return (
    <div id="group-standings-section" className="space-y-6">
      {/* Title & View Switcher Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-pink-500 shrink-0" />
            {viewMode === 'tree' 
              ? (language === 'my' ? 'ရှုံးထွက်ပွဲစဉ် ဇယားလမ်းပြမြေပုံ' : 'Playoff Bracket Tree Map')
              : t.groupStandingsTitle
            }
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {viewMode === 'tree'
              ? (language === 'my' ? 'ကမ္ဘာ့ဖလား ၂၀၂၆ ၏ ရှုံးထွက်အဆင့်ပွဲစဉ် လမ်းကြောင်းပုံစံ' : 'Knockout path and prospective tree layout of matches')
              : t.groupStandingsSubtitle
            }
          </p>
        </div>

        {/* Beautiful View Switcher Button Group */}
        <div className="flex bg-[#050b1d] border border-white/10 rounded-xl p-1 text-xs font-bold self-start md:self-auto shrink-0 select-none">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitMerge className="h-3.5 w-3.5" />
            <span>{language === 'my' ? 'ပွဲစဉ် Tree Structure' : 'Bracket Tree'}</span>
          </button>
          
          <button
            onClick={() => setViewMode('groups')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'groups'
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{language === 'my' ? 'အုပ်စုရပ်တည်မှုများ' : 'Group Standings'}</span>
          </button>
        </div>
      </div>

      {/* View Content conditional rendering */}
      {viewMode === 'tree' ? (
        <TournamentTree language={language} />
      ) : (
        <>
          {/* Grid of groups */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {standings.map((group) => (
              <div
                key={group.name}
                id={`group-panel-${group.name.replace(' ', '-').toLowerCase()}`}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-sm"
              >
                {/* Group Name Header */}
                <h3 className="text-sm font-extrabold text-pink-500 uppercase tracking-wider mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                  {language === 'my' ? group.name.replace('Group', 'အုပ်စု') : group.name}
                </h3>

                {/* Table Frame */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/5 font-bold uppercase tracking-wider">
                        <th className="py-2.5 pl-2">{t.colTeam}</th>
                        <th className="py-2.5 text-center">{t.colPlayed}</th>
                        <th className="py-2.5 text-center">{t.colWon}</th>
                        <th className="py-2.5 text-center hidden sm:table-cell">{t.colDrawn}</th>
                        <th className="py-2.5 text-center hidden sm:table-cell">{t.colLost}</th>
                        <th className="py-2.5 text-center hidden md:table-cell">{t.colGF}</th>
                        <th className="py-2.5 text-center hidden md:table-cell">{t.colGA}</th>
                        <th className="py-2.5 text-center">{t.colGD}</th>
                        <th className="py-2.5 text-right pr-2">{t.colPts}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {group.teams.map((team, idx) => {
                        const isQualified = idx < 2; // Top 2 qualify
                        return (
                          <tr
                            key={team.name}
                            className={`hover:bg-white/5 transition-all ${
                              isQualified ? 'bg-pink-950/10' : ''
                            }`}
                          >
                            {/* Team Name */}
                            <td className="py-3 pl-2 flex items-center gap-2 text-white">
                              <span className={`w-1 h-6 shrink-0 rounded-full ${isQualified ? 'bg-pink-500' : 'bg-transparent'}`}></span>
                              <span className="text-lg leading-none" role="img" aria-label={team.name}>{team.flag}</span>
                              <span className="font-bold tracking-tight truncate max-w-[110px] sm:max-w-none">
                                {translateTeam(team.name)}
                              </span>
                            </td>

                            {/* Stats */}
                            <td className="py-3 text-center text-slate-300 font-mono">{team.played}</td>
                            <td className="py-3 text-center text-slate-300 font-mono">{team.won}</td>
                            <td className="py-3 text-center text-slate-300 font-mono hidden sm:table-cell">{team.drawn}</td>
                            <td className="py-3 text-center text-slate-300 font-mono hidden sm:table-cell">{team.lost}</td>
                            <td className="py-3 text-center text-slate-500 font-mono hidden md:table-cell">{team.gf}</td>
                            <td className="py-3 text-center text-slate-500 font-mono hidden md:table-cell">{team.ga}</td>
                            
                            {/* GD with indicator colors */}
                            <td className={`py-3 text-center font-mono ${
                              team.gd > 0 ? 'text-pink-500 font-semibold' : team.gd < 0 ? 'text-red-400' : 'text-slate-400'
                            }`}>
                              {team.gd > 0 ? `+${team.gd}` : team.gd}
                            </td>

                            {/* Points Highlight */}
                            <td className="py-3 text-right pr-2 text-pink-500 font-bold font-mono text-sm">
                              {team.pts}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card at bottom */}
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-500 leading-relaxed">
            <Info className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
            <p>{t.qualificationNote}</p>
          </div>
        </>
      )}
    </div>
  );
}
