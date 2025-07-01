import { Injectable } from '@nestjs/common';

import { GameId, GamePhase, GameState, Player, PlayerId } from './battleground';

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
    shop: {
      tier: 1,
      minions: [],
      frozen: false,
    },
    gold: 0,
    tavernTier: 1,
    triples: 0,
    isDead: false,
  };
}
