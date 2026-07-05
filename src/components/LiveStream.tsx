import React from 'react';
import { Language, Match } from '../types';
import { translations } from '../data/translations';
import { matchesData } from '../data/tournamentData';
import { 
  Calendar, MapPin, Clock, AlertCircle, Info, Tv, ExternalLink
} from 'lucide-react';
import Flag from './Flag';

interface LiveStreamProps {
  language: Language;
  liveMatches: Match[];
}

export default function LiveStream({ language, liveMatches }: LiveStreamProps) {
  const t = translations[language];
  
  // Find the next upcoming match dynamically from the tournament data
  const upcomingMatches = matchesData.filter(m => m.status === 'upcoming' && !m.id.startsWith('live'));
  const nextMatch = upcomingMatches[0] || matchesData.find(m => m.status === 'upcoming');

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
      'Croatia': 'ခရိုအေးရှား',
      'Norway': 'နော်ဝေ',
      'Winner R16 Match 1': 'R16 ပွဲစဉ် (၁) အနိုင်ရသူ',
      'Winner R16 Match 2': 'R16 ပွဲစဉ် (၂) အနိုင်ရသူ',
      'Winner R16 Match 5': 'R16 ပွဲစဉ် (၅) အနိုင်ရသူ',
      'Semifinalist 1': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ ၁',
      'Semifinalist 2': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ ၂',
      'Semifinalist 3': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ ၃',
      'Semifinalist 4': 'ဆီမီးဖိုင်နယ်တက်ရောက်သူ ၄',
      'Finalist 1': 'ဗိုလ်လုပွဲတက်ရောက်သူ ၁',
      'Finalist 2': 'ဗိုလ်လုပွဲတက်ရောက်သူ ၂'
    };
    return map[teamName] || teamName;
  };

  const translateStage = (stage: string): string => {
    if (language === 'en') {
      return stage === 'round_16' ? 'Round of 16' : stage === 'quarter' ? 'Quarter-finals' : 'Tournament Match';
    }
    const map: Record<string, string> = {
      'round_16': '၁၆ သင်းအဆင့် ရှုံးထွက်ပွဲစဉ်',
      'quarter': 'ကွာတားဖိုင်နယ် ပွဲစဉ်',
      'semi': 'ဆီမီးဖိုင်နယ် ပွဲစဉ်',
      'final': 'ဗိုလ်လုပွဲကြီး'
    };
    return map[stage] || 'ကမ္ဘာ့ဖလားပွဲစဉ်';
  };

  return (
    <div id="live-stream-section" className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner - Streamlined and focused */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-pink-500/10 via-red-500/5 to-transparent border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 animate-pulse"></span>
            {language === 'my' ? 'တိုက်ရိုက်ပွဲစဉ်များ (Live Stream)' : 'Live Tournament Matches'}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            {language === 'my' 
              ? 'ကမ္ဘာ့ဖလားပွဲစဉ်များ၏ တိုက်ရိုက်ရလဒ်နှင့် အခြေအနေများကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုပါ' 
              : 'Follow real-time tournament action, goals, and live updates here.'}
          </p>
        </div>
      </div>

      {/* Premium Live Stream Link Banner */}
      <a
        href="https://us.livesports808.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-500/20 via-blue-500/10 to-[#040815] border border-pink-500/30 rounded-2xl p-5 shadow-xl hover:border-pink-500/60 hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4 z-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition-transform duration-300">
            <Tv className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                {language === 'my' ? 'တိုက်ရိုက်ကြည့်ရှုရန် လင့်ခ်' : 'DIRECT LIVE STREAMING'}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-black text-white group-hover:text-pink-300 transition-colors">
              {language === 'my' 
                ? 'LiveSports808 တွင် ပွဲစဉ်များကို တိုက်ရိုက်ကြည့်ရှုပါ' 
                : 'Watch Matches Live on LiveSports808'}
            </h3>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              {language === 'my' 
                ? 'ယခုကစားနေသော ကမ္ဘာ့ဖလားပွဲစဉ်များကို LiveSports808 တိုက်ရိုက်ထုတ်လွှင့်မှု စာမျက်နှာတွင် အခမဲ့ အရည်အသွေးမြင့် တိုက်ရိုက်ကြည့်ရှုနိုင်ပါသည်။' 
                : 'Open the external streaming channel to watch all active World Cup matches with high definition and zero delay.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md group-hover:shadow-pink-500/20 group-hover:translate-x-1 duration-300 shrink-0 z-10">
          <span>{language === 'my' ? 'တိုက်ရိုက်ကြည့်ရှုမည်' : 'Open Live Stream'}</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </a>

      {/* Conditionally Render Active Live Matches OR Empty State */}
      {liveMatches.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-bold text-pink-500 uppercase tracking-widest pl-2 mb-2 border-l-2 border-pink-500 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-pink-500 rounded-full animate-ping"></span>
            {language === 'my' ? 'ယခုလက်ရှိ ကစားနေသော ပွဲစဉ်များ' : 'Currently Playing Live'}
          </div>

          <div className="grid grid-cols-1 gap-5">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-[#050b1d] p-5 md:p-6 shadow-2xl transition-all hover:border-pink-500/50"
              >
                {/* Background lighting flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Match header info */}
                <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-500 text-white font-black px-2.5 py-0.5 rounded-md text-[10px] tracking-wider animate-pulse flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      {t.liveBadge}
                    </span>
                    <span className="font-mono text-pink-400 font-extrabold text-sm animate-pulse">
                      {match.minute}' {t.minute}
                    </span>
                  </div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    {translateStage(match.stage)}
                  </span>
                </div>

                {/* Scoreboard Arena layout */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
                  
                  {/* Home Team */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 flex-1 justify-end text-center sm:text-right">
                    <span className="text-white text-base md:text-lg font-extrabold tracking-tight order-2 sm:order-1">
                      {translateTeam(match.homeTeam)}
                    </span>
                    <div className="order-1 sm:order-2 shrink-0">
                      <Flag country={match.homeTeam} emoji={match.homeFlag} size="lg" className="scale-110 shadow-lg" />
                    </div>
                  </div>

                  {/* Dynamic pulsing score */}
                  <div className="flex flex-col items-center justify-center bg-black/50 border border-white/10 px-6 py-3 rounded-2xl min-w-[120px] shadow-inner">
                    <span className="text-3xl md:text-4xl font-mono font-black text-pink-500 tracking-wider animate-pulse">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                      {language === 'my' ? 'လက်ရှိရလဒ်' : 'LIVE SCORE'}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 flex-1 justify-start text-center sm:text-left">
                    <div className="shrink-0">
                      <Flag country={match.awayTeam} emoji={match.awayFlag} size="lg" className="scale-110 shadow-lg" />
                    </div>
                    <span className="text-white text-base md:text-lg font-extrabold tracking-tight">
                      {translateTeam(match.awayTeam)}
                    </span>
                  </div>

                </div>

                {/* Scored players logs */}
                {match.scorers && match.scorers.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-1.5 bg-black/30 rounded-xl p-3">
                    <div className="text-[10px] font-black uppercase text-pink-400 tracking-wider mb-1">
                      ⚽ {t.scorersLabel}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 font-medium">
                      {match.scorers.map((scorer, i) => (
                        <div key={i} className={`flex items-center gap-1.5 ${scorer.team === 'home' ? 'justify-start' : 'justify-end sm:text-right'}`}>
                          <span className="text-slate-500">({scorer.time}')</span>
                          <span className="text-slate-200 font-bold">{scorer.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stadium & Watch Live Match CTA */}
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-slate-600" />
                    {match.stadium} • {match.city}
                  </span>
                  <a
                    href="https://us.livesports808.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold transition-all shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 w-full sm:w-auto justify-center cursor-pointer z-10"
                  >
                    <Tv className="h-3.5 w-3.5 animate-pulse" />
                    <span>{language === 'my' ? 'တိုက်ရိုက်ကြည့်ရှုမည်' : 'Watch Live Stream'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State with detailed schedule of next live matches */
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center space-y-4 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border border-white/5 text-slate-500">
              <AlertCircle className="h-7 w-7" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base md:text-lg font-bold text-white">
                {language === 'my' 
                  ? 'လတ်တလော တိုက်ရိုက်ကစားနေသည့် ပွဲစဉ်များ မရှိသေးပါ' 
                  : 'No Active Live Matches Right Now'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {language === 'my'
                  ? 'လက်ရှိတွင် တိုက်ရိုက်ထုတ်လွှင့်နေသည့် ကမ္ဘာ့ဖလားပွဲစဉ်များ မရှိသေးပါ။ အောက်ပါ လာမည့်ပွဲစဉ်အချိန်ဇယားများတွင် စောင့်မျှော်ကြည့်ရှုပါ။'
                  : 'There are no active World Cup matches currently playing. Please check the upcoming schedule below for the next live match details!'}
              </p>
            </div>

            {/* Highlighted next kickoff notice card */}
            {nextMatch && (
              <div className="max-w-md mx-auto bg-gradient-to-b from-[#0a1024] to-[#040815] border border-pink-500/10 rounded-xl p-4 space-y-3.5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-pink-500" />
                
                <div className="text-[10px] font-black uppercase text-pink-400 tracking-widest flex items-center justify-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-pink-500" />
                  <span>{language === 'my' ? 'နောက်ထပ် လာမည့်ပွဲစဉ်အချိန်' : 'NEXT LIVE MATCH SCHEDULE'}</span>
                </div>

                <div className="flex items-center justify-center gap-4 py-1.5">
                  <div className="flex items-center gap-2">
                    <Flag country={nextMatch.homeTeam} emoji={nextMatch.homeFlag} size="md" />
                    <span className="text-xs font-bold text-white">{translateTeam(nextMatch.homeTeam)}</span>
                  </div>
                  <span className="text-slate-600 font-bold text-xs">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{translateTeam(nextMatch.awayTeam)}</span>
                    <Flag country={nextMatch.awayTeam} emoji={nextMatch.awayFlag} size="md" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 text-slate-400 text-xs font-bold font-mono bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                  <span className="text-pink-400">{nextMatch.date}</span>
                  <span className="text-slate-600">|</span>
                  <span>{nextMatch.time} (UTC)</span>
                </div>

                <p className="text-[10px] text-slate-500">
                  📍 {nextMatch.stadium} • {nextMatch.city}
                </p>
              </div>
            )}
          </div>

          {/* List of more upcoming matches to fulfill user's request: "ဘယ်အချိန်မှာ ရှိမယ် ဆိုတာပါ ပြနေရမယ်။" */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              {language === 'my' ? 'ရှေ့လာမည့် ပွဲစဉ်အချိန်ဇယားများ' : 'Upcoming Tournament Match Schedules'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {upcomingMatches.slice(0, 4).map((match) => (
                <div 
                  key={match.id}
                  className="bg-[#050b1d] border border-white/5 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono">
                    <span className="text-pink-500/80 uppercase">{translateStage(match.stage)}</span>
                    <span>{match.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-white">
                      <Flag country={match.homeTeam} emoji={match.homeFlag} size="sm" />
                      <span className="truncate max-w-[100px]">{translateTeam(match.homeTeam)}</span>
                    </div>
                    
                    <span className="text-slate-600 bg-black/40 px-2 py-0.5 rounded border border-white/5 text-[9px]">
                      {match.time}
                    </span>

                    <div className="flex items-center gap-2 text-white">
                      <span className="truncate max-w-[100px]">{translateTeam(match.awayTeam)}</span>
                      <Flag country={match.awayTeam} emoji={match.awayFlag} size="sm" />
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-500 flex items-center gap-1 pt-1.5 border-t border-white/5 truncate">
                    <MapPin className="h-3 w-3 text-slate-600 shrink-0" />
                    <span className="truncate">{match.stadium} • {match.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Direct FAQ Stream info card */}
      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-md text-xs text-slate-400 leading-relaxed">
        <Info className="h-5 w-5 text-pink-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <p className="font-bold text-slate-200">
            {language === 'my' ? 'တိုက်ရိုက်ရလဒ်များကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုနည်း' : 'Real-Time Score Delivery Information'}
          </p>
          <p>
            {language === 'my'
              ? 'ကမ္ဘာ့ဖလားပွဲစဉ်များ စတင်ချိန်တွင် ဤစာမျက်နှာ၌ တိုက်ရိုက်ဂိုးသွင်းရလဒ်များ၊ ပွဲမိနစ်များနှင့် ဂိုးသွင်းသူများကို တိုက်ရိုက်ထုတ်လွှင့်သွားမည်ဖြစ်ပြီး အသင်းအလံများကို စနစ်အမျိုးမျိုး (Windows, Mac, Android, iOS) ၌ ကောင်းမွန်စွာ မြင်တွေ့ရမည်ဖြစ်ပါသည်။'
              : 'Our system serves real-time World Cup logs with game minutes and goalscorers dynamically. Flags are high-definition SVGs, rendering perfectly on all systems including Windows, Android, Mac, and iOS.'}
          </p>
        </div>
      </div>

    </div>
  );
}
