import { useControls } from "leva";
import { useEffect } from "react";
import { useGameManager } from "./BattleGroundProvider";
import { GamePhase } from "./battleground";
import { useSocket } from "./socketIO/SocketIoProvider";

export default function GamePhaseControls() {
  const { socket } = useSocket();
  const { phase: gamePhase } = useGameManager();

  const { phase } = useControls("Phase de jeu", {
    phase: {
      options: [GamePhase.Recruitment, GamePhase.Combat, GamePhase.End],
      value: gamePhase,
    },
  });

  const handleChangePhase = (phase: GamePhase) => {
    if (!socket) return;
    socket.emit("nextPhase", { phase });
  };

  useEffect(() => {
    if (phase !== gamePhase) {
      handleChangePhase(phase);
    }
  }, [phase]);

  return null;
}
