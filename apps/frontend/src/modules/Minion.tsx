import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Minion, MinionId } from "./battleground";
import { motion } from "framer-motion";

const CardAnimationContext = createContext<{
  registerCard: (id: string, handler: PlayEvent) => void;
  unregisterCard: (id: string) => void;
  playEventForCard: (id: string, event: CombatEvent) => Promise<void>;
}>({
  registerCard: () => {},
  unregisterCard: () => {},
  playEventForCard: () => Promise.resolve(),
});

type PlayEvent = (event: CombatEvent) => Promise<void>;

type CombatEvent = string;

export const MinionAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cardHandlers = useRef<Map<string, PlayEvent>>(new Map());

  const registerCard = (id: string, handler: PlayEvent) => {
    cardHandlers.current.set(id, handler);
  };

  const unregisterCard = (id: string) => {
    cardHandlers.current.delete(id);
  };

  const playEventForCard = async (id: string, event: CombatEvent) => {
    const handler = cardHandlers.current.get(id);
    if (handler) {
      await handler(event);
    }
  };

  return (
    <CardAnimationContext.Provider
      value={{ registerCard, unregisterCard, playEventForCard }}
    >
      {children}
    </CardAnimationContext.Provider>
  );
};

export function useCardAnimation() {
  const context = useContext(CardAnimationContext);

  if (!context) {
    throw new Error(
      "useCardAnimation must be used within a CardAnimationProvider"
    );
  }

  return context;
}

export const MinionAnimation = ({
  id,
  children,
}: {
  id: MinionId;
  children: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { registerCard, unregisterCard } = useCardAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEvent: PlayEvent = async (event) => {
      switch (event) {
        case "attack":
          setIsAnimating(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          setIsAnimating(false);
          break;
      }
    };

    registerCard(id, handleEvent);
    return () => {
      unregisterCard(id);
    };
  }, [id]);

  return (
    <div ref={cardRef}>
      <motion.div
        animate={isAnimating ? { scale: 1.3 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

type MinionCardProps = {
  minion: Minion;
  onClick?: () => void;
};

export function MinionCard({ minion, onClick }: MinionCardProps) {
  const { playEventForCard } = useCardAnimation();
  () => playEventForCard(minion.id, "attack");
  return (
    <MinionAnimation id={minion.id}>
      <div
        className="border rounded p-2 shadow-md w-32 text-center bg-white cursor-pointer hover:bg-yellow-100 h-64"
        onClick={onClick}
      >
        <h2 className="font-bold text-teal-400">{minion.name}</h2>

        <p className="text-teal-700">
          ⚔️ {minion.stats.attack} / ❤️ {minion.stats.health}
        </p>
      </div>
    </MinionAnimation>
  );
}
