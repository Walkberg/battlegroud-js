import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createGameState,
  type GameId,
  type GameState,
  type PlayerId,
} from "./battleground";
import { useSocket } from "./socketIO/SocketIoProvider";

const GameManagerContext = createContext<GameState | undefined>(undefined);

export const GameManagerProvider = ({
  children,
  gameId,
}: {
  children: ReactNode;
  gameId: GameId;
}) => {
  const { socket, isConnected } = useSocket();

  const [gameState] = useState<GameState>(() => createGameState(gameId));
  const [playerId] = useState<PlayerId>("player-abc");

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log(`✅ Connected to socket server: ${socket.id}`);

    socket.emit("joinGame", { gameId: gameId, playerId: playerId });

    socket.on("playerJoined", (game: GameState) => {
      console.log(game);
    });

    socket.on("playerLeft", ({ playerId }) => {
      console.log(`Player ${playerId} has left the game.`);
    });

    return () => {
      socket.emit("leaveGame", { gameId, playerId });
      socket.off("playerJoined");
      socket.off("playerLeft");
    };
  }, [gameId, socket, playerId]);

  return (
    <GameManagerContext.Provider value={gameState}>
      {children}
    </GameManagerContext.Provider>
  );
};

export const useGameManager = (): GameState => {
  const context = useContext(GameManagerContext);
  if (!context) {
    throw new Error("useGameManager must be used within a GameManagerProvider");
  }
  return context;
};
