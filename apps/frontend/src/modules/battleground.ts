export type PlayerId = string;

export type MinionId = string;

export type HeroId = string;

export type GameId = string;

export enum GamePhase {
  Recruitment = "recruitment",
  Combat = "combat",
  End = "end",
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
  id: GameId;
  players: Player[];
  currentTurn: number;
  phase: GamePhase;
}

interface GameManager {
  startGame(): void;
  endGame(): void;

  getState(): GameState;

  nextPhase(): void;

  recruitMinion(playerId: PlayerId, minionId: MinionId): void;
  sellMinion(playerId: PlayerId, minionId: MinionId): void;
  rerollShop(playerId: PlayerId): void;
  freezeShop(playerId: PlayerId): void;
  upgradeTavern(playerId: PlayerId): void;

  resolveCombat(): CombatResult[];
}

export function createGameState(gameId: string): GameState {
  return {
    id: gameId,
    players: Array(8).fill(
      createPlayer(
        "uuidv4()",
        "Player 1",
        createHero(),
        30,
        [],
        [],
        createShop(1),
        3,
        1,
        0,
        false
      )
    ),
    currentTurn: 1,
    phase: GamePhase.Recruitment,
  };
}

export function createPlayer(
  playerId: PlayerId,
  name: string,
  hero: Hero,
  health: number,
  board: Minion[],
  hand: Minion[],
  shop: Shop,
  gold: number,
  tavernTier: number,
  triples: number,
  isDead: boolean
): Player {
  return {
    id: playerId,
    name,
    hero,
    health,
    board,
    hand,
    shop,
    gold,
    tavernTier,
    triples,
    isDead,
  };
}

function createHero(): Hero {
  return {
    id: "uuidv4()",
    name: "Hero",
    ability: "Ability",
  };
}

function createShop(tier: number): Shop {
  return {
    tier,
    minions: [],
    frozen: false,
  };
}
