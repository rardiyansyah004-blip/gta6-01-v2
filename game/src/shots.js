// The screenshot scenes behind ?shot=cover|drive|chase|mission. Each one
// stages a real world — the same world the player drives — then steps it
// forward with a simple autopilot so the frame is what live play really
// looks like, and the same seed always gives the same frame. The four shots
// are chosen so each one proves a different system at a glance: the dispatch
// and helicopter chase, the race with radio and respect, the living dusk
// city, and the title screen with saves and progression.
import { SAVE_KEY, STEP } from './config.js';
import { SCREEN_PLAY, SCREEN_TITLE } from './render.js';

// Drive the player's car toward a point, steering like a driver would. A
// sharp turn is braked into, never reversed into: at speed the car brakes
// while steering, and once slow it crawls forward through the turn, so it
// never backs itself into a building. Near the target it just keeps going
// straight — stopping to turn around would stall the shot.
function autopilotDrive(world, tx, ty) {
  const p = world.player;
  const car = p.inCar;
  if (!car) return { w: false, a: false, d: false, s: false };
  const dx = tx - car.x;
  const dy = ty - car.y;
  const d = Math.hypot(dx, dy);
  if (d < 200) return { w: true, a: false, d: false, s: false };
  const want = Math.atan2(dy, dx);
  let diff = want - car.angle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  const left = diff < -0.12;
  const right = diff > 0.12;
  if (Math.abs(diff) > 1.2) {
    // Sharp turn: brake while steering when fast, crawl forward when slow.
    if (Math.abs(car.speed) > 80) return { w: false, a: left, d: right, s: true };
    return { w: true, a: left, d: right, s: false };
  }
  // Approaching the target off-angle: shed speed before the turn.
  if (d < 420 && Math.abs(diff) > 0.5) return { w: false, a: left, d: right, s: true };
  return { w: true, a: left, d: right, s: false };
}

// A fake input that answers like a held key set, for staged scenes.
function fakeInput(drive) {
  const keys = new Set();
  if (drive.w) keys.add('KeyW');
  if (drive.a) keys.add('KeyA');
  if (drive.d) keys.add('KeyD');
  if (drive.s) keys.add('KeyS');
  return {
    mouse: { x: 640, y: 360, down: false },
    down: (code) => keys.has(code),
    moveVector: () => ({ x: 0, y: 0 }),
    takeActions: () => 0,
    takeClick: () => false,
  };
}

const silentAudio = {
  shoot() {}, punch() {}, hit() {}, pickup() {}, cash() {}, missionDone() {},
  missionFail() {}, siren() {}, crash() {}, enterCar() {}, reload() {}, busted() {},
  engine() {}, dispatchBlip() {}, setStation() {},
};

function stepWorld(world, seconds, driveFn) {
  for (let i = 0; i < seconds / STEP; i += 1) {
    const drive = driveFn ? driveFn(world) : { w: false, a: false, d: false, s: false };
    world.step(STEP, fakeInput(drive), silentAudio);
  }
}

// Put the player in a car at a spot and point the camera at them. Prefers
// the parked car of the requested model (a sports car for the fast shots).
function placeInCar(world, x, y, modelIndex, angle) {
  const parked = world.state.cars.filter((c) => c.kind === 'parked');
  const names = ['Solano', 'Brisa', 'Toro GT', 'Camion', 'Palma', 'Aurea', 'Cometa', 'Vela'];
  const wanted = modelIndex !== undefined && parked.find((c) => c.model.name === names[modelIndex]);
  // Fall back to the fastest parked car, so the fast shots are always fast.
  const fastest = [...parked].sort((a, b) => b.model.speed - a.model.speed)[0];
  const car = wanted || fastest || parked[0];
  if (!car) return;
  car.x = x; car.y = y; car.angle = angle === undefined ? 0 : angle; car.speed = 0; car.stolen = true;
  const p = world.player;
  p.x = x; p.y = y; p.inCar = car; car.kind = 'player';
  world.state.camera.x = x; world.state.camera.y = y;
}

