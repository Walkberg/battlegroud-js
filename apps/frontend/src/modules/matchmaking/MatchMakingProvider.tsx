import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "../socketIO/SocketIoProvider";
import { useNavigate } from "react-router-dom";

type MatchmakingState = {
  playerId: string;
  gameId?: string;
  inQueue: boolean;
  isLobbyOwner: boolean;
  lobbyPlayers: string[];
};

type MatchmakingContextType = {
  state: MatchmakingState;
  joinQueue: () => void;
  leaveQueue: () => void;
  createLobby: () => void;
  joinLobby: (gameId: string) => void;
  startGame: () => void;
};

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(
  undefined
);

export const MatchmakingProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [state, setState] = useState<MatchmakingState>({
    playerId: crypto.randomUUID(),
    gameId: undefined,
    inQueue: false,
    isLobbyOwner: false,
    lobbyPlayers: [],
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("match:joinedQueue", ({ gameId }) => {
      setState((prev) => ({ ...prev, inQueue: true, gameId }));
    });

    socket.on("match:lobbyCreated", ({ lobbyId }) => {
      console.log("🏟️ Lobby created:", lobbyId);
      navigate(`/lobby/${lobbyId}`);
      setState((prev) => ({
        ...prev,
        lobbyId,
        isLobbyOwner: true,
        inQueue: false,
      }));
    });

    socket.on("match:joinedLobby", ({ lobbyId, players }) => {
      setState((prev) => ({
        ...prev,
        lobbyId,
        lobbyPlayers: players,
        isLobbyOwner: false,
        inQueue: false,
      }));
    });

    socket.on("match:lobbyUpdated", ({ players }) => {
      setState((prev) => ({ ...prev, lobbyPlayers: players }));
    });

    socket.on("match:gameStarted", ({ gameId }) => {
      console.log("🎮 Game started:", gameId);
    });

    return () => {
      socket.off("match:joinedQueue");
      socket.off("match:lobbyCreated");
      socket.off("match:joinedLobby");
      socket.off("match:lobbyUpdated");
      socket.off("match:gameStarted");
    };
  }, [socket]);

  const joinQueue = () => {
    socket?.emit("match:joinQueue", { playerId: state.playerId });
  };

  const leaveQueue = () => {
    socket?.emit("match:leaveQueue", { playerId: state.playerId });
    setState((prev) => ({ ...prev, inQueue: false }));
  };

  const createLobby = () => {
    console.log("Creating lobby with playerId:", state.playerId);
    socket?.emit("match:createLobby", { playerId: state.playerId });
  };

  const joinLobby = (lobbyId: string) => {
    console.log("Joining lobby with playerId:", state.playerId);
    socket?.emit("match:joinLobby", {
      playerId: state.playerId,
      lobbyId,
    });
  };

  const startGame = () => {
    if (state.isLobbyOwner && state.gameId) {
      socket?.emit("match:startGame", {
        gameId: state.gameId,
      });
    }
  };

  return (
    <MatchmakingContext.Provider
      value={{
        state,
        joinQueue,
        leaveQueue,
        createLobby,
        joinLobby,
        startGame,
      }}
    >
      {children}
    </MatchmakingContext.Provider>
  );
};

export const useMatchmaking = () => {
  const context = useContext(MatchmakingContext);
  if (!context) {
    throw new Error("useMatchmaking must be used within MatchmakingProvider");
  }
  return context;
};
