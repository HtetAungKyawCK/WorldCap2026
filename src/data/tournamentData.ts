import { Match, GroupStanding, WorldCupWinner, HistoricalMatchup } from '../types';

export const matchesData: Match[] = [
  // --- LIVE MATCHES TODAY (JULY 5-6, 2026) ---
  {
    id: 'live-1',
    homeTeam: 'Brazil',
    awayTeam: 'Norway',
    homeFlag: '🇧🇷',
    awayFlag: '🇳🇴',
    homeScore: 1,
    awayScore: 2,
    date: '2026-07-06',
    time: '03:00',
    stage: 'round_16',
    status: 'completed',
    stadium: 'Rose Bowl',
    city: 'Pasadena',
    minute: 90,
    scorers: [
      { name: 'Vinícius Júnior', time: 15, team: 'home' },
      { name: 'Erling Haaland', time: 42, team: 'away' },
      { name: 'Martin Ødegaard', time: 78, team: 'away' }
    ]
  },
  {
    id: 'live-2',
    homeTeam: 'Mexico',
    awayTeam: 'England',
    homeFlag: '🇲🇽',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeScore: 2,
    awayScore: 3,
    date: '2026-07-06',
    time: '07:00',
    stage: 'round_16',
    status: 'completed',
    stadium: 'MetLife Stadium',
    city: 'East Rutherford',
    minute: 90,
    scorers: [
      { name: 'Santiago Giménez', time: 12, team: 'home' },
      { name: 'Harry Kane', time: 28, team: 'away' },
      { name: 'Jude Bellingham', time: 55, team: 'away' },
      { name: 'Hirving Lozano', time: 64, team: 'home' },
      { name: 'Bukayo Saka', time: 81, team: 'away' }
    ]
  },
  {
    id: 'live-3',
    homeTeam: 'Canada',
    awayTeam: 'Morocco',
    homeFlag: '🇨🇦',
    awayFlag: '🇲🇦',
    homeScore: 0,
    awayScore: 3,
    date: '2026-07-05',
    time: '15:00',
    stage: 'round_16',
    status: 'completed',
    stadium: 'BMO Field',
    city: 'Toronto',
    minute: 90,
    scorers: [
      { name: 'Youssef En-Nesyri', time: 22, team: 'away' },
      { name: 'Hakim Ziyech', time: 47, team: 'away' },
      { name: 'Achraf Hakimi', time: 74, team: 'away' }
    ]
  },
  {
    id: 'live-4',
    homeTeam: 'Paraguay',
    awayTeam: 'France',
    homeFlag: '🇵🇾',
    awayFlag: '🇫🇷',
    homeScore: 0,
    awayScore: 1,
    date: '2026-07-05',
    time: '18:00',
    stage: 'round_16',
    status: 'completed',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    minute: 90,
    scorers: [
      { name: 'Kylian Mbappé', time: 61, team: 'away' }
    ]
  },

  // --- UPCOMING MATCHES ---
  {
    id: 'up-1',
    homeTeam: 'Portugal',
    awayTeam: 'Netherlands',
    homeFlag: '🇵🇹',
    awayFlag: '🇳🇱',
    date: '2026-07-06',
    time: '18:00',
    stage: 'round_16',
    status: 'upcoming',
    stadium: 'AT&T Stadium',
    city: 'Dallas'
  },
  {
    id: 'up-2',
    homeTeam: 'Argentina',
    awayTeam: 'Germany',
    homeFlag: '🇦🇷',
    awayFlag: '🇩🇪',
    date: '2026-07-07',
    time: '17:00',
    stage: 'round_16',
    status: 'upcoming',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta'
  },
  {
    id: 'up-3',
    homeTeam: 'Winner R16 Match 3',
    awayTeam: 'Winner R16 Match 4',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-10',
    time: '19:00',
    stage: 'quarter',
    status: 'upcoming',
    stadium: 'Gillette Stadium',
    city: 'Boston'
  },
  {
    id: 'up-4',
    homeTeam: 'Winner R16 Match 1',
    awayTeam: 'Winner R16 Match 2',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-11',
    time: '18:00',
    stage: 'quarter',
    status: 'upcoming',
    stadium: 'Hard Rock Stadium',
    city: 'Miami'
  },
  {
    id: 'up-5',
    homeTeam: 'Semifinalist 1',
    awayTeam: 'Semifinalist 2',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-14',
    time: '20:00',
    stage: 'semi',
    status: 'upcoming',
    stadium: 'AT&T Stadium',
    city: 'Dallas'
  },
  {
    id: 'up-6',
    homeTeam: 'Semifinalist 3',
    awayTeam: 'Semifinalist 4',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-15',
    time: '20:00',
    stage: 'semi',
    status: 'upcoming',
    stadium: 'Mercedes-Benz Stadium',
    city: 'Atlanta'
  },
  {
    id: 'up-7',
    homeTeam: 'Loser SF1',
    awayTeam: 'Loser SF2',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-18',
    time: '16:00',
    stage: 'third_place',
    status: 'upcoming',
    stadium: 'Hard Rock Stadium',
    city: 'Miami'
  },
  {
    id: 'up-8',
    homeTeam: 'Finalist 1',
    awayTeam: 'Finalist 2',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    date: '2026-07-19',
    time: '18:00',
    stage: 'final',
    status: 'upcoming',
    stadium: 'MetLife Stadium',
    city: 'East Rutherford'
  },

  // --- COMPLETED MATCHES ---
  {
    id: 'comp-1',
    homeTeam: 'Spain',
    awayTeam: 'Japan',
    homeFlag: '🇪🇸',
    awayFlag: '🇯🇵',
    homeScore: 2,
    awayScore: 0,
    date: '2026-07-03',
    time: '18:00',
    stage: 'round_32',
    status: 'completed',
    stadium: 'BC Place',
    city: 'Vancouver',
    scorers: [
      { name: 'Álvaro Morata', time: 41, team: 'home' },
      { name: 'Nico Williams', time: 78, team: 'home' }
    ]
  },
  {
    id: 'comp-2',
    homeTeam: 'Germany',
    awayTeam: 'Croatia',
    homeFlag: '🇩🇪',
    awayFlag: '🇭🇷',
    homeScore: 2,
    awayScore: 1,
    date: '2026-07-02',
    time: '20:00',
    stage: 'round_32',
    status: 'completed',
    stadium: 'Lumen Field',
    city: 'Seattle',
    scorers: [
      { name: 'Jamal Musiala', time: 14, team: 'home' },
      { name: 'Luka Modrić', time: 45, team: 'away' },
      { name: 'Kai Havertz', time: 82, team: 'home' }
    ]
  },
  {
    id: 'comp-3',
    homeTeam: 'Argentina',
    awayTeam: 'Saudi Arabia',
    homeFlag: '🇦🇷',
    awayFlag: '🇸🇦',
    homeScore: 3,
    awayScore: 0,
    date: '2026-06-25',
    time: '15:00',
    stage: 'group',
    status: 'completed',
    stadium: 'NRG Stadium',
    city: 'Houston',
    scorers: [
      { name: 'Lionel Messi', time: 12, team: 'home' },
      { name: 'Julián Álvarez', time: 49, team: 'home' },
      { name: 'Lautaro Martínez', time: 76, team: 'home' }
    ]
  },
  {
    id: 'comp-4',
    homeTeam: 'Mexico',
    awayTeam: 'Italy',
    homeFlag: '🇲🇽',
    awayFlag: '🇮🇹',
    homeScore: 1,
    awayScore: 1,
    date: '2026-06-22',
    time: '19:00',
    stage: 'group',
    status: 'completed',
    stadium: 'Estadio Azteca',
    city: 'Mexico City',
    scorers: [
      { name: 'Santiago Giménez', time: 29, team: 'home' },
      { name: 'Federico Chiesa', time: 61, team: 'away' }
    ]
  },
  {
    id: 'comp-5',
    homeTeam: 'Canada',
    awayTeam: 'Morocco',
    homeFlag: '🇨🇦',
    awayFlag: '🇲🇦',
    homeScore: 0,
    awayScore: 2,
    date: '2026-06-18',
    time: '17:00',
    stage: 'group',
    status: 'completed',
    stadium: 'BMO Field',
    city: 'Toronto',
    scorers: [
      { name: 'Youssef En-Nesyri', time: 38, team: 'away' },
      { name: 'Hakim Ziyech', time: 72, team: 'away' }
    ]
  }
];

