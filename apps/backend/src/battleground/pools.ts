import { randomUUID } from 'crypto';
import { Minion, MinionId } from './battleground';

interface PoolConfig {
  config: {
    tier: number;
    count: number;
  }[];
}

const basicPoolConfig: PoolConfig = {
  config: [
    {
      tier: 1,
      count: 12,
    },
    {
      tier: 2,
      count: 10,
    },
    {
      tier: 3,
      count: 8,
    },
    {
      tier: 4,
      count: 6,
    },
    {
      tier: 5,
      count: 3,
    },
  ],
};

interface Pool {
  init(poolConfig: PoolConfig): void;
  registerMinion(minion: Minion): void;
  unregisterMinion(minionId: MinionId): void;
  getRandomMinionsForTier(tier: number, count: number): Minion[];
}

function createPool(): Pool {
  const minions = new Map<MinionId, Minion>();
  const minionsPool: Minion[] = [];

  function registerMinion(minion: Minion): void {
    if (minions.has(minion.id)) {
      throw new Error('Minion already registered');
    }
    minions.set(minion.id, minion);
  }

  function unregisterMinion(minionId: MinionId): void {
    if (!minions.has(minionId)) {
      throw new Error('Minion not registered');
    }
    minions.delete(minionId);
  }

  function addMinionToPool(minion: Minion, count: number): void {
    for (let i = 0; i < count; i++) {
      minionsPool.push({ ...minion, id: randomUUID() });
    }
  }

  function init(poolConfig: PoolConfig): void {
    for (const minion of minions.values()) {
      const config = poolConfig.config.find((c) => c.tier === minion.tier);

      if (config != null) {
        addMinionToPool(minion, config.count);
      }
    }
  }

  function getRandomMinionsForTier(tier: number, count: number): Minion[] {
    const pool = minionsPool.filter((m) => m.tier <= tier);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  return {
    init,
    registerMinion,
    unregisterMinion,
    getRandomMinionsForTier,
  };
}

export const pool = createPool();

pool.registerMinion({
  id: 'm1',
  name: 'Alleycat',
  tier: 1,
  stats: { attack: 1, health: 1 },
});
pool.registerMinion({
  id: 'm2',
  name: 'Murloc Tidehunter',
  tier: 1,
  stats: { attack: 2, health: 1 },
});
pool.registerMinion({
  id: 'm3',
  name: 'Cool',
  tier: 1,
  stats: { attack: 1, health: 1 },
});
pool.registerMinion({
  id: 'm4',
  name: 'Mdr',
  tier: 1,
  stats: { attack: 1, health: 1 },
});
pool.registerMinion({
  id: 'm5',
  name: 'gglfdoi',
  tier: 1,
  stats: { attack: 1, health: 1 },
});
pool.registerMinion({
  id: 'm6',
  name: 'Kaboom Bot',
  tier: 2,
  stats: { attack: 2, health: 2 },
});
pool.registerMinion({
  id: 'm7',
  name: 'Cobalt Guardian',
  tier: 3,
  stats: { attack: 6, health: 3 },
});

pool.init(basicPoolConfig);
