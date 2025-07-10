import { BattlegroundRepository, GameId, GameState } from './battleground';
import { Battleground } from './battleground-game';

export class BattlegroundRepositoryImpl implements BattlegroundRepository {
  private gamesMap: Map<GameId, Battleground> = new Map();

  async findGameById(gameId: GameId): Promise<Battleground | null> {
    return this.gamesMap.get(gameId) || null;
  }

  async save(game: Battleground): Promise<void> {
    this.gamesMap.set(game.id, game);
  }

  async deleteGame(gameId: GameId): Promise<void> {
    this.gamesMap.delete(gameId);
  }
}
