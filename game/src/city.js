// Solara Bay itself: a road grid, city blocks full of buildings, a park, a
// beach and the docks. Generation is seeded, so the same seed always builds
// the same city. Collision is circle-vs-building-rectangle, with sliding
// along walls. Landmark buildings carry names the missions point at.
import { DISTRICTS, PLACES, WORLD } from './config.js';

export const PITCH = 400;
export const ROAD_W = 96;

function roadCenters(limit) {
  const list = [];
  for (let c = 200; c < limit; c += PITCH) list.push(c);
  return list;
}
export const ROADS_X = roadCenters(WORLD.width);
export const ROADS_Y = roadCenters(WORLD.height);

export function isRoad(x, y) {
  for (const rx of ROADS_X) if (Math.abs(x - rx) < ROAD_W / 2) return true;
  for (const ry of ROADS_Y) if (Math.abs(y - ry) < ROAD_W / 2) return true;
  return false;
}

export function districtAt(x, y) {
  for (const d of DISTRICTS) {
    if (x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h) return d;
  }
  return DISTRICTS[0];
}

export function createCity(random) {
  const buildings = [];
  const trees = [];
  const palms = [];
  const pickups = [];
  const parkBlocks = [];
  const neons = [];
  const buildingColors = ['#d08a5a', '#c97e6b', '#a8b8a0', '#7e8a99', '#e8b04b', '#b5654a', '#6d8a7a', '#c9a227', '#e89a8a', '#8aa8c9'];

  // City blocks are the squares between roads. Each gets buildings, a park,
  // or beach treatment, depending on its district.
  for (let bx = 0; bx < ROADS_X.length - 1; bx += 1) {
    for (let by = 0; by < ROADS_Y.length - 1; by += 1) {
      const x0 = ROADS_X[bx] + ROAD_W / 2 + 8;
      const y0 = ROADS_Y[by] + ROAD_W / 2 + 8;
      const x1 = ROADS_X[bx + 1] - ROAD_W / 2 - 8;
      const y1 = ROADS_Y[by + 1] - ROAD_W / 2 - 8;
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const district = districtAt(cx, cy);
      // Beach strip: sand and palms, no buildings.
      if (cx > 2850) {
        for (let i = 0; i < 5; i += 1) palms.push({ x: random.range(x0, x1), y: random.range(y0, y1) });
        continue;
      }
      // Verde Park blocks: grass, trees, a pond.
      if (district.name === 'Verde Park' && random.chance(0.55)) {
        parkBlocks.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
        for (let i = 0; i < 7; i += 1) trees.push({ x: random.range(x0 + 20, x1 - 20), y: random.range(y0 + 20, y1 - 20), r: random.range(10, 16) });
        continue;
      }
      // Docks: wide low warehouses.
      if (district.name === 'Marina Docks' && random.chance(0.5)) {
        buildings.push({
          x: x0 + 20, y: y0 + 40, w: x1 - x0 - 40, h: 110,
          color: '#8a99a8', height: random.int(1, 2), label: 'WAREHOUSE', neon: '',
        });
        continue;
      }
      // Normal block: one tall building, or a pair of smaller ones.
      const tall = district.name === 'Downtown';
      const neonWords = ['HOTEL SOL', 'NEON', 'CAFÉ LUNA', 'TACOS', 'CINEMA', 'BAR MAR'];
      if (random.chance(0.6)) {
        const w = random.range(120, x1 - x0 - 30);
        const h = random.range(110, y1 - y0 - 30);
        const label = tall && random.chance(0.4) ? random.pick(['HOTEL', 'BANK', 'TOWER', 'PLAZA']) : '';
        const neon = tall && random.chance(0.5) ? random.pick(neonWords) : '';
        buildings.push({
          x: cx - w / 2, y: cy - h / 2, w, h,
          color: random.pick(buildingColors), height: tall ? random.int(3, 6) : random.int(1, 3),
          label, neon,
        });
        if (neon) neons.push({ x: cx, y: cy - h / 2 - 6, text: neon });
      } else {
        buildings.push({
          x: x0 + 10, y: y0 + 10, w: (x1 - x0) / 2 - 20, h: (y1 - y0) / 2 - 20,
          color: random.pick(buildingColors), height: random.int(1, 3), label: '', neon: '',
        });
        buildings.push({
          x: cx + 10, y: cy + 10, w: (x1 - x0) / 2 - 20, h: (y1 - y0) / 2 - 20,
          color: random.pick(buildingColors), height: random.int(1, 2), label: '', neon: '',
        });
      }
      // A tree or two on the block's corners.
      if (random.chance(0.5)) trees.push({ x: x0 + 14, y: y1 - 14, r: 11 });
      if (random.chance(0.3)) trees.push({ x: x1 - 14, y: y0 + 14, r: 11 });
    }
  }

  // Landmark buildings the story names: the bank, the garage, the safehouse.
  function landmarkAt(place, label, color) {
    // Find the block the place sits in and plant a labelled building beside it.
    let bx = 0; let by = 0;
    for (let i = 0; i < ROADS_X.length - 1; i += 1) {
      if (place.x >= ROADS_X[i] + ROAD_W / 2 && place.x < ROADS_X[i + 1] - ROAD_W / 2) bx = i;
    }
    for (let i = 0; i < ROADS_Y.length - 1; i += 1) {
      if (place.y >= ROADS_Y[i] + ROAD_W / 2 && place.y < ROADS_Y[i + 1] - ROAD_W / 2) by = i;
    }
    const x0 = ROADS_X[bx] + ROAD_W / 2 + 8;
    const y0 = ROADS_Y[by] + ROAD_W / 2 + 8;
    const x1 = ROADS_X[bx + 1] - ROAD_W / 2 - 8;
    const y1 = ROADS_Y[by + 1] - ROAD_W / 2 - 8;
    buildings.push({
      x: x0 + 30, y: y0 + 30, w: Math.min(220, x1 - x0 - 60), h: Math.min(150, y1 - y0 - 60),
      color, height: 2, label, neon: '',
    });
  }
  landmarkAt(PLACES.bank, 'BANK', '#c9a227');
  landmarkAt(PLACES.garage, 'GARAGE', '#c96a4a');
  landmarkAt(PLACES.safehouse, 'SAFEHOUSE', '#5d8a46');

  // Cash pickups scattered on sidewalks and in the park.
  for (let i = 0; i < 18; i += 1) {
    const rx = ROADS_X[random.int(0, ROADS_X.length - 1)];
    const ry = ROADS_Y[random.int(0, ROADS_Y.length - 1)];
    pickups.push({ x: rx + random.range(-160, 160), y: ry + random.range(-160, 160), taken: false, value: 50, kind: 'cash' });
  }
  // Health pickups near the hospital and the beach and the docks.
  pickups.push({ x: 1400, y: 1400, taken: false, value: 50, kind: 'health' });
  pickups.push({ x: 2900, y: 900, taken: false, value: 50, kind: 'health' });
  pickups.push({ x: 600, y: 2100, taken: false, value: 50, kind: 'health' });

  function hitsBuilding(x, y, r) {
    for (const b of buildings) {
      const nx = Math.max(b.x, Math.min(x, b.x + b.w));
      const ny = Math.max(b.y, Math.min(y, b.y + b.h));
      const dx = x - nx; const dy = y - ny;
      if (dx * dx + dy * dy < r * r) return b;
    }
    return null;
  }

  // Move a circle, sliding along building walls; returns the corrected position.
  // The full diagonal step is checked first: moving x-then-y alone lets a
  // diagonal step cut the corner of a building and end up inside it.
  function moveCircle(x, y, dx, dy, r) {
    const nx = x + dx;
    const ny = y + dy;
    let rx = x; let ry = y;
    if (!hitsBuilding(nx, ny, r)) { rx = nx; ry = ny; }
    else if (!hitsBuilding(nx, y, r)) rx = nx;
    else if (!hitsBuilding(x, ny, r)) ry = ny;
    // Keep inside the world; the sea is a wall on the east edge.
    rx = Math.max(20, Math.min(WORLD.width - 140, rx));
    ry = Math.max(20, Math.min(WORLD.height - 20, ry));
    return { x: rx, y: ry };
  }

  function randomRoadPoint() {
    if (random.chance(0.5)) {
      return { x: ROADS_X[random.int(0, ROADS_X.length - 1)] + random.range(-24, 24), y: random.range(100, WORLD.height - 100) };
    }
    return { x: random.range(100, WORLD.width - 200), y: ROADS_Y[random.int(0, ROADS_Y.length - 1)] + random.range(-24, 24) };
  }

  function nearestRoad(x, y) {
    let best = null; let bestD = Infinity;
    for (const rx of ROADS_X) { const d = Math.abs(x - rx); if (d < bestD) { bestD = d; best = { axis: 'x', line: rx, along: y }; } }
    for (const ry of ROADS_Y) { const d = Math.abs(y - ry); if (d < bestD) { bestD = d; best = { axis: 'y', line: ry, along: x }; } }
    return best;
  }

  return {
    buildings, trees, palms, pickups, parkBlocks, neons,
    hitsBuilding, moveCircle, randomRoadPoint, nearestRoad,
  };
}
