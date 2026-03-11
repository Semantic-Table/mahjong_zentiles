import { Board } from './Board.ts';
import { LAYOUTS } from './Layouts.ts';
import { generateSolvableBoard } from './Solver.ts';
import type { Tile, Move, GameState } from './Types.ts';

export type GameEvent =
  | { type: 'select'; tile: Tile }
  | { type: 'deselect' }
  | { type: 'match'; tile1: Tile; tile2: Tile }
  | { type: 'no-match'; tile1: Tile; tile2: Tile }
  | { type: 'undo'; move: Move }
  | { type: 'hint'; tile1: Tile; tile2: Tile }
  | { type: 'shuffle' }
  | { type: 'state-change'; state: GameState }
  | { type: 'combo'; count: number };

type EventHandler = (event: GameEvent) => void;

export class Game {
  board = new Board();
  selectedTile: Tile | null = null;
  private listeners: EventHandler[] = [];
  private lastMatchTime = 0;
  private comboCount = 0;
  private readonly COMBO_WINDOW = 3000; // ms to keep combo alive

  on(handler: EventHandler): void {
    this.listeners.push(handler);
  }

  private emit(event: GameEvent): void {
    for (const handler of this.listeners) {
      handler(event);
    }
  }

  /** Start a new game with the given layout */
  startGame(layoutName: string): void {
    const layout = LAYOUTS[layoutName];
    if (!layout) throw new Error(`Unknown layout: ${layoutName}`);

    const tileTypes = generateSolvableBoard(layout);
    this.board.init(layout, tileTypes);
    this.selectedTile = null;
    this.comboCount = 0;
    this.emit({ type: 'state-change', state: 'playing' });
  }

  /** Handle tile click */
  selectTile(tile: Tile): void {
    if (this.board.state !== 'playing') return;
    if (!this.board.isFree(tile)) return;

    if (this.selectedTile === null) {
      // First selection
      this.selectedTile = tile;
      this.emit({ type: 'select', tile });
    } else if (this.selectedTile.id === tile.id) {
      // Deselect
      this.selectedTile = null;
      this.emit({ type: 'deselect' });
    } else {
      // Try to match
      const first = this.selectedTile;
      this.selectedTile = null;

      if (this.board.canMatch(first, tile)) {
        this.board.removePair(first, tile);

        // Combo tracking
        const now = Date.now();
        if (now - this.lastMatchTime < this.COMBO_WINDOW) {
          this.comboCount++;
        } else {
          this.comboCount = 1;
        }
        this.lastMatchTime = now;

        this.emit({ type: 'match', tile1: first, tile2: tile });

        if (this.comboCount > 1) {
          this.emit({ type: 'combo', count: this.comboCount });
        }

        if (this.board.state !== 'playing') {
          this.emit({ type: 'state-change', state: this.board.state });
        }
      } else {
        this.emit({ type: 'no-match', tile1: first, tile2: tile });
      }
    }
  }

  /** Undo last move */
  undo(): void {
    const move = this.board.undo();
    if (move) {
      this.emit({ type: 'undo', move });
    }
  }

  /** Get a hint */
  hint(): void {
    const pair = this.board.getHint();
    if (pair) {
      this.emit({ type: 'hint', tile1: pair[0], tile2: pair[1] });
    }
  }

  /** Shuffle remaining tiles */
  shuffle(): void {
    if (this.board.shuffle()) {
      this.emit({ type: 'shuffle' });
      if (this.board.state !== 'playing') {
        this.emit({ type: 'state-change', state: this.board.state });
      }
    }
  }
}
