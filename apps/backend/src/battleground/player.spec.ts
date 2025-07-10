import { Minion, Player } from './battleground';
import { Battleground } from './battleground-game';
import { PlayerEntity } from './player';

const createFakeMinion = (id: string): Minion => ({
  id,
  name: `Minion-${id}`,
  tier: 1,
  stats: { attack: 2, health: 2 },
});

const createFakePlayer = (): Player => ({
  id: 'player1',
  name: 'TestPlayer',
  hero: { id: 'hero1', name: 'TestHero', ability: 'none' },
  health: 30,
  board: [],
  hand: [],
  shop: {
    rerollCost: 1,
    upgradeCost: 5,
    tier: 1,
    minions: [],
    frozen: false,
  },
  gold: 10,
  tavernTier: 1,
  triples: 0,
  isDead: false,
});

const createMockGame = (): Battleground => {
  return {
    pool: {
      getRandomMinionsForTier: jest
        .fn()
        .mockReturnValue([createFakeMinion('m1'), createFakeMinion('m2')]),
    },
  } as unknown as Battleground;
};

describe('PlayerEntity', () => {
  let player: Player;
  let game: Battleground;
  let entity: PlayerEntity;

  beforeEach(() => {
    player = createFakePlayer();
    game = createMockGame();
    entity = new PlayerEntity(player.id, player, game);
  });

  it('should buy a minion', () => {
    const minion = createFakeMinion('minion1');
    player.shop.minions.push(minion);

    entity.buyMinion(minion.id);

    expect(player.hand).toContainEqual(minion);
    expect(player.gold).toBe(7); // 10 - 3
    expect(player.shop.minions.length).toBe(0);
  });

  it('should not buy a minion without enough gold', () => {
    player.gold = 2;
    const minion = createFakeMinion('minion1');
    player.shop.minions.push(minion);

    entity.buyMinion(minion.id);

    expect(player.hand.length).toBe(0);
    expect(player.gold).toBe(2);
  });

  it('should not buy a minion without empty space in hand', () => {
    player.gold = 10;

    for (let i = 0; i < 10; i++) {
      player.hand.push(createFakeMinion(`minion${i}`));
    }
    const minion11 = createFakeMinion('minion11');

    player.shop.minions.push(minion11);

    entity.buyMinion(minion11.id);

    expect(player.hand.length).toBe(10);
    expect(player.gold).toBe(10);
  });

  it('should sell a minion and gain gold', () => {
    const minion = createFakeMinion('minion2');
    player.board.push(minion);

    entity.sellMinion(minion.id);

    expect(player.gold).toBe(11); // 10 + 1
    expect(player.board.length).toBe(0);
  });

  it('should play a minion from hand to board', () => {
    const minion = createFakeMinion('minion3');
    player.hand.push(minion);

    entity.playMinion(minion.id);

    expect(player.board).toContainEqual(minion);
    expect(player.hand.length).toBe(0);
  });

  it('should not play a minion from hand to board if board is full', () => {
    const minion = createFakeMinion('fakeMinion');
    player.hand.push(minion);

    for (let i = 0; i < 7; i++) {
      player.board.push(createFakeMinion(`minion${i}`));
    }

    entity.playMinion(minion.id);

    expect(player.board).not.toContainEqual(minion);
    expect(player.hand.length).toBe(1);
  });

  it('should reroll shop if enough gold', () => {
    entity.rerollShop();

    expect(player.gold).toBe(9); // 10 - 1
    expect(player.shop.minions.length).toBeGreaterThan(0);
  });

  it('should freeze and unfreeze the shop', () => {
    expect(player.shop.frozen).toBe(false);
    entity.freezeShop();
    expect(player.shop.frozen).toBe(true);
    entity.freezeShop();
    expect(player.shop.frozen).toBe(false);
  });

  it('should upgrade the shop if enough gold', () => {
    entity.upgradeShop();

    expect(player.gold).toBe(5); // 10 - 5
    expect(player.shop.tier).toBe(2);
  });

  it('should not upgrade shop if not enough gold', () => {
    player.gold = 2;
    entity.upgradeShop();

    expect(player.shop.tier).toBe(1);
    expect(player.gold).toBe(2);
  });
});