export const groupStandingsData: GroupStanding[] = [
  {
    name: 'Group A',
    teams: [
      { name: 'Mexico', flag: '🇲🇽', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
      { name: 'Italy', flag: '🇮🇹', played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, gd: 1, pts: 5 },
      { name: 'Sweden', flag: '🇸🇪', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { name: 'New Zealand', flag: '🇳🇿', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 4, gd: -3, pts: 1 }
    ]
  },
  {
    name: 'Group B',
    teams: [
      { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, gd: 7, pts: 9 },
      { name: 'South Korea', flag: '🇰🇷', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4 },
      { name: 'Ecuador', flag: '🇪🇨', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { name: 'Cameroon', flag: '🇨🇲', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 7, gd: -5, pts: 1 }
    ]
  },
  {
    name: 'Group C',
    teams: [
      { name: 'Argentina', flag: '🇦🇷', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 1, gd: 6, pts: 7 },
      { name: 'Poland', flag: '🇵🇱', played: 3, won: 1, drawn: 2, lost: 0, gf: 3, ga: 2, gd: 1, pts: 5 },
      { name: 'Saudi Arabia', flag: '🇸🇦', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, gd: -3, pts: 3 },
      { name: 'Mali', flag: '🇲🇱', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, pts: 1 }
    ]
  },
  {
    name: 'Group D',
    teams: [
      { name: 'France', flag: '🇫🇷', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
      { name: 'Denmark', flag: '🇩🇰', played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, gd: 1, pts: 6 },
      { name: 'Tunisia', flag: '🇹🇳', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { name: 'Australia', flag: '🇦🇺', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 5, gd: -3, pts: 1 }
    ]
  },
  {
    name: 'Group E',
    teams: [
      { name: 'Spain', flag: '🇪🇸', played: 3, won: 2, drawn: 1, lost: 0, gf: 8, ga: 2, gd: 6, pts: 7 },
      { name: 'Japan', flag: '🇯🇵', played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
      { name: 'Costa Rica', flag: '🇨🇷', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 6, gd: -4, pts: 3 },
      { name: 'Zambia', flag: '🇿🇲', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, gd: -4, pts: 1 }
    ]
  },
  {
    name: 'Group F',
    teams: [
      { name: 'Germany', flag: '🇩🇪', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 1, gd: 4, pts: 7 },
      { name: 'Croatia', flag: '🇭🇷', played: 3, won: 1, drawn: 2, lost: 0, gf: 3, ga: 2, gd: 1, pts: 5 },
      { name: 'Canada', flag: '🇨🇦', played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, gd: -2, pts: 3 },
      { name: 'Morocco', flag: '🇲🇦', played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 4, gd: -3, pts: 1 }
    ]
  },
  {
    name: 'Group G',
    teams: [
      { name: 'Brazil', flag: '🇧🇷', played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 2, gd: 7, pts: 9 },
      { name: 'Switzerland', flag: '🇨🇭', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 5, gd: -1, pts: 4 },
      { name: 'Serbia', flag: '🇷🇸', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { name: 'Ghana', flag: '🇬🇭', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, gd: -4, pts: 1 }
    ]
  },
  {
    name: 'Group H',
    teams: [
      { name: 'Portugal', flag: '🇵🇹', played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
      { name: 'Uruguay', flag: '🇺🇾', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4 },
      { name: 'Ghana', flag: '🇬🇭', played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { name: 'South Korea', flag: '🇰🇷', played: 3, won: 0, drawn: 2, lost: 1, gf: 2, ga: 4, gd: -2, pts: 2 }
    ]
  }
];

export const pastWinnersData: WorldCupWinner[] = [
  { year: 2022, host: 'Qatar', champion: 'Argentina', championFlag: '🇦🇷', runnerUp: 'France', runnerUpFlag: '🇫🇷', score: '3-3 (4-2 pens)', topScorer: 'Kylian Mbappé (8 goals)' },
  { year: 2018, host: 'Russia', champion: 'France', championFlag: '🇫🇷', runnerUp: 'Croatia', runnerUpFlag: '🇭🇷', score: '4-2', topScorer: 'Harry Kane (6 goals)' },
  { year: 2014, host: 'Brazil', champion: 'Germany', championFlag: '🇩🇪', runnerUp: 'Argentina', runnerUpFlag: '🇦🇷', score: '1-0 (aet)', topScorer: 'James Rodríguez (6 goals)' },
  { year: 2010, host: 'South Africa', champion: 'Spain', championFlag: '🇪🇸', runnerUp: 'Netherlands', runnerUpFlag: '🇳🇱', score: '1-0 (aet)', topScorer: 'Thomas Müller (5 goals)' },
  { year: 2006, host: 'Germany', champion: 'Italy', championFlag: '🇮🇹', runnerUp: 'France', runnerUpFlag: '🇫🇷', score: '1-1 (5-3 pens)', topScorer: 'Miroslav Klose (5 goals)' },
  { year: 2002, host: 'Korea/Japan', champion: 'Brazil', championFlag: '🇧🇷', runnerUp: 'Germany', runnerUpFlag: '🇩🇪', score: '2-0', topScorer: 'Ronaldo (8 goals)' },
  { year: 1998, host: 'France', champion: 'France', championFlag: '🇫🇷', runnerUp: 'Brazil', runnerUpFlag: '🇧🇷', score: '3-0', topScorer: 'Davor Šuker (6 goals)' },
  { year: 1994, host: 'United States', champion: 'Brazil', championFlag: '🇧🇷', runnerUp: 'Italy', runnerUpFlag: '🇮🇹', score: '0-0 (3-2 pens)', topScorer: 'Hristo Stoichkov (6 goals)' }
];

export const historicalMatchupsData: HistoricalMatchup[] = [
  {
    teamA: 'Brazil',
    teamB: 'Germany',
    played: 2,
    winA: 1,
    winB: 1,
    draws: 0,
    meetings: [
      { year: 2014, stage: 'Semifinals', score: '1-7', winner: 'Germany' },
      { year: 2002, stage: 'Final', score: '2-0', winner: 'Brazil' }
    ]
  },
  {
    teamA: 'Argentina',
    teamB: 'France',
    played: 4,
    winA: 2,
    winB: 1,
    draws: 1,
    meetings: [
      { year: 2022, stage: 'Final', score: '3-3 (4-2 pens)', winner: 'Argentina' },
      { year: 2018, stage: 'Round of 16', score: '3-4', winner: 'France' },
      { year: 1978, stage: 'Group Stage', score: '2-1', winner: 'Argentina' },
      { year: 1930, stage: 'Group Stage', score: '1-0', winner: 'Argentina' }
    ]
  },
  {
    teamA: 'England',
    teamB: 'Germany',
    played: 5,
    winA: 1,
    winB: 3,
    draws: 1,
    meetings: [
      { year: 2010, stage: 'Round of 16', score: '1-4', winner: 'Germany' },
      { year: 1990, stage: 'Semifinals', score: '1-1 (3-4 pens)', winner: 'Germany' },
      { year: 1970, stage: 'Quarterfinals', score: '2-3 (aet)', winner: 'Germany' },
      { year: 1966, stage: 'Final', score: '4-2 (aet)', winner: 'England' }
    ]
  },
  {
    teamA: 'Brazil',
    teamB: 'Italy',
    played: 5,
    winA: 2,
    winB: 2,
    draws: 1,
    meetings: [
      { year: 1994, stage: 'Final', score: '0-0 (3-2 pens)', winner: 'Brazil' },
      { year: 1982, stage: 'Second Round', score: '2-3', winner: 'Italy' },
      { year: 1978, stage: 'Third Place Match', score: '2-1', winner: 'Brazil' },
      { year: 1970, stage: 'Final', score: '4-1', winner: 'Brazil' },
      { year: 1938, stage: 'Semifinals', score: '1-2', winner: 'Italy' }
    ]
  }
];