export function stageShot(name, world) {
  world.reset();
  if (name === 'cover') {
    // Wanted 4, downtown: Air One overhead, dispatch feed talking, police
    // closing in, the player at speed in a Cometa. The whole escalation in
    // one frame.
    placeInCar(world, 600, 1000, 6);
    world.player.money = 6850;
    world.state.missionsDone = 4;
    world.missions.index = 4;
    world.missions.start();
    world.addWanted(4);
    stepWorld(world, 5, (w) => autopilotDrive(w, 2400, 1000));
    return { screen: SCREEN_PLAY };
  }
  if (name === 'drive') {
    // Street Kings, mission 6: staged on the southbound leg, already past
    // the first checkpoint — the car races down the avenue toward
    // checkpoint 2 at speed, radio on SOLARA 88.5, respect rank on the HUD.
    world.missions.index = 5;
    world.missions.start();
    world.missions.stageTo(1, 1);
    world.state.missionsDone = 5;
    world.player.money = 5200;
    placeInCar(world, 2200, 900, 2, Math.PI / 2);
    stepWorld(world, 2, (w) => autopilotDrive(w, 2200, 1800));
    return { screen: SCREEN_PLAY };
  }
  if (name === 'chase') {
    // Living city at dusk: on foot at a busy Downtown intersection — traffic
    // streaming past, pedestrians on the sidewalks, a patrol car beside a
    // smoking wreck, hotel and bank towers behind. No wanted level: this is
    // the city itself, alive, at golden hour. The scene steps 4 seconds so
    // the mission banner has faded and the traffic has arrived.
    world.missions.index = 1;
    world.missions.start();
    world.state.missionsDone = 1;
    world.player.money = 3100;
    const p = world.player;
    p.x = 1400; p.y = 980; p.aimX = 1450; p.aimY = 1035; p.aimAngle = Math.atan2(1035 - 980, 1450 - 1400);
    world.state.camera.x = 1400; world.state.camera.y = 1000;
    // A few pedestrians strolling the intersection, and a patrol car parked
    // beside the wreck, investigating it.
    const spots = [[1300, 920], [1520, 950], [1350, 1120], [1560, 1080]];
    world.state.peds.slice(0, 4).forEach((ped, i) => {
      ped.x = spots[i][0]; ped.y = spots[i][1]; ped.tx = spots[i][0] + 120; ped.ty = spots[i][1];
    });
    const patrol = world.state.cars.find((c) => c.kind === 'patrol');
    if (patrol) { patrol.x = 1520; patrol.y = 1035; patrol.angle = Math.PI; patrol.speed = 0; patrol.cruise = 0; }
    stepWorld(world, 4, null);
    return { screen: SCREEN_PLAY };
  }
  if (name === 'mission') {
    // Title screen with saves: three slots showing real progress, over a
    // living city. The slots are staged demo saves — written here, the same
    // way the cover shot stages a wanted level — so the screen shows what
    // the save system looks like when it has a story in it.
    try {
      window.localStorage.setItem(`${SAVE_KEY}.slot1`, JSON.stringify({ money: 7400, missionsDone: 6, missionIndex: 6, kills: 14, carsStolen: 9, carUpgrades: 2, weaponTier: 2, savedAt: '2026-11-24T00:30:00.000Z' }));
      window.localStorage.setItem(`${SAVE_KEY}.slot2`, JSON.stringify({ money: 2100, missionsDone: 3, missionIndex: 3, kills: 6, carsStolen: 4, carUpgrades: 1, weaponTier: 0, savedAt: '2026-11-23T20:15:00.000Z' }));
      window.localStorage.removeItem(`${SAVE_KEY}.slot3`);
    } catch { /* storage can be off */ }
    stepWorld(world, 4, null);
    return { screen: SCREEN_TITLE };
  }
  // Default: title screen over a living city.
  stepWorld(world, 4, null);
  return { screen: SCREEN_TITLE };
}
