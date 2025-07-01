export type PlayerId = string;

export type MinionId = string;

export type HeroId = string;

export type GameId = string;

export enum GamePhase {
  Recruitment = 'recruitment',
  Combat = 'combat',
  End = 'end',
}

export interface Stats {
  attack: number;
  health: number;
}

export interface Minion {
  id: MinionId;
  name: string;
  tier: number;
  stats: Stats;
}

export interface Shop {
  tier: number;
  minions: Minion[];
  frozen: boolean;
}

export interface Hero {
  id: HeroId;
  name: string;
  ability: string;
}

export interface Player {
  id: PlayerId;
  name: string;
  hero: Hero;
  health: number;
  board: Minion[];
  shop: Shop;
  gold: number;
  tavernTier: number;
  triples: number;
  isDead: boolean;
}

export interface CombatResult {
  winnerId: PlayerId | null; // null = égalité
  damageDealt: number;
  loserId: PlayerId;
}

export interface GameState {
  id: GameId;
  players: Player[];
  currentTurn: number;
  phase: GamePhase;
}
