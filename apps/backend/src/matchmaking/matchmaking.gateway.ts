import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { read } from 'fs';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { MatchmakingService } from './matchmaking.service';

type QueuePlayer = {
  socket: Socket;
  playerId: string;
};

type Lobby = {
  id: string;
  players: string[];
};

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MatchmakingGateway {
  @WebSocketServer()
  server: Server;

  private queue: QueuePlayer[] = [];
  private readonly PLAYERS_PER_GAME = 8;

  constructor(private readonly matchmakingService: MatchmakingService) {}

  @SubscribeMessage('matchmaking:join')
  handleJoinQueue(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.queue.push({ socket: client, playerId: data.playerId });

    if (this.queue.length >= this.PLAYERS_PER_GAME) {
      const players = this.queue.splice(0, this.PLAYERS_PER_GAME);
      const gameId = uuidv4();

      players.forEach(({ socket, playerId }) => {
        socket.join(gameId);
        socket.emit('matchmaking:matched', { gameId, playerId });
      });
    }
  }

  @SubscribeMessage('match:createLobby')
  async handleCreateLobby(
    @MessageBody() data: { playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = await this.matchmakingService.createLobby(data.playerId);
    client.join(lobby.id);
    client.emit('match:lobbyCreated', { lobbyId: lobby.id });
  }

  @SubscribeMessage('match:joinLobby')
  async handleJoinLobby(
    @MessageBody() data: { lobbyId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Joining lobby:', data.lobbyId);
    const lobby = await this.matchmakingService.joinLobby(
      data.lobbyId,
      data.playerId,
    );

    if (!lobby) {
      return client.emit('lobby:error', { message: 'Lobby not found' });
    }

    client.join(lobby.id);
    this.server.to(lobby.id).emit('lobby:state', lobby);
  }

  @SubscribeMessage('lobby:start')
  async handleStartLobby(
    @MessageBody() data: { lobbyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = await this.matchmakingService.startLobby(data.lobbyId);

    this.server.to(data.lobbyId).emit('lobby:started', {});
  }
}
