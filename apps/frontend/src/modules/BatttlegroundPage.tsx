import { Routes, Route, Navigate } from "react-router-dom";
import LobbyPage from "./matchmaking/LobbyPage";
import MatchmakingPage from "./matchmaking/MatchMakingPage";
import { BattleGround } from "./Batttleground";

export default function BattlegroundPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/matchmaking" replace />} />
      <Route path="/matchmaking" element={<MatchmakingPage />} />
      <Route path="/lobby/:id" element={<LobbyPage />} />
      <Route path="/lobby/:id/game" element={<BattleGround />} />
    </Routes>
  );
}
