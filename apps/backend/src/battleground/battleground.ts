import { Battleground } from './battleground-game';
import { Pool } from './pools';

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

  onPlayEffect?: (
    game: GameState,
    playerId: PlayerId,
    minionId: MinionId,
  ) => void;
}

export interface Shop {
  rerollCost: number;
  upgradeCost: number;
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
  hand: Minion[];
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
  pool: Pool;
  id: GameId;
  players: Player[];
  currentTurn: number;
  phase: GamePhase;
}

export abstract class BattlegroundRepository {
  abstract findGameById(gameId: GameId): Promise<Battleground | null>;

  abstract save(game: Battleground): Promise<void>;

  abstract deleteGame(gameId: GameId): Promise<void>;
}
