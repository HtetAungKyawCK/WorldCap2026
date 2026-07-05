import { Language } from '../types';
import { translations } from '../data/translations';
import { Trophy, Tv, Calendar, History, ListOrdered, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Navbar({ activeTab, setActiveTab, language, setLanguage }: NavbarProps) {
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'my' : 'en');
  };

  const menuItems = [
    { id: 'live', label: t.navLive, icon: Tv },
    { id: 'fixtures', label: t.navFixtures, icon: Calendar },
    { id: 'standings', label: t.navStandings, icon: ListOrdered },
    { id: 'history', label: t.navHistory, icon: History },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050508]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Brand Logo */}
        <div id="brand-logo" className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 border border-white/10">
            <Trophy className="h-5.5 w-5.5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-white md:text-xl">
              {t.title}
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Navigation & Language Switcher */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1.5 rounded-xl bg-white/5 p-1 border border-white/10">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/15'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Toggle Button */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-amber-500 hover:bg-white/10 hover:border-amber-500/40 transition-all duration-200 cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5" />
            {t.langToggle}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar (Sits nicely under header) */}
      <div className="md:hidden border-t border-white/10 bg-[#050508] px-2 py-1.5">
        <nav className="flex justify-around gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 flex-1 py-1 px-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-amber-500 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="text-[10px] truncate max-w-[75px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
