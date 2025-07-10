import { useGameManager } from "./BattleGroundProvider";
import { BattleGroundPlayer } from "./player-board/PlayerBoard";

export const BattleGround = () => {
  const game = useGameManager();

  return (
    <div className="flex min-h-screen min-w-screen">
      <Opponents />
      <main className="flex-1">
        <BattleGroundPlayer />
      </main>
    </div>
  );
};

function Opponents() {
  const game = useGameManager();

  const opponents = game.players.sort((a, b) => b.health - a.health);

  return (
    <aside className="w-48 bg-gray-100 p-4 border-r border-gray-300 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Adversaires</h2>
      {opponents.map((opponent) => (
        <button
          key={opponent.id}
          className="bg-white p-2 rounded shadow text-sm flex flex-col items-center"
        >
          <div className="font-bold">{opponent.hero.name}</div>
          <div>❤️ {opponent.health}</div>
          <div>⭐ Tier {opponent.tavernTier}</div>
        </button>
      ))}
    </aside>
  );
}
