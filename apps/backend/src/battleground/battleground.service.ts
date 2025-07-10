import { Injectable } from '@nestjs/common';

import {
  GameId,
  GamePhase,
  GameState,
  Minion,
  Player,
  PlayerId,
} from './battleground';
import { pool } from './pools';

@Injectable()
export class BattlegroundService {
  private games = new Map<GameId, GameState>();

  getOrCreateGame(gameId: GameId): GameState {
    if (!this.games.has(gameId)) {
      this.games.set(gameId, createGameState(gameId));
    }
    return this.games.get(gameId)!;
  }

  getGame(gameId: GameId): GameState | undefined {
    return this.games.get(gameId);
  }

  addPlayerToGame(gameId: GameId, playerId: PlayerId): GameState {
    const game = this.getOrCreateGame(gameId);
    if (!game.players.find((p) => p.id === playerId)) {
      game.players.push(createPlayer(playerId));
    }
    return game;
  }

  removePlayerFromGame(
    gameId: GameId,
    playerId: string,
  ): GameState | undefined {
    const game = this.getGame(gameId);
    if (!game) return;
    game.players = game.players.filter((p) => p.id !== playerId);
    return game;
  }

  updateGame(gameId: GameId, newState: Partial<GameState>) {
    const game = this.getGame(gameId);
    if (game) {
      this.games.set(gameId, { ...game, ...newState });
    }
  }

  rerollShop(gameId: GameId, playerId: PlayerId): GameState | undefined {
    const game = this.games.get(gameId);

    if (!game) return;

    const player = game.players.find((p) => p.id === playerId);

    if (!player) return;

    const newMinions: Minion[] = pool.getRandomMinionsForTier(
      player.tavernTier,
      3,
    );

    player.shop.minions = newMinions;
    player.gold -= 1;
    player.shop.frozen = false;

    return game;
  }

  upgradeShop(gameId: GameId, playerId: PlayerId): GameState | undefined {
    const game = this.games.get(gameId);

    if (!game) return;

    const player = game.players.find((p) => p.id === playerId);

    if (!player) return;

    if (player.tavernTier < 6) {
      player.tavernTier++;
    }

    return game;
  }

  buyMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): GameState | undefined {
    const game = this.games.get(gameId);

    if (!game) return;

    const player = game.players.find((p) => p.id === playerId);

    if (!player) return;

    const minion = player.shop.minions.find((m) => m.id === minionId);

    if (!minion) return;

    if (player.gold < 3) return;

    player.gold -= 3;

    player.shop.minions = player.shop.minions.filter((m) => m.id !== minionId);
    player.hand.push(minion);

    return game;
  }

  sellMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): GameState | undefined {
    const game = this.games.get(gameId);

    if (!game) return;

    const player = game.players.find((p) => p.id === playerId);

    if (!player) return;

    const minion = player.board.find((m) => m.id === minionId);

    if (!minion) return;

    player.gold += 1;
    player.board = player.board.filter((m) => m.id !== minionId);

    return game;
  }

  playMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): GameState | undefined {
    const game = this.games.get(gameId);
    if (!game) return;

    const player = game.players.find((p) => p.id === playerId);
    if (!player) return;

    const minion = player.hand.find((m) => m.id === minionId);

    if (!minion) return;

    if (player.board.length >= 7) return;

    player.hand = player.hand.filter((m) => m.id !== minionId);
    player.board.push(minion);
    return game;
  }
}

function createGameState(gameId: string): GameState {
  return {
    id: gameId,
    players: [],
    currentTurn: 1,
    phase: GamePhase.Recruitment,
  };
}

function createPlayer(playerId: string): Player {
  return {
    id: playerId,
    name: 'Player',
    hero: {
      id: 'hero-1',
      name: 'Hero 1',
      ability: 'Ability 1',
    },
    health: 30,
    board: [],
    hand: [],
    shop: {
      rerollCost: 1,
      upgradeCost: 2,
      tier: 1,
      minions: pool.getRandomMinionsForTier(1, 3),
      frozen: false,
    },
    gold: 10,
    tavernTier: 1,
    triples: 0,
    isDead: false,
  };
}
