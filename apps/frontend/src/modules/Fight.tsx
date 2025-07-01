import { createContext, useContext, useState, type ReactNode } from "react";
import { Board, type Minion } from "./Batttleground";

export default function Fight() {
  const { opponentBoard, userBoard } = useFight();

  return (
    <div className="p-4 font-mono bg-green-100 min-h-screen">
      <Board board={opponentBoard} />
      <Board board={userBoard} />
    </div>
  );
}

type FightContextType = {
  userBoard: Minion[];
  opponentBoard: Minion[];
  setUserBoard: (minions: Minion[]) => void;
  setOpponentBoard: (minions: Minion[]) => void;
};

const FightContext = createContext<FightContextType | undefined>(undefined);

const initialTavern: Minion[] = [
  { id: 1, name: "Rat", attack: 1, health: 1 },
  { id: 2, name: "Murloc", attack: 2, health: 2 },
  { id: 3, name: "Mech", attack: 3, health: 1 },
];

export function FightProvider({ children }: { children: ReactNode }) {
  const [userBoard, setUserBoard] = useState<Minion[]>(initialTavern);
  const [opponentBoard, setOpponentBoard] = useState<Minion[]>(initialTavern);

  return (
    <FightContext.Provider
      value={{ userBoard, opponentBoard, setUserBoard, setOpponentBoard }}
    >
      {children}
    </FightContext.Provider>
  );
}

export function useFight() {
  const context = useContext(FightContext);
  if (!context) throw new Error("useFight must be used within a FightProvider");
  return context;
}
