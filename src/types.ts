export type Language = 'my' | 'en';

export interface Scorer {
  name: string;
  time: number;
  team: 'home' | 'away';
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  stage: 'group' | 'round_32' | 'round_16' | 'quarter' | 'semi' | 'third_place' | 'final';
  status: 'live' | 'upcoming' | 'completed';
  group?: string;
  stadium: string;
  city: string;
  scorers?: Scorer[];
  minute?: number; // for live matches
  highlightsUrl?: string;
}

export interface GroupTeam {
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface GroupStanding {
  name: string;
  teams: GroupTeam[];
}

export interface WorldCupWinner {
  year: number;
  host: string;
  champion: string;
  championFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  score: string;
  topScorer: string;
}

export interface HistoricalMatchup {
  teamA: string;
  teamB: string;
  played: number;
  winA: number;
  winB: number;
  draws: number;
  meetings: {
    year: number;
    stage: string;
    score: string;
    winner: string;
  }[];
}
