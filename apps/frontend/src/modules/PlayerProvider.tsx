import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type GameId,
  type MinionId,
  type Player,
  type PlayerId,
} from "./battleground";
import { useSocket } from "./socketIO/SocketIoProvider";
import { useGameManager } from "./BattleGroundProvider";
import { useCardAnimation } from "./Minion";

interface PlayerProviderState {
  rerollShop: () => void;
  upgradeTavern: () => void;
  freezeTavern: () => void;
  buyMinion: (minionId: MinionId) => void;
  sellMinion: (minionId: MinionId) => void;
  playMinion: (minionId: MinionId) => void;
  player: Player | undefined;
}

const PlayerProviderContext = createContext<PlayerProviderState | undefined>(
  undefined
);

export const PlayerProvider = ({
  children,
  playerId,
}: {
  children: ReactNode;
  playerId: PlayerId;
}) => {
  const { playEventForCard } = useCardAnimation();
  const { socket } = useSocket();
  const game = useGameManager();

  const [player, setPlayer] = useState<Player>();

  const rerollTavern = () => {
    if (socket == null) return;

    socket.emit("rerollShop", {
      gameId: game.id,
      playerId: playerId,
    });
  };

  const upgradeTavern = () => {
    if (socket == null) return;

    socket.emit("upgradeShop", {
      gameId: game.id,
      playerId: playerId,
    });
  };

  function freezeTavern() {
    if (socket == null) return;
    socket.emit("freezeShop", {
      gameId: game.id,
      playerId: playerId,
    });
  }

  function buyMinion(minionId: MinionId) {
    if (socket == null) return;
    socket.emit("buyMinion", {
      gameId: game.id,
      playerId: playerId,
      minionId,
    });
  }

  function sellMinion(minionId: MinionId) {
    if (socket == null) return;
    socket.emit("sellMinion", {
      gameId: game.id,
      playerId: playerId,
      minionId,
    });
  }

  function playMinion(minionId: MinionId) {
    if (socket == null) return;
    socket.emit("playMinion", {
      gameId: game.id,
      playerId: playerId,
      minionId,
    });
  }

  useEffect(() => {
    setPlayer(game.players.find((p) => p.id === playerId));
    [game];
  });

  return (
    <PlayerProviderContext.Provider
      value={{
        rerollShop: rerollTavern,
        upgradeTavern,
        freezeTavern,
        buyMinion,
        sellMinion,
        playMinion,
        player,
      }}
    >
      {children}
    </PlayerProviderContext.Provider>
  );
};

export const usePlayer = (): PlayerProviderState => {
  const context = useContext(PlayerProviderContext);
  if (!context) {
    throw new Error("useGameManager must be used within a GameManagerProvider");
  }
  return context;
};

const GameEvent = "";

export interface GameClientToServerEvents {
  joinGame: { gameId: GameId; playerId: PlayerId };
  leaveGame: { gameId: GameId; playerId: PlayerId };
  rerollShop: { gameId: GameId; playerId: PlayerId };
  upgradeShop: { gameId: GameId; playerId: PlayerId };
  freezeShop: { gameId: GameId; playerId: PlayerId };
  buyMinion: { gameId: GameId; playerId: PlayerId; minionId: MinionId };
  sellMinion: { gameId: GameId; playerId: PlayerId; minionId: MinionId };
  playMinion: { gameId: GameId; playerId: PlayerId; minionId: MinionId };
}
