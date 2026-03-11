/** Suit categories for Mahjong tiles */
export type TileSuit =
  | 'bamboo' | 'circle' | 'character'  // 3 suits × 9 ranks = 27 types
  | 'wind'                              // 4 types
  | 'dragon'                            // 3 types
  | 'flower'                            // 4 unique (but match any flower)
  | 'season';                           // 4 unique (but match any season)

export interface TileType {
  suit: TileSuit;
  rank: number;        // 1-9 for suits, 1-4 for winds, 1-3 for dragons, 1-4 for flower/season
  label: string;       // Display label
  matchGroup: string;  // Tiles with same matchGroup can be matched
}

/** A tile placed on the board */
export interface Tile {
  id: number;
  type: TileType;
  col: number;   // x position in grid
  row: number;   // y position in grid
  layer: number; // z position (0 = bottom)
}

/** A position in a layout (before tiles are assigned) */
export interface LayoutCell {
  col: number;
  row: number;
  layer: number;
}

export interface Layout {
  name: string;
  cells: LayoutCell[];
}

/** A matched pair, stored for undo */
export interface Move {
  tile1: Tile;
  tile2: Tile;
}

export type GameState = 'playing' | 'won' | 'lost';
