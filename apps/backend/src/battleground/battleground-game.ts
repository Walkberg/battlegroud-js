import { GameId, GamePhase, Player, PlayerId } from './battleground';
import { PlayerEntity } from './player';
import { Pool } from './pools';

export class Battleground {
  constructor(
    public readonly id: GameId,
    public pool: Pool,
    public currentTurn: number = 1,
    public phase: GamePhase = GamePhase.Recruitment,
    private players: PlayerEntity[] = [],
  ) {}

  getPlayers(): PlayerEntity[] {
    return this.players;
  }

  getPlayer(playerId: PlayerId): PlayerEntity | undefined {
    return this.players.find((p) => p.id === playerId);
  }

  addPlayer(player: PlayerEntity): void {
    this.players.push(player);
  }

  removePlayer(playerId: PlayerId): void {
    this.players = this.players.filter((p) => p.id !== playerId);
  }

  startNextPhase(): void {
    switch (this.phase) {
      case GamePhase.Recruitment:
        this.phase = GamePhase.Combat;
        break;
      case GamePhase.Combat:
        this.phase = GamePhase.End;
        break;
      case GamePhase.End:
        this.phase = GamePhase.Recruitment;
        this.currentTurn++;
        break;
    }
  }

  isFull(): boolean {
    return this.players.length >= 8;
  }

  toGameState(): {
    id: GameId;
    players: Player[];
    currentTurn: number;
    phase: GamePhase;
  } {
    return {
      id: this.id,
      players: this.players.map((p) => p.getPlayer()),
      currentTurn: this.currentTurn,
      phase: this.phase,
    };
  }
}
