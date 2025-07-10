import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattlegroundService } from './battleground.service';
import { GamePhase } from './battleground';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly battlegroundService: BattlegroundService) {}

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, playerId } = data;

    const game = await this.battlegroundService.addPlayerToGame(
      gameId,
      playerId,
    );
    client.join(gameId);

    console.log(game);

    client.to(gameId).emit('playerJoined', game.toGameState());
    this.server.to(data.gameId).emit('game:state', game.toGameState());

    return { status: 'ok', message: `Joined game ${gameId}` };
  }

  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, playerId } = data;

    client.leave(gameId);

    const game = await this.battlegroundService.removePlayerFromGame(
      gameId,
      playerId,
    );

    client.to(gameId).emit('playerLeft', { playerId });

    return { status: 'ok', message: `Left game ${gameId}` };
  }

  @SubscribeMessage('nextPhase')
  async handleNextPhase(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.battlegroundService.getGame(data.gameId);

    if (!game) return;

    const next =
      game.phase === GamePhase.Recruitment
        ? GamePhase.Combat
        : game.phase === GamePhase.Combat
          ? GamePhase.End
          : GamePhase.Recruitment;

    game.phase = next;
    this.server.to(data.gameId).emit('game:state', game.toGameState());

    return { status: 'ok', game };
  }

  @SubscribeMessage('rerollShop')
  async handleRerollShop(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.battlegroundService.rerollShop(
      data.gameId,
      data.playerId,
    );
    if (game) {
      this.server.to(data.gameId).emit('game:state', game.toGameState());
    }

    return { status: 'ok', game };
  }

  @SubscribeMessage('upgradeShop')
  async handleUpgradeShop(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.battlegroundService.upgradeShop(
      data.gameId,
      data.playerId,
    );
    if (game) {
      this.server.to(data.gameId).emit('game:state', game.toGameState());
    }

    return { status: 'ok', game };
  }
  @SubscribeMessage('buyMinion')
  async handleBuyMinion(
    @MessageBody() data: { gameId: string; playerId: string; minionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('buyMinion', data);
    const game = await this.battlegroundService.buyMinion(
      data.gameId,
      data.playerId,
      data.minionId,
    );
    console.log('buyMinion', game);
    if (game) {
      this.server.to(data.gameId).emit('game:state', game.toGameState());
    }

    return { status: 'ok', game };
  }

  @SubscribeMessage('sellMinion')
  async handleSellMinion(
    @MessageBody() data: { gameId: string; playerId: string; minionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.battlegroundService.sellMinion(
      data.gameId,
      data.playerId,
      data.minionId,
    );
    if (game) {
      this.server.to(data.gameId).emit('game:state', game.toGameState());
    }
    return { status: 'ok', game };
  }

  @SubscribeMessage('playMinion')
  async handlePlayMinion(
    @MessageBody() data: { gameId: string; playerId: string; minionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.battlegroundService.playMinion(
      data.gameId,
      data.playerId,
      data.minionId,
    );
    if (game) {
      this.server.to(data.gameId).emit('game:state', game.toGameState());
    }
    return { status: 'ok', game };
  }
}
