import './style.css';
import { Application, Graphics, Text, TextStyle, Container } from 'pixi.js';
import { Game } from './core/Game.ts';
import type { Tile } from './core/Types.ts';

// Base tile size (designed at this size, then scaled to fit)
const TILE_W = 52;
const TILE_H = 64;
const TILE_GAP = 3;          // space between adjacent tiles
const LAYER_OFFSET_X = 6;    // depth shift per layer
const LAYER_OFFSET_Y = 6;

const HUD_HEIGHT = 56;
const PADDING = 12;

// --- Dusk theme ---
const THEME = {
  bg: 0xFAFAFA,
  tile: 0xFFFFFF,
  tileStroke: 0xE0E0E0,
  tileShadowColor: 0x000000,
  tileShadowAlpha: 0.08,
  tileSelected: 0xC8C3D9,
  tileBlocked: 0xF2F2F0,
  tileHint: 0xE8B896,
  textPrimary: 0x1A1A1A,
  textSecondary: 0x999999,
  btnText: 0x2C2825,
  accent: 0xE8B896,
  comboText: 0xC4875A,
};

// Tile tint per suit family
const SUIT_COLORS: Record<string, number> = {
  bamboo:    0xC2E0B8,  // vert frais
  circle:    0xB8CDE8,  // bleu ciel
  character: 0xE8B8B8,  // rose corail
  wind:      0xE8DBA8,  // doré chaud
  dragon:    0xCFB8E8,  // violet doux
  flower:    0xE8C8A8,  // pêche
  season:    0xA8D8C0,  // menthe
};

// Button colors
const BTN_COLORS = {
  undo:    { bg: 0xB8CDE8, stroke: 0x9AB8D8 },  // bleu ciel
  hint:    { bg: 0xE8C8A8, stroke: 0xD8B898 },  // pêche
  shuffle: { bg: 0xC2E0B8, stroke: 0xA8CCA0 },  // vert frais
  new:     { bg: 0xCFB8E8, stroke: 0xBCA0D8 },  // violet doux
};

class MahjongApp {
  app!: Application;
  game = new Game();
  tileContainer!: Container;
  boardWrapper!: Container;
  tileGraphics = new Map<number, Container>();
  hintedTiles = new Set<number>();
  hudContainer!: Container;
  // Cached natural bounds (before scaling) — updated only on full re-render
  naturalBounds = { x: 0, y: 0, w: 0, h: 0 };

  async start(): Promise<void> {
    this.app = new Application();
    await this.app.init({
      background: THEME.bg,
      resizeTo: window,
      antialias: true,
    });
    document.getElementById('app')!.appendChild(this.app.canvas);

    this.boardWrapper = new Container();
    this.tileContainer = new Container();
    this.boardWrapper.addChild(this.tileContainer);
    this.app.stage.addChild(this.boardWrapper);

    this.setupEvents();
    this.game.startGame('shanghai');
    this.renderBoard();
    this.createHUD();
    this.fitToScreen();

    window.addEventListener('resize', () => this.fitToScreen());
  }

  private setupEvents(): void {
    this.game.on((event) => {
      switch (event.type) {
        case 'select':
        case 'deselect':
        case 'no-match':
          this.hintedTiles.clear();
          this.updateTileVisuals();
          break;
        case 'match':
          this.hintedTiles.clear();
          this.removeTileGraphics(event.tile1.id);
          this.removeTileGraphics(event.tile2.id);
          this.updateTileVisuals();
          break;
        case 'undo':
        case 'shuffle':
          this.hintedTiles.clear();
          this.renderBoard();
          this.fitToScreen();
          break;
        case 'hint':
          this.hintedTiles.clear();
          this.hintedTiles.add(event.tile1.id);
          this.hintedTiles.add(event.tile2.id);
          this.updateTileVisuals();
          break;
        case 'state-change':
          if (event.state === 'won') this.showMessage('You Win!');
          if (event.state === 'lost') this.showMessage('No moves left');
          break;
        case 'combo':
          this.showCombo(event.count);
          break;
      }
    });
  }

  private fitToScreen(): void {
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;

    const availW = sw - PADDING * 2;
    const availH = sh - PADDING * 2 - HUD_HEIGHT;

    const { x: bx, y: by, w: naturalW, h: naturalH } = this.naturalBounds;
    if (naturalW === 0 || naturalH === 0) return;

    const scale = Math.min(availW / naturalW, availH / naturalH, 1.2);
    this.boardWrapper.scale.set(scale);

    const scaledW = naturalW * scale;
    const scaledH = naturalH * scale;
    this.boardWrapper.x = (sw - scaledW) / 2 - bx * scale;
    this.boardWrapper.y = PADDING + (availH - scaledH) / 2 - by * scale;

    this.repositionHUD();
  }

  private renderBoard(): void {
    this.tileContainer.removeChildren();
    this.tileGraphics.clear();

    const sorted = [...this.game.board.tiles].sort((a, b) =>
      a.layer - b.layer || a.row - b.row || a.col - b.col
    );

    for (const tile of sorted) {
      this.createTileGraphic(tile);
    }

    // Cache natural bounds (at scale 1)
    const savedScale = this.boardWrapper.scale.x;
    this.boardWrapper.scale.set(1);
    const b = this.tileContainer.getBounds();
    this.naturalBounds = { x: b.x, y: b.y, w: b.width, h: b.height };
    this.boardWrapper.scale.set(savedScale);
  }

