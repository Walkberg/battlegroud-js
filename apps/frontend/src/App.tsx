import "./App.css";
import { GameManagerProvider } from "./modules/BattleGroundProvider";
import BattleGround from "./modules/Batttleground";
import GamePhaseControls from "./modules/DevelopperGUI";
import { FightProvider } from "./modules/Fight";
import { SocketIOProvider } from "./modules/socketIO/SocketIoProvider";
import { Leva } from "leva";

function App() {
  return (
    <SocketIOProvider>
      <GameManagerProvider gameId={"game-123"}>
        <FightProvider>
          {/* <Fight /> */}
          <BattleGround />
          <GamePhaseControls />
          <Leva collapsed />
        </FightProvider>
      </GameManagerProvider>
    </SocketIOProvider>
  );
}

export default App;
