import { useState } from "react";

export type Minion = {
  id: number;
  name: string;
  attack: number;
  health: number;
};

const initialTavern: Minion[] = [
  { id: 1, name: "Rat", attack: 1, health: 1 },
  { id: 2, name: "Murloc", attack: 2, health: 2 },
  { id: 3, name: "Mech", attack: 3, health: 1 },
];

export default function BattleGround() {
  const [tavern, setTavern] = useState<Minion[]>(initialTavern);
  const [board, setBoard] = useState<Minion[]>([]);
  const [gold, setGold] = useState<number>(3);

  const buyMinion = (minion: Minion) => {
    if (gold < 3) return;
    setBoard([...board, minion]);
    setTavern(tavern.filter((m) => m.id !== minion.id));
    setGold(gold - 3);
  };

  const refreshTavern = () => {
    if (gold < 1) return;
    setTavern([
      { id: Date.now(), name: "New Minion", attack: 2, health: 3 },
      { id: Date.now() + 1, name: "Goblin", attack: 1, health: 4 },
      { id: Date.now() + 2, name: "Imp", attack: 3, health: 2 },
    ]);
    setGold(gold - 1);
  };

  return (
    <div className="p-4 font-mono bg-green-100 min-h-screen">
      <p className="mb-4">Or : {gold}</p>
      <Tavern tavern={tavern} onBuy={buyMinion} onRefresh={refreshTavern} />
      <Board board={board} />
    </div>
  );
}

type MinionCardProps = {
  minion: Minion;
  onClick?: () => void;
};

export function MinionCard({ minion, onClick }: MinionCardProps) {
  return (
    <div
      className="border rounded p-2 shadow-md w-32 text-center bg-white cursor-pointer hover:bg-yellow-100"
      onClick={onClick}
    >
      <h2 className="font-bold">{minion.name}</h2>
      <p>
        ⚔️ {minion.attack} / ❤️ {minion.health}
      </p>
    </div>
  );
}

type TavernProps = {
  tavern: Minion[];
  onBuy: (minion: Minion) => void;
  onRefresh: () => void;
};

export function Tavern({ tavern, onBuy, onRefresh }: TavernProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Taverne</h2>
      <div className="flex gap-4 mb-2">
        {tavern.map((minion) => (
          <MinionCard
            key={minion.id}
            minion={minion}
            onClick={() => onBuy(minion)}
          />
        ))}
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onRefresh}
      >
        Rafraîchir la taverne (-1 or)
      </button>
    </div>
  );
}

type BoardProps = {
  board: Minion[];
};

export function Board({ board }: BoardProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Ton Plateau</h2>
      <div className="relative h-40 w-full bg-gray-200 rounded p-2 overflow-visible">
        {board.map((minion, index) => {
          const total = board.length;
          const maxWidth = 500; // pixels
          const spacing = total > 1 ? Math.min(maxWidth / (total - 1), 100) : 0;
          const left = index * spacing;
          return (
            <div className="relative" key={minion.id}>
              <div
                key={minion.id}
                className="absolute transition-all duration-300"
                style={{
                  left: `${left}px`,
                  bottom: "0",
                  zIndex: index,
                }}
              >
                <MinionCard key={minion.id} minion={minion} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
