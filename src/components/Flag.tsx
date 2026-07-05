import React from 'react';

// Maps both country names (lowercase) and emojis to their ISO-3166 codes for FlagCDN
const flagCodeMap: Record<string, string> = {
  // Names
  'argentina': 'ar',
  'australia': 'au',
  'brazil': 'br',
  'cameroon': 'cm',
  'canada': 'ca',
  'costa rica': 'cr',
  'croatia': 'hr',
  'denmark': 'dk',
  'ecuador': 'ec',
  'england': 'gb-eng',
  'france': 'fr',
  'germany': 'de',
  'ghana': 'gh',
  'italy': 'it',
  'japan': 'jp',
  'mexico': 'mx',
  'morocco': 'ma',
  'netherlands': 'nl',
  'new zealand': 'nz',
  'poland': 'pl',
  'portugal': 'pt',
  'saudi arabia': 'sa',
  'serbia': 'rs',
  'south korea': 'kr',
  'spain': 'es',
  'sweden': 'se',
  'switzerland': 'ch',
  'tunisia': 'tn',
  'united states': 'us',
  'uruguay': 'uy',
  'zambia': 'zm',
  'qatar': 'qa',
  'russia': 'ru',
  'south africa': 'za',
  'korea/japan': 'kr',

  // Emojis
  '🇦🇷': 'ar',
  '🇦🇺': 'au',
  '🇧🇷': 'br',
  '🇨🇲': 'cm',
  '🇨🇦': 'ca',
  '🇨🇷': 'cr',
  '🇭🇷': 'hr',
  '🇩🇰': 'dk',
  '🇪🇨': 'ec',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🇫🇷': 'fr',
  '🇩🇪': 'de',
  '🇬🇭': 'gh',
  '🇮🇹': 'it',
  '🇯🇵': 'jp',
  '🇲🇽': 'mx',
  '🇲🇦': 'ma',
  '🇳🇱': 'nl',
  '🇳🇿': 'nz',
  '🇵🇱': 'pl',
  '🇵🇹': 'pt',
  '🇸🇦': 'sa',
  '🇷🇸': 'rs',
  '🇰🇷': 'kr',
  '🇪🇸': 'es',
  '🇸🇪': 'se',
  '🇨🇭': 'ch',
  '🇹🇳': 'tn',
  '🇺🇸': 'us',
  '🇺🇾': 'uy',
  '🇿🇲': 'zm',
  '🇶🇦': 'qa',
  '🇷🇺': 'ru',
  '🇿🇦': 'za'
};

interface FlagProps {
  country?: string;  // Can be country name, e.g. "Brazil" or "United States"
  emoji?: string;     // Can be the emoji flag character
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Flag({ country = '', emoji = '', className = '', size = 'md' }: FlagProps) {
  const normCountry = country.trim().toLowerCase();
  const code = flagCodeMap[normCountry] || flagCodeMap[emoji] || null;

  const sizeClasses = {
    sm: 'w-4 h-3.5',
    md: 'w-6 h-4.5',
    lg: 'w-8 h-6'
  };

  // If no country code can be matched, render a beautiful placeholder sphere
  if (!code || normCountry.includes('winner') || normCountry.includes('semifinalist') || normCountry.includes('finalist') || normCountry === 'tbd') {
    return (
      <div 
        className={`inline-flex items-center justify-center bg-slate-800 rounded text-[10px] text-slate-400 font-bold border border-white/10 shrink-0 ${sizeClasses[size]} ${className}`}
        title={country || 'TBD'}
      >
        🏳️
      </div>
    );
  }

  // Render highly-polished high-performance CDN flag from FlagCDN
  // This loads instantly and renders perfectly on Windows, Android, Mac, and iOS
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={country || 'Flag'}
      className={`inline-block rounded-sm object-cover border border-white/10 shadow-sm shrink-0 ${sizeClasses[size]} ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback to text or white flag emoji if image fails to load
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
