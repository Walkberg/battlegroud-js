import "./App.css";
import { AppProviders } from "./components/providers/AppProviders";
import GamePhaseControls from "./modules/DevelopperGUI";
import { Leva } from "leva";
import BattlegroundPage from "./modules/BatttlegroundPage";

function App() {
  return (
    <AppProviders>
      <BattlegroundPage />
      <GamePhaseControls />
      <Leva collapsed />
    </AppProviders>
  );
}

export default App;