  private createTileGraphic(tile: Tile): void {
    const container = new Container();
    const isFree = this.game.board.isFree(tile);

    const cellW = TILE_W + TILE_GAP;
    const cellH = TILE_H + TILE_GAP;
    const x = tile.col * (cellW / 2) - tile.layer * LAYER_OFFSET_X;
    const y = tile.row * (cellH / 2) - tile.layer * LAYER_OFFSET_Y;
    container.x = x;
    container.y = y;

    // Shadow — short, warm, like a real tile on paper
    const shadow = new Graphics();
    shadow.roundRect(2, 3, TILE_W, TILE_H, 12);
    shadow.fill({ color: THEME.tileShadowColor, alpha: THEME.tileShadowAlpha });
    container.addChild(shadow);

    // Tile body
    const isSelected = this.game.selectedTile?.id === tile.id;
    const isHinted = this.hintedTiles.has(tile.id);
    const body = new Graphics();
    body.roundRect(0, 0, TILE_W, TILE_H, 12);

    const suitColor = SUIT_COLORS[tile.type.suit] ?? THEME.tile;
    let fillColor = suitColor;
    if (isSelected) fillColor = THEME.tileSelected;
    else if (isHinted) fillColor = THEME.tileHint;
    else if (!isFree) fillColor = THEME.tileBlocked;

    body.fill(fillColor);
    body.stroke({ color: THEME.tileStroke, width: 1 });
    container.addChild(body);

    // Label
    const label = new Text({
      text: tile.type.label,
      style: new TextStyle({
        fontFamily: 'sans-serif',
        fontSize: 13,
        fontWeight: '600',
        fill: isFree ? THEME.textPrimary : THEME.textSecondary,
      }),
    });
    label.anchor.set(0.5);
    label.x = TILE_W / 2;
    label.y = TILE_H / 2;
    container.addChild(label);

    // Interactivity
    container.eventMode = isFree ? 'static' : 'none';
    container.cursor = isFree ? 'pointer' : 'default';
    if (isFree) {
      container.on('pointerdown', () => this.game.selectTile(tile));
    }

    if (!isFree) {
      container.alpha = 0.55;
    }

    this.tileContainer.addChild(container);
    this.tileGraphics.set(tile.id, container);
  }

  private removeTileGraphics(id: number): void {
    const g = this.tileGraphics.get(id);
    if (g) {
      this.tileContainer.removeChild(g);
      this.tileGraphics.delete(id);
    }
  }

  private updateTileVisuals(): void {
    this.renderBoard();
  }

  private createHUD(): void {
    this.hudContainer = new Container();

    const buttons = [
      { label: 'Undo', ...BTN_COLORS.undo, action: () => this.game.undo() },
      { label: 'Hint', ...BTN_COLORS.hint, action: () => this.game.hint() },
      { label: 'Shuffle', ...BTN_COLORS.shuffle, action: () => this.game.shuffle() },
      { label: 'New', ...BTN_COLORS.new, action: () => { this.game.startGame('shanghai'); this.renderBoard(); this.fitToScreen(); } },
    ];

    buttons.forEach((btn, i) => {
      const c = new Container();

      // Shadow
      const shadow = new Graphics();
      shadow.roundRect(1, 2, 72, 36, 18);
      shadow.fill({ color: 0x000000, alpha: 0.10 });

      // Pill button with subtle border
      const bg = new Graphics();
      bg.roundRect(0, 0, 72, 36, 18);
      bg.fill({ color: btn.bg });
      bg.stroke({ color: btn.stroke, width: 1 });

      const text = new Text({
        text: btn.label,
        style: new TextStyle({
          fontFamily: 'sans-serif',
          fontSize: 13,
          fontWeight: '600',
          fill: THEME.btnText,
        }),
      });
      text.anchor.set(0.5);
      text.x = 36;
      text.y = 18;

      c.addChild(shadow, bg, text);
      c.x = i * 82;
      c.eventMode = 'static';
      c.cursor = 'pointer';
      c.on('pointerdown', btn.action);
      this.hudContainer.addChild(c);
    });

    this.app.stage.addChild(this.hudContainer);
  }

  private repositionHUD(): void {
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;
    const btnCount = this.hudContainer.children.length;
    const totalW = btnCount * 82 - 10;

    const hudScale = Math.min(1, (sw - PADDING * 2) / totalW);
    this.hudContainer.scale.set(hudScale);

    this.hudContainer.x = (sw - totalW * hudScale) / 2;
    this.hudContainer.y = sh - HUD_HEIGHT;
  }

  private showMessage(text: string): void {
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;
    const fontSize = Math.min(48, sw * 0.1);

    const msg = new Text({
      text,
      style: new TextStyle({
        fontFamily: 'sans-serif',
        fontSize,
        fontWeight: 'bold',
        fill: THEME.textPrimary,
      }),
    });
    msg.anchor.set(0.5);
    msg.x = sw / 2;
    msg.y = sh / 2;
    this.app.stage.addChild(msg);
    setTimeout(() => this.app.stage.removeChild(msg), 3000);
  }

  private showCombo(count: number): void {
    const sw = this.app.screen.width;
    const sh = this.app.screen.height;
    const fontSize = Math.min(32, sw * 0.08);

    const msg = new Text({
      text: `Combo x${count}!`,
      style: new TextStyle({
        fontFamily: 'sans-serif',
        fontSize,
        fontWeight: 'bold',
        fill: THEME.comboText,
      }),
    });
    msg.anchor.set(0.5);
    msg.x = sw / 2;
    msg.y = sh / 2 - 60;
    this.app.stage.addChild(msg);
    setTimeout(() => this.app.stage.removeChild(msg), 1500);
  }
}

const app = new MahjongApp();
app.start();
