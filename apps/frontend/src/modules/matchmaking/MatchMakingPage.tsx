import { useMatchmaking } from "./MatchMakingProvider";

export default function MatchmakingPage() {
  const { createLobby, joinLobby, state } = useMatchmaking();

  const handleJoinLobby = () => {
    const id = prompt("Entrez l'identifiant du lobby:");
    if (id) joinLobby(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Matchmaking</h1>
      <p>
        Joueur ID: <span className="font-mono">{state.playerId}</span>
      </p>

      <button className="btn" onClick={createLobby}>
        Créer un lobby
      </button>

      <button className="btn" onClick={handleJoinLobby}>
        Rejoindre un lobby
      </button>
    </div>
  );
}
