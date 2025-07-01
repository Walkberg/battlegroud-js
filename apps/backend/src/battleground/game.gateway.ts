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
  handleJoinGame(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, playerId } = data;

    client.join(gameId);
    const game = this.battlegroundService.addPlayerToGame(gameId, playerId);

    client.to(gameId).emit('playerJoined', game);

    return { status: 'ok', message: `Joined game ${gameId}` };
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, playerId } = data;

    client.leave(gameId);

    const game = this.battlegroundService.removePlayerFromGame(
      gameId,
      playerId,
    );

    client.to(gameId).emit('playerLeft', { playerId });

    return { status: 'ok', message: `Left game ${gameId}` };
  }

  @SubscribeMessage('nextPhase')
  handleNextPhase(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.battlegroundService.getGame(data.gameId);

    if (!game) return;

    const next =
      game.phase === GamePhase.Recruitment
        ? GamePhase.Combat
        : game.phase === GamePhase.Combat
          ? GamePhase.End
          : GamePhase.Recruitment;

    game.phase = next;
    this.server.to(data.gameId).emit('game:state', game);

    return { status: 'ok', game };
  }
}
