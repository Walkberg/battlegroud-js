import { GameState, Minion, MinionId, Player } from './battleground';
import { Battleground } from './battleground-game';

const SELL_PRICE = 1;
const BUY_PRICE = 3;

const MAX_HAND_SIZE = 10;
const MAX_BOARD_SIZE = 7;
const MAX_SHOP_SIZE = 5;

export interface IPlayerEntity {
  buyMinion: (minion: MinionId) => void;
  sellMinion: (minion: MinionId) => void;
  playMinion: (minion: MinionId) => void;
  upgradeShop: () => void;
  rerollShop: () => void;
  freezeShop: () => void;
}

export class PlayerEntity implements IPlayerEntity {
  constructor(
    public readonly id: string,
    private player: Player,
    private game: Battleground,
  ) {}

  buyMinion(minionId: MinionId): void {
    const minion = this.findMinionInShop(minionId);

    if (!minion || !this.hasGold(BUY_PRICE) || this.isHandFull()) {
      return;
    }

    this.removeGold(BUY_PRICE);
    this.addMinionToHand(minion);
    this.removeMinionInShop(minion.id);
  }

  sellMinion(minionId: MinionId): void {
    const minion = this.findMinionInBoard(minionId);

    if (minion == null) {
      return;
    }

    this.player.gold += SELL_PRICE;
    this.removeMinionInBoard(minion.id);
  }

  playMinion(minion: MinionId): void {
    const minionToPlay = this.findMinionInHand(minion);

    if (minionToPlay == null || this.isBoardFull()) {
      return;
    }

    this.addMinionToBoard(minionToPlay);
    this.removeMinionInHand(minionToPlay.id);
  }

  upgradeShop(): void {
    if (this.hasGold(this.player.shop.upgradeCost)) {
      this.player.shop.tier++;
      this.removeGold(this.player.shop.upgradeCost);
    }
  }

  rerollShop(): void {
    if (!this.hasGold(this.player.shop.rerollCost)) {
      return;
    }
    this.player.shop.minions = this.game.pool.getRandomMinionsForTier(
      this.player.shop.tier,
      5,
    );
    this.removeGold(this.player.shop.rerollCost);
  }

  findMinionInShop(minionId: MinionId) {
    return this.player.shop.minions.find((m) => m.id === minionId);
  }

  removeMinionInHand(minionId: MinionId) {
    const minion = this.findMinionInHand(minionId);
    if (minion) {
      this.player.hand = this.player.hand.filter((m) => m.id !== minionId);
    }
  }

  addMinionToHand(minion: Minion): void {
    if (this.player.hand.length < MAX_HAND_SIZE) {
      this.player.hand.push(minion);
    }
  }

  addMinionToBoard(minion: Minion): void {
    if (this.player.board.length < MAX_BOARD_SIZE) {
      this.player.board.push(minion);
    }
  }

  addMinionToShop(minion: Minion): void {
    if (this.player.shop.minions.length < MAX_SHOP_SIZE) {
      this.player.shop.minions.push(minion);
    }
  }

  findMinionInBoard(minionId: MinionId) {
    return this.player.board.find((m) => m.id === minionId);
  }

  removeMinionInBoard(minionId: MinionId) {
    const minion = this.findMinionInBoard(minionId);
    if (minion) {
      this.player.board = this.player.board.filter((m) => m.id !== minionId);
    }
  }

  isHandFull(): boolean {
    return this.player.hand.length >= MAX_HAND_SIZE;
  }

  isBoardFull(): boolean {
    return this.player.board.length >= MAX_BOARD_SIZE;
  }

  isShopFull(): boolean {
    return this.player.shop.minions.length >= MAX_SHOP_SIZE;
  }

  removeMinionInShop(minionId: MinionId) {
    const minion = this.findMinionInShop(minionId);

    if (minion) {
      this.player.shop.minions = this.player.shop.minions.filter(
        (m) => m.id !== minionId,
      );
    }
  }

  findMinionInHand(minionId: MinionId): Minion | undefined {
    return this.player.hand.find((m) => m.id === minionId);
  }

  freezeShop(): void {
    this.player.shop.frozen = this.player.shop.frozen ? false : true;
  }

  hasGold(amount: number): boolean {
    return this.player.gold >= amount;
  }

  addGold(amount: number): void {
    this.player.gold += amount;
  }

  removeGold(amount: number): void {
    if (this.player.gold >= amount) {
      this.player.gold -= amount;
    }
  }

  getPlayer(): Player {
    return this.player;
  }
}
