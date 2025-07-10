import { randomUUID } from 'crypto';
import { Minion, MinionId } from './battleground';
import { allMinions } from './minions';

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

export interface Pool {
  init(poolConfig: PoolConfig): void;
  registerMinion(minion: Minion): void;
  registerMinions(minions: Minion[]): void;
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

  function registerMinions(minionsToRegister: Minion[]): void {
    for (const minion of minionsToRegister) {
      registerMinion(minion);
    }
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
    registerMinions,
    unregisterMinion,
    getRandomMinionsForTier,
  };
}

export const pool = createPool();

pool.registerMinions(allMinions);

pool.init(basicPoolConfig);
