import type { Layout, TileType } from './Types.ts';
import { generateFullSet, generateMiniSet } from './TileSet.ts';
import { Board } from './Board.ts';

/**
 * Generate a solvable board by building it in reverse:
 * 1. Start with all positions filled (dummy tiles)
 * 2. Repeatedly pick a random pair of free tiles and remove them
 * 3. Record the removal order — this IS the solution path
 * 4. Assign matching tile types to each pair
 *
 * Guarantees the board is always solvable.
 */
export function generateSolvableBoard(layout: Layout): TileType[] {
  const cellCount = layout.cells.length;
  if (cellCount % 2 !== 0) {
    throw new Error(`Layout has odd number of cells: ${cellCount}`);
  }

  const isSmall = cellCount <= 36;
  const tileTypes = isSmall ? generateMiniSet() : generateFullSet();
  if (tileTypes.length !== cellCount) {
    throw new Error(`Tile set size (${tileTypes.length}) doesn't match layout (${cellCount})`);
  }

  // Build pair type list: group tile types into matchable pairs
  const pairTypes = buildPairTypes(tileTypes);
  shuffleArray(pairTypes);

  // Reverse-solve to find which cells form pairs
  const pairAssignment = reverseSolve(layout);

  // Assign tile types: each pair index maps to a pair of TileTypes
  const result: TileType[] = new Array(cellCount);
  for (let i = 0; i < cellCount; i++) {
    const pairIdx = pairAssignment[i];
    result[i] = pairTypes[pairIdx];
  }

  return result;
}

/**
 * Group tile types into pairs.
 * Returns an array of cellCount/2 TileTypes — one per pair.
 * Both cells in a pair get the same TileType (same matchGroup).
 */
function buildPairTypes(tileTypes: TileType[]): TileType[] {
  const groups = new Map<string, TileType[]>();
  for (const t of tileTypes) {
    if (!groups.has(t.matchGroup)) {
      groups.set(t.matchGroup, []);
    }
    groups.get(t.matchGroup)!.push(t);
  }

  const pairs: TileType[] = [];
  for (const [, tiles] of groups) {
    // Each group has 2 or 4 tiles → 1 or 2 pairs
    for (let i = 0; i < tiles.length; i += 2) {
      pairs.push(tiles[i]); // One type per pair
    }
  }

  return pairs; // cellCount / 2 entries
}

/**
 * Reverse-solve: simulate removing pairs of free tiles from a full layout.
 * Returns an array mapping cell index → pair index (0 to cellCount/2 - 1).
 */
function reverseSolve(layout: Layout): number[] {
  const cells = layout.cells;
  const count = cells.length;

  // Create a temp board with dummy tiles
  const tempBoard = new Board();
  const dummyTypes: TileType[] = cells.map(() => ({
    suit: 'bamboo', rank: 1, label: 'X', matchGroup: 'dummy',
  }));
  tempBoard.init(layout, dummyTypes);

  const assignment = new Array<number>(count).fill(-1);
  let pairIndex = 0;
  let attempts = 0;
  const maxAttempts = count * 200;

  while (tempBoard.tiles.length > 0) {
    attempts++;
    if (attempts > maxAttempts) {
      // Restart on deadlock (shouldn't happen with well-formed layouts)
      return reverseSolve(layout);
    }

    const freeTiles = tempBoard.getFreeTiles();
    if (freeTiles.length < 2) {
      return reverseSolve(layout);
    }

    // Pick two random free tiles
    shuffleArray(freeTiles);
    const t1 = freeTiles[0];
    const t2 = freeTiles[1];

    // Remove them
    tempBoard.tiles = tempBoard.tiles.filter(t => t.id !== t1.id && t.id !== t2.id);

    // Record pair
    assignment[t1.id] = pairIndex;
    assignment[t2.id] = pairIndex;
    pairIndex++;
  }

  return assignment;
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Verify solvability using the known solution path.
 * Uses backtracking DFS — slower but correct.
 */
export function isBoardSolvable(board: Board): boolean {
  return dfsSolve([...board.tiles.map(t => ({ ...t }))], board);
}

function dfsSolve(tiles: typeof Board.prototype.tiles, originalBoard: Board): boolean {
  if (tiles.length === 0) return true;

  // Build a temp board to use free-tile logic
  const tempBoard = new Board();
  tempBoard.tiles = tiles;

  const pairs = tempBoard.findMatchablePairs();
  if (pairs.length === 0) return false;

  for (const [a, b] of pairs) {
    const remaining = tiles.filter(t => t.id !== a.id && t.id !== b.id);
    if (dfsSolve(remaining, originalBoard)) return true;
  }

  return false;
}
