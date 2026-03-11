import type { TileType } from './Types.ts';

/** All 42 tile types in a standard Mahjong set */
function createTileTypes(): TileType[] {
  const types: TileType[] = [];

  // Bamboo 1-9 (4 copies each)
  for (let r = 1; r <= 9; r++) {
    types.push({ suit: 'bamboo', rank: r, label: `B${r}`, matchGroup: `bamboo-${r}` });
  }
  // Circle 1-9
  for (let r = 1; r <= 9; r++) {
    types.push({ suit: 'circle', rank: r, label: `C${r}`, matchGroup: `circle-${r}` });
  }
  // Character 1-9
  for (let r = 1; r <= 9; r++) {
    types.push({ suit: 'character', rank: r, label: `K${r}`, matchGroup: `character-${r}` });
  }

  // Winds: East, South, West, North
  const winds = ['East', 'South', 'West', 'North'];
  for (let i = 0; i < 4; i++) {
    types.push({ suit: 'wind', rank: i + 1, label: winds[i], matchGroup: `wind-${i + 1}` });
  }

  // Dragons: Red, Green, White
  const dragons = ['Red', 'Green', 'White'];
  for (let i = 0; i < 3; i++) {
    types.push({ suit: 'dragon', rank: i + 1, label: dragons[i], matchGroup: `dragon-${i + 1}` });
  }

  // Flowers (4 unique tiles, but any flower matches any flower)
  for (let i = 1; i <= 4; i++) {
    types.push({ suit: 'flower', rank: i, label: `F${i}`, matchGroup: 'flower' });
  }

  // Seasons (4 unique tiles, but any season matches any season)
  for (let i = 1; i <= 4; i++) {
    types.push({ suit: 'season', rank: i, label: `S${i}`, matchGroup: 'season' });
  }

  return types;
}

export const ALL_TILE_TYPES = createTileTypes();

/**
 * Generate the full 144-tile set.
 * - Regular tiles (bamboo, circle, character, wind, dragon): 4 copies each = 34 types × 4 = 136
 * - Flowers: 4 unique = 4
 * - Seasons: 4 unique = 4
 * Total = 144
 */
export function generateFullSet(): TileType[] {
  const set: TileType[] = [];

  for (const t of ALL_TILE_TYPES) {
    if (t.suit === 'flower' || t.suit === 'season') {
      // Only 1 copy of each unique flower/season
      set.push(t);
    } else {
      // 4 copies of each regular tile
      set.push(t, t, t, t);
    }
  }

  return set; // 136 + 4 + 4 = 144
}

/**
 * Generate a smaller set for the Mini layout (36 tiles = 18 pairs).
 * Pick 18 match groups, 2 tiles each.
 */
export function generateMiniSet(): TileType[] {
  const set: TileType[] = [];
  const regularTypes = ALL_TILE_TYPES.filter(t => t.suit !== 'flower' && t.suit !== 'season');

  // Take the first 18 regular types, 2 copies each
  for (let i = 0; i < 18; i++) {
    set.push(regularTypes[i], regularTypes[i]);
  }

  return set; // 36
}
