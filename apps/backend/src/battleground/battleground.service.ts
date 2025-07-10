import { Injectable } from '@nestjs/common';

import {
  BattlegroundRepository,
  GameId,
  GamePhase,
  GameState,
  Minion,
  Player,
  PlayerId,
} from './battleground';
import { pool } from './pools';
import { read } from 'fs';
import { Battleground } from './battleground-game';
import { PlayerEntity } from './player';

@Injectable()
export class BattlegroundService {
  constructor(
    private readonly battlegroundRepository: BattlegroundRepository,
  ) {}

  async getOrCreateGame(gameId: GameId): Promise<Battleground> {
    const game = await this.battlegroundRepository.findGameById(gameId);

    if (!game) {
      const newGame = createBattleground(gameId);
      await this.battlegroundRepository.save(newGame);
      return newGame;
    }
    return game;
  }

  async getGame(gameId: GameId): Promise<Battleground | null> {
    return await this.battlegroundRepository.findGameById(gameId);
  }

  async addPlayerToGame(
    gameId: GameId,
    playerId: PlayerId,
  ): Promise<Battleground> {
    const game = await this.getOrCreateGame(gameId);

    console.log(`Adding player ${playerId} to game ${gameId}`);

    game.addPlayer(new PlayerEntity(playerId, createPlayer(playerId), game));

    return game;
  }

  async removePlayerFromGame(
    gameId: GameId,
    playerId: string,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);

    if (!game) return;

    game.removePlayer(playerId);
    return game;
  }

  async rerollShop(
    gameId: GameId,
    playerId: PlayerId,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);

    if (!game) return;

    const player = game.getPlayer(playerId);

    if (!player) return;

    player.rerollShop();

    return game;
  }

  async upgradeShop(
    gameId: GameId,
    playerId: PlayerId,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);

    if (!game) return;

    const player = game.getPlayer(playerId);

    if (!player) return;

    player.upgradeShop();

    return game;
  }

  async buyMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);

    if (!game) return;

    const player = game.getPlayer(playerId);

    if (!player) return;

    player.buyMinion(minionId);

    return game;
  }

  async sellMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);

    if (!game) return;

    const player = game.getPlayer(playerId);

    if (!player) return;

    player.sellMinion(minionId);

    return game;
  }

  async playMinion(
    gameId: GameId,
    playerId: PlayerId,
    minionId: string,
  ): Promise<Battleground | undefined> {
    const game = await this.getGame(gameId);
    if (!game) return;

    const player = game.getPlayer(playerId);

    if (!player) return;

    player.playMinion(minionId);

    // if (minion.onPlayEffect) {
    //   minion.onPlayEffect(game, playerId, minionId);
    // }

    return game;
  }
}

function createGameState(gameId: string): GameState {
  return {
    pool,
    id: gameId,
    players: [],
    currentTurn: 1,
    phase: GamePhase.Recruitment,
  };
}

function createBattleground(gameId: string): Battleground {
  return new Battleground(gameId, pool);
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
