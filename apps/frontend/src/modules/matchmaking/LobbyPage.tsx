import { use, useEffect } from "react";
import { useMatchmaking } from "./MatchMakingProvider";
import { useNavigate, useParams } from "react-router-dom";
import type { Player } from "../battleground";

export default function LobbyPage() {
  const { state, startGame, joinLobby } = useMatchmaking();
  const navigate = useNavigate();

  const lobbyId = useParams().id;

  useEffect(() => {
    if (lobbyId == null) return;

    joinLobby(lobbyId);
  }, [lobbyId]);

  const isHost = true;
  const players = state.lobbyPlayers || [];

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">
        Lobby ID: <span className="font-mono">{lobbyId}</span>
      </h1>

      <h2 className="text-lg font-semibold mb-2">Joueurs dans le lobby :</h2>
      <ul className="list-disc pl-5 mb-4">
        {players.map((id) => (
          <li key={id} className="text-gray-700">
            {id === state.playerId ? `${id} (vous)` : id}
          </li>
        ))}
      </ul>

      {isHost && (
        <button
          className="btn bg-green-500 hover:bg-green-600 text-white w-full"
          onClick={startGame}
        >
          Démarrer la partie
        </button>
      )}
    </div>
  );
}
