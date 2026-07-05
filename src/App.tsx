import { useState } from 'react';
import { Language } from './types';
import { matchesData, groupStandingsData } from './data/tournamentData';
import Navbar from './components/Navbar';
import LiveStream from './components/LiveStream';
import Fixtures from './components/Fixtures';
import Standings from './components/Standings';
import HistoryStats from './components/HistoryStats';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Tv, Calendar, Heart, ShieldAlert } from 'lucide-react';
import { translations } from './data/translations';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('live');
  const [language, setLanguage] = useState<Language>('my'); // Default to Burmese as requested!

  const t = translations[language];

  // Filter live matches
  const liveMatches = matchesData.filter(m => m.status === 'live');

  return (
    <div id="app-root-container" className="min-h-screen bg-[#050508] font-sans text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Background radial effects like stadium night lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-950/10 via-[#050508]/5 to-transparent -z-10 pointer-events-none" />

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
              <LiveStream language={language} liveMatches={liveMatches} />
            )}

            {activeTab === 'fixtures' && (
              <Fixtures language={language} matches={matchesData} />
            )}

            {activeTab === 'standings' && (
              <Standings language={language} standings={groupStandingsData} />
            )}

            {activeTab === 'history' && (
              <HistoryStats language={language} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Stadium Ambient Footer */}
      <footer id="app-footer" className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:px-6">
          <p className="flex items-center gap-1">
            <span>© 2026 {t.title}. All Rights Reserved.</span>
          </p>
          <p className="flex items-center gap-1 font-medium text-slate-400">
            <span>Developed with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>for Myanmar Football Fans</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
