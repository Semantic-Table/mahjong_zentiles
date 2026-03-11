import type { Layout, LayoutCell } from './Types.ts';

/**
 * Shanghai / Turtle classic layout — 144 tiles
 *
 * Coordinates: col/row in half-tile units.
 * Each tile occupies 2 col-units wide, 2 row-units tall.
 * Layers stack with a visual offset.
 */

function shanghaiLayout(): Layout {
  const cells: LayoutCell[] = [];

  // Layer 0 — 87 tiles (84 body + 3 wings)
  const layer0Rows: number[][] = [
    /* row 0 */ [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],           // 12
    /* row 1 */ [6, 8, 10, 12, 14, 16, 18, 20],                          // 8
    /* row 2 */ [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],                   // 10
    /* row 3 */ [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],           // 12
    /* row 4 */ [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],           // 12
    /* row 5 */ [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],                   // 10
    /* row 6 */ [6, 8, 10, 12, 14, 16, 18, 20],                          // 8
    /* row 7 */ [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],           // 12
  ]; // = 84

  for (let r = 0; r < layer0Rows.length; r++) {
    for (const c of layer0Rows[r]) {
      cells.push({ col: c, row: r * 2, layer: 0 });
    }
  }

  // Wing tiles (row 3-4 area, extending beyond main body)
  cells.push({ col: 0, row: 6, layer: 0 });   // left wing
  cells.push({ col: 0, row: 8, layer: 0 });   // left wing 2
  cells.push({ col: 26, row: 7, layer: 0 });  // right wing
  // = 87

  // Layer 1 — 36 tiles (6×6 centered)
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      cells.push({ col: 5 + c * 2, row: 1 + r * 2, layer: 1 });
    }
  }

  // Layer 2 — 16 tiles (4×4 centered)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push({ col: 7 + c * 2, row: 3 + r * 2, layer: 2 });
    }
  }

  // Layer 3 — 4 tiles (2×2 centered)
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      cells.push({ col: 9 + c * 2, row: 5 + r * 2, layer: 3 });
    }
  }

  // Layer 4 — 1 cap tile
  cells.push({ col: 10, row: 6, layer: 4 });

  // 87 + 36 + 16 + 4 + 1 = 144
  return { name: 'Shanghai', cells };
}

function miniLayout(): Layout {
  const cells: LayoutCell[] = [];

  // Layer 0 — 24 tiles (6×4)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      cells.push({ col: c * 2, row: r * 2, layer: 0 });
    }
  }

  // Layer 1 — 10 tiles (5×2 centered)
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      cells.push({ col: 1 + c * 2, row: 2 + r * 2, layer: 1 });
    }
  }

  // Layer 2 — 2 tiles
  cells.push({ col: 4, row: 3, layer: 2 });
  cells.push({ col: 6, row: 3, layer: 2 });

  // 24 + 10 + 2 = 36
  return { name: 'Mini', cells };
}

export const LAYOUTS: Record<string, Layout> = {
  shanghai: shanghaiLayout(),
  mini: miniLayout(),
};
