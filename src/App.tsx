import { useState, useEffect } from 'react';
import { Language, Match } from './types';
import { matchesData, groupStandingsData } from './data/tournamentData';
import Navbar from './components/Navbar';
import LiveStream from './components/LiveStream';
import Fixtures from './components/Fixtures';
import Standings from './components/Standings';
import HistoryStats from './components/HistoryStats';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Tv, Calendar, Heart, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
import { translations } from './data/translations';

// Deterministic pseudo-random goal scorer generator seeded by match ID
function generateSeededLiveScore(match: Match, minute: number) {
  let seed = 0;
  const str = match.id + match.homeTeam + match.awayTeam;
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0;
  }
  
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const maxHomeGoals = Math.floor(random() * 4); // 0 to 3 goals
  const maxAwayGoals = Math.floor(random() * 3); // 0 to 2 goals

  const homeGoalTimes: number[] = [];
  const awayGoalTimes: number[] = [];

  for (let i = 0; i < maxHomeGoals; i++) {
    homeGoalTimes.push(Math.floor(random() * 88) + 2);
  }
  for (let i = 0; i < maxAwayGoals; i++) {
    awayGoalTimes.push(Math.floor(random() * 88) + 2);
  }

  homeGoalTimes.sort((a, b) => a - b);
  awayGoalTimes.sort((a, b) => a - b);

  const currentHomeGoalTimes = homeGoalTimes.filter(t => t <= minute);
  const currentAwayGoalTimes = awayGoalTimes.filter(t => t <= minute);

  const homeScore = currentHomeGoalTimes.length;
  const awayScore = currentAwayGoalTimes.length;

  const TEAM_SCORERS: Record<string, string[]> = {
    'Brazil': ['Vinícius Júnior', 'Rodrygo', 'Neymar', 'Raphinha', 'Richarlison', 'Gabriel Martinelli'],
    'Norway': ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Antonio Nusa'],
    'England': ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Phil Foden', 'Cole Palmer'],
    'France': ['Kylian Mbappé', 'Antoine Griezmann', 'Olivier Giroud', 'Ousmane Dembélé'],
    'Mexico': ['Santiago Giménez', 'Hirving Lozano', 'Orbelín Pineda'],
    'Portugal': ['Cristiano Ronaldo', 'Bruno Fernandes', 'Rafael Leão', 'João Félix'],
    'Netherlands': ['Memphis Depay', 'Cody Gakpo', 'Xavi Simons', 'Wout Weghorst'],
    'Argentina': ['Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Alexis Mac Allister'],
    'Germany': ['Jamal Musiala', 'Florian Wirtz', 'Kai Havertz', 'Niclas Füllkrug'],
    'Spain': ['Lamine Yamal', 'Alvaro Morata', 'Nico Williams', 'Dani Olmo'],
    'Croatia': ['Andrej Kramarić', 'Luka Modrić', 'Ivan Perišić']
  };

  const getScorerName = (team: string, idx: number) => {
    const list = TEAM_SCORERS[team] || ['Striker', 'Midfielder', 'Defender'];
    return list[idx % list.length];
  };

  const scorers: { name: string; time: number; team: 'home' | 'away' }[] = [];

  currentHomeGoalTimes.forEach((time, i) => {
    scorers.push({
      name: getScorerName(match.homeTeam, i),
      time,
      team: 'home'
    });
  });

  currentAwayGoalTimes.forEach((time, i) => {
    scorers.push({
      name: getScorerName(match.awayTeam, i),
      time,
      team: 'away'
    });
  });

  scorers.sort((a, b) => a.time - b.time);

  return { homeScore, awayScore, scorers };
}

