import { MinionCard } from "../Minion";
import { usePlayer } from "../PlayerProvider";

export function BattleGroundPlayer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-yellow-200 text-white font-mono flex flex-col justify-between p-4">
      <div className="flex justify-center">
        <PlayerTavern />
      </div>
      <div className="flex justify-center mt-6">
        <PlayerBoard />
      </div>
      <div className="flex justify-between items-center mt-4 px-8">
        <PlayerHero />
        <PlayerEconomy />
      </div>
      <div className="flex justify-center mt-6">
        <PlayerHand />
      </div>
    </div>
  );
}

export const PlayerEconomy = () => {
  const { player } = usePlayer();
  if (!player) return null;

  const maxGold = 10;

  return (
    <div className="flex items-center gap-1 text-yellow-300 text-2xl">
      <div className="ml-2 text-white text-sm">
        {player.gold}/{maxGold}
      </div>
      {Array.from({ length: maxGold }).map((_, i) => (
        <span key={i}>{i < player.gold ? "💰" : "⚪"}</span>
      ))}
    </div>
  );
};

type PlayerTavernProps = {};

export function PlayerTavern({}: PlayerTavernProps) {
  const { rerollShop, player, upgradeTavern, buyMinion, freezeTavern } =
    usePlayer();
  if (!player) return null;

  const tavern = player.shop.minions;
  const tier = player.tavernTier;
  const rerollCost = player.shop.rerollCost;
  const upgradeCost = player.shop.upgradeCost;

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="bg-[#3d2c29] p-6 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <HexButton
            label={`⬆️ Tier ${tier}`}
            onClick={upgradeTavern}
            price={upgradeCost}
            disabled={player.gold < upgradeCost}
          />
          <h2 className="text-3xl font-bold text-white">Taverne de Bob</h2>
          <div className="flex gap-4">
            <HexButton
              label="🔁 Reroll"
              onClick={rerollShop}
              price={rerollCost}
              disabled={player.gold < 1}
            />

            <HexButton label="❄️ Freeze" onClick={freezeTavern} price={0} />
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        {tavern.map((minion) => (
          <MinionCard
            key={minion.id}
            minion={minion}
            onClick={() => buyMinion(minion.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function PlayerBoard() {
  const { player, sellMinion } = usePlayer();

  if (player == null) {
    return null;
  }

  const board = player.board;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Ton Plateau</h2>
      <div className="relative h-40 w-full bg-gray-200 rounded p-2 overflow-visible">
        {board.map((minion, index) => {
          const total = board.length;
          const maxWidth = 500;
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
                <MinionCard
                  key={minion.id}
                  minion={minion}
                  onClick={() => sellMinion(minion.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlayerHand() {
  const { player, playMinion } = usePlayer();

  if (player == null) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Ton Plateau</h2>
      <div className="relative h-40 w-full bg-gray-200 rounded p-2 overflow-visible">
        {player.hand.map((minion, index) => {
          const total = player.hand.length;
          const maxWidth = 500;
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
                <MinionCard
                  key={minion.id}
                  minion={minion}
                  onClick={() => playMinion(minion.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const PlayerHero = () => {
  const { player } = usePlayer();
  if (player == null) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Ton Héros</h2>
      <div className="border rounded p-4 shadow-md bg-white">
        <h3 className="font-bold">{player.hero.name}</h3>
        <p>Vie: {player.health}</p>
      </div>
    </div>
  );
};

type HexButtonProps = {
  label: string;
  price?: number;
  onClick: () => void;
  disabled?: boolean;
};

export const HexButton = ({
  label,
  price,
  onClick,
  disabled = false,
}: HexButtonProps) => {
  return (
    <div className="flex flex-col items-center group">
      {price !== undefined && (
        <div className="mb-2 w-8 h-8 rounded-full bg-yellow-400 text-black text-sm font-bold flex items-center justify-center shadow-md">
          {price}
        </div>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative w-32 h-14 text-white font-bold text-sm 
          bg-green-600 
          [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)] 
          hover:border-2 hover:border-green-300 
          transition-all duration-200 ease-in-out 
          ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "group-hover:scale-105"
          }
        `}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          {label}
        </span>
      </button>
    </div>
  );
};
