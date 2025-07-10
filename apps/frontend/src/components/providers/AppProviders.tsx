import { GameManagerProvider } from "@/modules/BattleGroundProvider";
import { FightProvider } from "@/modules/Fight";
import { MatchmakingProvider } from "@/modules/matchmaking/MatchMakingProvider";
import { MinionAnimationProvider } from "@/modules/Minion";
import { PlayerProvider } from "@/modules/PlayerProvider";
import { SocketIOProvider } from "@/modules/socketIO/SocketIoProvider";
import { BrowserRouter, RouterProvider } from "react-router-dom";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <SocketIOProvider>
        <MatchmakingProvider>
          <GameManagerProvider gameId={"game-123"}>
            <PlayerProvider playerId="player-abc">
              <FightProvider>
                <MinionAnimationProvider>{children}</MinionAnimationProvider>
              </FightProvider>
            </PlayerProvider>
          </GameManagerProvider>
        </MatchmakingProvider>
      </SocketIOProvider>
    </BrowserRouter>
  );
};
