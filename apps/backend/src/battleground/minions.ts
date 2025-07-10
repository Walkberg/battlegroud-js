import { randomUUID } from 'crypto';
import { Minion } from './battleground';

const test0 = {
  id: 'm1',
  name: 'Alleycat',
  tier: 1,
  stats: { attack: 1, health: 1 },
  onPlayEffect: (game, playerId, minionId) => {
    const player = game.players.find((p) => p.id === playerId);
    if (player) {
      player.gold += 10;
    }
  },
};

const test1 = {
  id: 'm2',
  name: 'Murloc Tidehunter',
  tier: 1,
  stats: { attack: 2, health: 1 },
  onPlayEffect: (game, playerId, minionId) => {
    const player = game.players.find((p) => p.id === playerId);
    if (player != null && player?.board.length < 7) {
      player.board.push(
        summonCopy(player.board.find((m) => m.id === minionId)!),
      );
    }
  },
};

const test2 = {
  id: 'm3',
  name: 'Cool',
  tier: 1,
  stats: { attack: 1, health: 1 },
  onPlayEffect: (game, playerId, minionId) =>
    addCardToHand(game, playerId, test0),
};

const test3 = {
  id: 'm4',
  name: 'Mdr',
  tier: 1,
  stats: { attack: 1, health: 1 },
};

const test4 = {
  id: 'm5',
  name: 'gglfdoi',
  tier: 1,
  stats: { attack: 1, health: 1 },
};

const test5 = {
  id: 'm6',
  name: 'Kaboom Bot',
  tier: 2,
  stats: { attack: 2, health: 2 },
};

const test6 = {
  id: 'm7',
  name: 'Cobalt Guardian',
  tier: 3,
  stats: { attack: 6, health: 3 },
};

function summonCopy(minion: Minion): Minion {
  return { ...minion, id: randomUUID() };
}

function addCardToHand(game, playerId, minion) {
  const player = game.players.find((p) => p.id === playerId);
  const pool = game.pool;
  if (player) {
    player.hand.push(pool.getRandomMinionsForTier(minion.tier, 1)[0]);
  }
}

export const allMinions = [test0, test1, test2, test3, test4, test5, test6];