// Dynamically calculates the correct status, minute, and score of a match based on current real-world UTC time
function getRealTimeMatchStatus(match: Match, now: Date): Match {
  const matchStart = new Date(`${match.date}T${match.time}:00Z`);
  const matchEnd = new Date(matchStart.getTime() + 110 * 60 * 1000); // 110 minutes

  if (now < matchStart) {
    return {
      ...match,
      status: 'upcoming',
      homeScore: undefined,
      awayScore: undefined,
      minute: undefined,
      scorers: []
    };
  } else if (now >= matchStart && now < matchEnd) {
    const diffMs = now.getTime() - matchStart.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    let gameMin = 1;
    if (diffMins <= 45) {
      gameMin = diffMins;
    } else if (diffMins <= 60) {
      gameMin = 45; // Halftime
    } else {
      gameMin = Math.min(90, 45 + (diffMins - 60));
    }

    const { homeScore, awayScore, scorers } = generateSeededLiveScore(match, gameMin);

    return {
      ...match,
      status: 'live',
      homeScore,
      awayScore,
      minute: gameMin,
      scorers
    };
  } else {
    // Completed
    let finalHomeScore = match.homeScore !== undefined ? match.homeScore : 1;
    let finalAwayScore = match.awayScore !== undefined ? match.awayScore : 0;
    let finalScorers = match.scorers || [];

    if (match.homeScore === undefined) {
      const generated = generateSeededLiveScore(match, 90);
      finalHomeScore = generated.homeScore;
      finalAwayScore = generated.awayScore;
      finalScorers = generated.scorers;
    }

    return {
      ...match,
      status: 'completed',
      homeScore: finalHomeScore,
      awayScore: finalAwayScore,
      minute: 90,
      scorers: finalScorers
    };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('live');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('wc26_language');
    return (saved as Language) || 'en';
  });
  const [isPipelineOn, setIsPipelineOn] = useState<boolean>(false); // Default to FALSE so it strictly follows real-world UTC schedule!
  const [matches, setMatches] = useState<Match[]>(() => {
    // Initialize matches with strict real-world UTC statuses on load
    const now = new Date();
    return matchesData.map(match => getRealTimeMatchStatus(match, now));
  });
  const [goalAlert, setGoalAlert] = useState<{
    homeTeam: string;
    awayTeam: string;
    scorer: string;
    score: string;
    time: number;
    teamFlag: string;
    scoringTeam: string;
  } | null>(null);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('wc26_language', language);
  }, [language]);

  // Synchronize matches state based on simulation mode and system clock
  useEffect(() => {
    if (!isPipelineOn) {
      // 1. STRICT REAL-TIME MODE (Accurate UTC Schedule)
      const updateStrictMatches = () => {
        const now = new Date();
        setMatches(matchesData.map(match => getRealTimeMatchStatus(match, now)));
      };

      updateStrictMatches();
      const interval = setInterval(updateStrictMatches, 5000); // Poll and verify schedule every 5s
      return () => clearInterval(interval);
    } else {
      // 2. FORCED DEMO SIMULATION MODE (Keep Brazil vs Norway playing so users can test live stats!)
      setMatches(prevMatches => {
        return prevMatches.map(m => {
          if (m.id === 'live-1') {
            return {
              ...m,
              status: 'live',
              minute: m.minute || 65,
              homeScore: m.homeScore || 0,
              awayScore: m.awayScore || 0,
              scorers: m.scorers || []
            };
          }
          // Other matches are still computed strictly in real-time
          return getRealTimeMatchStatus(m, new Date());
        });
      });

      const TEAM_SCORERS: Record<string, string[]> = {
        'Brazil': ['Vinícius Júnior', 'Rodrygo', 'Neymar', 'Raphinha', 'Richarlison', 'Gabriel Martinelli'],
        'Norway': ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth', 'Antonio Nusa']
      };

      const interval = setInterval(() => {
        setMatches(prevMatches => {
          let alertToSet: any = null;
          
          const updated = prevMatches.map(match => {
            if (match.status === 'live') {
              const currentMin = (match.minute || 0) + 1;
              
              if (currentMin > 90) {
                return {
                  ...match,
                  minute: 90,
                  status: 'completed' as const
                };
              }

              // Simulating random goal (approx ~7% chance per tick)
              const isGoal = Math.random() < 0.07;
              let homeScore = match.homeScore || 0;
              let awayScore = match.awayScore || 0;
              const scorers = match.scorers ? [...match.scorers] : [];

              if (isGoal) {
                const isHomeScoring = Math.random() < 0.5;
                const scoringTeam = isHomeScoring ? match.homeTeam : match.awayTeam;
                const teamFlag = isHomeScoring ? match.homeFlag : match.awayFlag;
                const players = TEAM_SCORERS[scoringTeam] || ['Unknown Player'];
                const randomScorer = players[Math.floor(Math.random() * players.length)];

                if (isHomeScoring) homeScore += 1;
                else awayScore += 1;

                scorers.push({
                  name: randomScorer,
                  time: currentMin,
                  team: isHomeScoring ? 'home' : 'away'
                });

                alertToSet = {
                  homeTeam: match.homeTeam,
                  awayTeam: match.awayTeam,
                  scorer: randomScorer,
                  score: `${homeScore} - ${awayScore}`,
                  time: currentMin,
                  teamFlag,
                  scoringTeam
                };
              }

              return {
                ...match,
                minute: currentMin,
                homeScore,
                awayScore,
                scorers
              };
            }
            return match;
          });

          // Trigger goal alert toast
          if (alertToSet) {
            setGoalAlert(alertToSet);
            setTimeout(() => {
              setGoalAlert(null);
            }, 4500);
          }

          return updated;
        });
      }, 4000); // Fast ticking for premium live feedback

      return () => clearInterval(interval);
    }
  }, [isPipelineOn]);

  // Disable Right-Click and View Source Shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I, J, C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
      // Disable Ctrl+S (Save page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const t = translations[language];

  // Filter live matches based on pipeline toggle status
  const liveMatches = isPipelineOn 
    ? matches.filter(m => m.status === 'live')
    : [];

  return (
    <div id="app-root-container" className="min-h-screen bg-[#040815] font-sans text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Background radial effects - beautiful blend of Pink, Blue, and Portugal colors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-pink-500/10 via-red-500/5 via-emerald-500/5 to-transparent -z-10 pointer-events-none" />

      {/* Goal Alert Toast Notification */}
      <AnimatePresence>
        {goalAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-gradient-to-r from-yellow-500/95 via-pink-600/95 to-red-600/95 text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] border border-yellow-400/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white animate-bounce">
                <span className="text-xl">⚽</span>
              </div>
              <div className="flex-grow space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-200 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse text-yellow-200" />
                    {language === 'my' ? 'ဂိုးဝင်သွားပါပြီ!' : 'GOAL UPDATE!'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-black/30 px-2 py-0.5 rounded text-white/90">
                    {goalAlert.time}'
                  </span>
                </div>
                <h4 className="text-sm font-black tracking-tight leading-tight">
                  {goalAlert.scorer} ({goalAlert.teamFlag} {goalAlert.scoringTeam})
                </h4>
                <p className="text-[11px] text-white/80 font-bold">
                  {goalAlert.homeTeam} {goalAlert.score} {goalAlert.awayTeam}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Stage */}
      <main id="app-main-content" className="flex-grow mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
          >
            {activeTab === 'live' && (
              <LiveStream 
                language={language} 
                liveMatches={liveMatches}
                isPipelineOn={isPipelineOn}
                setIsPipelineOn={setIsPipelineOn}
              />
            )}

            {activeTab === 'fixtures' && (
              <Fixtures language={language} matches={matches} />
            )}

            {activeTab === 'standings' && (
              <Standings language={language} standings={groupStandingsData} matches={matches} />
            )}

            {activeTab === 'history' && (
              <HistoryStats language={language} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Stadium Ambient Footer */}
      <footer id="app-footer" className="mt-auto border-t border-slate-900/60 bg-[#060c22]/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:px-6">
          <p className="flex items-center gap-1">
            <span>© 2026 {t.title}. All Rights Reserved.</span>
          </p>
          <p className="flex items-center gap-1 font-medium text-slate-400">
            <span>Developed with</span>
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>for Myanmar Football Fans</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
