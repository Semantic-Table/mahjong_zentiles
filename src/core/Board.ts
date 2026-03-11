import type { Tile, TileType, Layout, Move, GameState } from './Types.ts';

export class Board {
  tiles: Tile[] = [];
  moves: Move[] = [];
  shufflesRemaining = 3;
  state: GameState = 'playing';

  /** Initialize board from a layout and an ordered list of tile types */
  init(layout: Layout, tileTypes: TileType[]): void {
    if (tileTypes.length !== layout.cells.length) {
      throw new Error(`Tile count (${tileTypes.length}) doesn't match layout cells (${layout.cells.length})`);
    }

    this.tiles = layout.cells.map((cell, i) => ({
      id: i,
      type: tileTypes[i],
      col: cell.col,
      row: cell.row,
      layer: cell.layer,
    }));
    this.moves = [];
    this.shufflesRemaining = 3;
    this.state = 'playing';
  }

  /** Check if a tile is free (playable) */
  isFree(tile: Tile): boolean {
    // Must not be covered by any tile on a higher layer
    if (this.isCovered(tile)) return false;
    // Must be free on left OR right side
    return !this.hasNeighborLeft(tile) || !this.hasNeighborRight(tile);
  }

  /** Check if a tile is covered by any tile on a higher layer */
  private isCovered(tile: Tile): boolean {
    return this.tiles.some(other =>
      other.id !== tile.id &&
      other.layer === tile.layer + 1 &&
      Math.abs(other.col - tile.col) < 2 &&
      Math.abs(other.row - tile.row) < 2
    );
  }

  /** Check if there's a neighbor tile blocking the left side */
  private hasNeighborLeft(tile: Tile): boolean {
    return this.tiles.some(other =>
      other.id !== tile.id &&
      other.layer === tile.layer &&
      other.col === tile.col - 2 &&
      Math.abs(other.row - tile.row) < 2
    );
  }

  /** Check if there's a neighbor tile blocking the right side */
  private hasNeighborRight(tile: Tile): boolean {
    return this.tiles.some(other =>
      other.id !== tile.id &&
      other.layer === tile.layer &&
      other.col === tile.col + 2 &&
      Math.abs(other.row - tile.row) < 2
    );
  }

  /** Check if two tiles can be matched */
  canMatch(a: Tile, b: Tile): boolean {
    if (a.id === b.id) return false;
    if (a.type.matchGroup !== b.type.matchGroup) return false;
    return this.isFree(a) && this.isFree(b);
  }

  /** Remove a matched pair from the board */
  removePair(a: Tile, b: Tile): boolean {
    if (!this.canMatch(a, b)) return false;

    this.tiles = this.tiles.filter(t => t.id !== a.id && t.id !== b.id);
    this.moves.push({ tile1: a, tile2: b });

    this.updateState();
    return true;
  }

  /** Undo the last move */
  undo(): Move | null {
    const move = this.moves.pop();
    if (!move) return null;

    this.tiles.push(move.tile1, move.tile2);
    this.state = 'playing';
    return move;
  }

  /** Find all currently free tiles */
  getFreeTiles(): Tile[] {
    return this.tiles.filter(t => this.isFree(t));
  }

  /** Find all possible matching pairs among free tiles */
  findMatchablePairs(): [Tile, Tile][] {
    const free = this.getFreeTiles();
    const pairs: [Tile, Tile][] = [];

    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (free[i].type.matchGroup === free[j].type.matchGroup) {
          pairs.push([free[i], free[j]]);
        }
      }
    }

    return pairs;
  }

  /** Get a hint — returns a matchable pair or null */
  getHint(): [Tile, Tile] | null {
    const pairs = this.findMatchablePairs();
    return pairs.length > 0 ? pairs[0] : null;
  }

  /** Shuffle remaining tiles (keeps positions, reassigns types) */
  shuffle(): boolean {
    if (this.shufflesRemaining <= 0) return false;
    this.shufflesRemaining--;

    // Collect current types and positions
    const types = this.tiles.map(t => t.type);

    // Fisher-Yates shuffle on types
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    // Reassign types to tiles
    this.tiles.forEach((tile, i) => {
      tile.type = types[i];
    });

    this.updateState();
    return true;
  }

  /** Update game state after a move or shuffle */
  private updateState(): void {
    if (this.tiles.length === 0) {
      this.state = 'won';
    } else if (this.findMatchablePairs().length === 0) {
      this.state = 'lost';
    }
  }

  /** Get tiles by layer for rendering order */
  getTilesByLayer(): Map<number, Tile[]> {
    const layers = new Map<number, Tile[]>();
    for (const tile of this.tiles) {
      if (!layers.has(tile.layer)) {
        layers.set(tile.layer, []);
      }
      layers.get(tile.layer)!.push(tile);
    }
    return layers;
  }
}
