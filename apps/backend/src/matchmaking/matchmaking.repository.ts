import { Lobby, LobbyId, MatchmakingRepository } from './matchmaking';

export class MatchmakingRepositoryImpl implements MatchmakingRepository {
  private lobbiesMap: Map<LobbyId, Lobby> = new Map();

  async findLobbyById(lobbyId: LobbyId): Promise<Lobby | null> {
    return this.lobbiesMap.get(lobbyId) || null;
  }

  async createLobby(lobby: Lobby): Promise<Lobby> {
    this.lobbiesMap.set(lobby.id, lobby);
    return lobby;
  }

  async updateLobby(lobby: Lobby): Promise<Lobby> {
    this.lobbiesMap.set(lobby.id, lobby);
    return lobby;
  }

  async deleteLobby(lobbyId: LobbyId): Promise<void> {
    this.lobbiesMap.delete(lobbyId);
  }
}
