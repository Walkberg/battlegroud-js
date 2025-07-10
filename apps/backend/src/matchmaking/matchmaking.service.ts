import { Injectable } from '@nestjs/common';
import { Lobby, MatchmakingRepository } from './matchmaking';
import { read } from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class MatchmakingService {
  constructor(private readonly matchmakingRepository: MatchmakingRepository) {}

  async createLobby(playerId: string): Promise<Lobby> {
    const lobby: Lobby = {
      id: randomUUID(),
      players: [playerId],
    };

    return this.matchmakingRepository.createLobby(lobby);
  }

  async joinLobby(lobbyId: string, playerId: string): Promise<Lobby> {
    console.log(`Joining lobby ${lobbyId} for player ${playerId}`);
    const lobby = await this.matchmakingRepository.findLobbyById(lobbyId);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    const playerExists = lobby.players.includes(playerId);

    if (playerExists) {
      throw new Error('Player already in lobby');
    }

    lobby.players.push(playerId);

    return this.matchmakingRepository.updateLobby(lobby);
  }

  async startLobby(lobbyId: string): Promise<void> {
    const lobby = await this.matchmakingRepository.findLobbyById(lobbyId);

    if (!lobby) {
      throw new Error('Lobby not found');
    }
  }

  async leaveLobby(lobbyId: string, playerId: string): Promise<void> {
    const lobby = await this.matchmakingRepository.findLobbyById(lobbyId);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    lobby.players = lobby.players.filter((id) => id !== playerId);

    await this.matchmakingRepository.updateLobby(lobby);
  }
}
