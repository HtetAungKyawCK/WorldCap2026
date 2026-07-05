import React, { useState } from 'react';
import { Language, Match } from '../types';
import { translations } from '../data/translations';
import { 
  Tv, ExternalLink, Sparkles, ShieldAlert, Info
} from 'lucide-react';

interface LiveStreamProps {
  language: Language;
  liveMatches: Match[];
}

export default function LiveStream({ language, liveMatches: initialLiveMatches }: LiveStreamProps) {
  const t = translations[language];
  const [showDemoMatches, setShowDemoMatches] = useState(false);
  const displayedLiveMatches = showDemoMatches ? initialLiveMatches : [];
  const [copied, setCopied] = useState(false);
  
  const currentStreamUrl = 'https://beinsportsxtra-beinsports-1-us.lg.amagi.tv/playlist.m3u8';
  const activeChannelName = language === 'my' ? 'Livesports တိုက်ရိုက်ရုပ်သံလိုင်း (BeIN Sports)' : 'Livesports Live Stream (BeIN Sports)';
  const activeChannelLogo = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/BeIN_Sports_logo.svg';

  return (
    <div id="live-stream-section" className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 border border-white/5 rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-pink-500 animate-pulse"></span>
            {language === 'my' ? 'အခမဲ့ တိုက်ရိုက်ပွဲစဉ်များ' : 'Free Live Sports Streaming'}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            {language === 'my' 
              ? 'ကမ္ဘာတစ်ဝှမ်းမှ အခမဲ့အားကစားနှင့် တိုက်ရိုက်ပွဲစဉ်များကို Window အသစ်ဖြင့် ချောမွေ့စွာ ကြည့်ရှုပါ' 
              : 'Stream free sports and live football matches directly in your browser with high-speed delivery.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentStreamUrl && (
            <a
              href={currentStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold shadow-lg shadow-pink-500/15 transition-all cursor-pointer"
            >
              {t.openInNewTab}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Active Stream Launch Pad - Built beautifully using Pink, Blue, White and Portugal flag colors */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#0c142c] via-[#050b1d] to-[#040815] shadow-2xl shadow-pink-500/5 flex flex-col items-center justify-center p-4 md:p-6 text-center">
        
        {/* Ambient Portugal colors & Pink glows in background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-[10px] md:text-xs font-bold text-white backdrop-blur-sm border border-white/10 max-w-[85%] truncate">
          <img 
            src={activeChannelLogo} 
            alt="" 
            className="h-4 w-4 rounded-full object-cover shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="truncate text-slate-100">{activeChannelName}</span>
          <span className="text-emerald-500 font-bold ml-1 text-[9px] uppercase tracking-wider animate-pulse font-mono">ONLINE</span>
        </div>

        {/* Main Launcher Hub content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 max-w-lg">
          {/* Channel Logo / Emblem frame with spinning color ring */}
          <div className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-2 shadow-inner">
            <img 
              src={activeChannelLogo} 
              alt="" 
              className="h-full w-full object-contain filter drop-shadow-md"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute -inset-1 rounded-2xl border-2 border-dashed border-pink-500/30 animate-[spin_20s_linear_infinite]" />
          </div>

          {/* Selected Channel Name */}
          <div className="space-y-1">
            <h3 className="text-base md:text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5 px-2">
              {activeChannelName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {language === 'my' ? 'တိုက်ရိုက်' : 'Free Live'}
              </span>
              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20">
                IPTV Stream
              </span>
            </div>
          </div>

          {/* Main Action Launcher Button (Portugal Styled) */}
          <button
            onClick={() => window.open(currentStreamUrl, '_blank')}
            className="group/launch relative flex items-center gap-2.5 px-6 py-3.5 md:px-8 md:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 hover:from-emerald-500 hover:to-red-500 text-white font-extrabold text-xs md:text-sm tracking-wide shadow-xl shadow-pink-500/10 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
          >
            <ExternalLink className="h-4.5 w-4.5 animate-bounce" />
            <span>
              {language === 'my' 
                ? 'တိုက်ရိုက်လွှင့်လှိုင်းအား Browser Window အသစ်ဖြင့် ဖွင့်ပါ' 
                : 'Open Live Stream in New Browser Window'}
            </span>
          </button>

          {/* Myanmar and English instructions explaining why embedded is blocked */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 md:p-3 max-w-md space-y-1 md:space-y-1.5">
            <p className="text-[10px] md:text-xs text-slate-300 font-bold leading-relaxed">
              {language === 'my' 
                ? '💡 ဝဘ်ဆိုက်အတွင်း တိုက်ရိုက်ကြည့်ရှုခြင်းကို စနစ်မှ Block ထားသောကြောင့် Browser ၏ Window အသစ်တွင် တိုက်ရိုက်ပွင့်သွားပြီး အခမဲ့ ချောမွေ့စွာ ကြည့်ရှုနိုင်ပါသည်။' 
                : '💡 Embedded streaming is blocked inside this frame. Click the button above to launch in a new window where it plays instantly.'}
            </p>
            
            {/* Secondary clipboard option for VLC player */}
            <div className="flex items-center justify-center gap-2 pt-1 md:pt-1.5 border-t border-white/5">
              <span className="text-[9px] md:text-[10px] text-slate-500 truncate font-mono max-w-[150px] md:max-w-[220px]">
                {currentStreamUrl}
              </span>
              <button
                onClick={() => {
                  if (currentStreamUrl) {
                    navigator.clipboard.writeText(currentStreamUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="px-2 py-1 rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 text-[9px] md:text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0 animate-none select-none"
              >
                {copied ? (
                  <>
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{language === 'my' ? 'ကူးယူပြီး' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>{language === 'my' ? 'လင့်ခ်ကူးယူမည်' : 'Copy stream link'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Shield Cards & Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-md">
          <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed space-y-1">
            <p className="font-bold text-slate-200">100% Secure & Ads-Protected</p>
            <p>Playing in a new browser window natively allows you to enjoy uninterrupted, full-speed streaming completely protected from popups or redirect advertisements.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-md">
          <Info className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed space-y-1">
            <p className="font-bold text-slate-200">Copy Stream to VLC / MX Player</p>
            <p>You can also copy the streaming URL above and paste it directly into your favorite media player application (VLC Player, PotPlayer, MX Player) for latency-free viewing.</p>
          </div>
        </div>
      </div>

      {/* World Cup Match Simulation Panel */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-pink-500" />
              {language === 'my' ? 'တိုက်ရိုက်ရလဒ် စမ်းသပ်ကြည့်ရှုခြင်း' : 'Live World Cup Score Simulation'}
            </h4>
            <p className="text-[10px] text-slate-500">Enable artificial demo scoreboards to simulate match states</p>
          </div>
          <button
            onClick={() => {
              const val = !showDemoMatches;
              setShowDemoMatches(val);
            }}
            className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              showDemoMatches ? 'bg-pink-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showDemoMatches ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {displayedLiveMatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {displayedLiveMatches.map((match) => (
              <div
                key={match.id}
                className="border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col justify-between hover:border-white/15 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                  <span className="font-bold text-pink-500 animate-pulse flex items-center gap-1">
                    <span className="h-1 w-1 bg-pink-500 rounded-full"></span>
                    {match.minute}' {t.minute}
                  </span>
                  <span>{match.stadium}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{match.homeFlag}</span>
                    <span>{match.homeTeam}</span>
                  </div>
                  <span className="font-mono text-pink-400 bg-black/80 px-2 py-0.5 rounded font-bold border border-white/5">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{match.awayTeam}</span>
                    <span className="text-sm">{match.awayFlag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
