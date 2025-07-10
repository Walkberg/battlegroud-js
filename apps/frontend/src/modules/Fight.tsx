import { createContext, useContext, useState, type ReactNode } from "react";
import type { Minion } from "./battleground";

export default function Fight() {
  const {} = useFight();

  return (
    <div className="p-4 font-mono bg-green-100 min-h-screen">
      {/* <Board board={opponentBoard} />
      <Board board={userBoard} /> */}
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

export function FightProvider({ children }: { children: ReactNode }) {
  const [userBoard, setUserBoard] = useState<Minion[]>([]);
  const [opponentBoard, setOpponentBoard] = useState<Minion[]>([]);

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
