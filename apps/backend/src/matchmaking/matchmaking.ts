import { PlayerId } from 'src/battleground/battleground';

export type LobbyId = string;

export interface Lobby {
  id: LobbyId;
  players: PlayerId[];
}

export abstract class MatchmakingRepository {
  abstract findLobbyById(lobbyId: LobbyId): Promise<Lobby | null>;

  abstract createLobby(lobby: Lobby): Promise<Lobby>;

  abstract updateLobby(lobby: Lobby): Promise<Lobby>;

  abstract deleteLobby(lobbyId: LobbyId): Promise<void>;
}
