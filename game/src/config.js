// Solara Bay v2 — one place for every number, colour, mission and line of
// story. The city is a fixed 3200 x 2400 world; the camera follows the
// player and the renderer scales the view, so nothing here depends on the
// size of the screen it is played on.
export const WORLD = { width: 3200, height: 2400, road: 96, block: 304 };
export const STEP = 1 / 60;
export const SAVE_KEY = 'solara-bay.save.v2';
export const SAVE_SLOTS = 3;

// Key places on the map, so missions, the minimap and the HUD all agree.
export const PLACES = {
  garage: { x: 560, y: 300, name: "Lena's Garage" },
  bank: { x: 1700, y: 1000, name: 'Solara National Bank' },
  safehouse: { x: 1750, y: 1950, name: 'Verde Safehouse' },
  hospital: { x: 1400, y: 1000, name: 'St. Marina Hospital' },
  docks: { x: 600, y: 2200, name: 'Marina Docks' },
  beach: { x: 2900, y: 1000, name: 'Palmera Beachfront' },
  raceStart: { x: 1000, y: 600, name: 'Downtown Start Line' },
  hideout: { x: 300, y: 600, name: 'Old Town Hideout' },
};

// Five districts, each with its own ground tint and accent colour.
export const DISTRICTS = [
  { name: 'Downtown', x: 1200, y: 600, w: 1100, h: 900, ground: '#b59a6b', accent: '#ffb02e' },
  { name: 'Palmera Beach', x: 2500, y: 0, w: 700, h: 2400, ground: '#f2dd9e', accent: '#2fa8c9' },
  { name: 'Old Town', x: 0, y: 0, w: 1200, h: 600, ground: '#c2a37e', accent: '#e05a3a' },
  { name: 'Marina Docks', x: 0, y: 1500, w: 1200, h: 900, ground: '#9a8f7a', accent: '#4a7ac9' },
  { name: 'Verde Park', x: 1200, y: 1500, w: 1300, h: 900, ground: '#8fc46a', accent: '#4a8a3f' },
];

export const PLAYER = {
  radius: 13, walkSpeed: 235, runSpeed: 300, health: 100,
  pistolDamage: 34, pistolRange: 420, magSize: 12, reloadTime: 1.1, fireDelay: 0.22,
};

export const CAR = {
  length: 54, width: 26, accel: 420, reverseAccel: 260, maxSpeed: 560,
  maxReverse: 180, turnRate: 2.6, grip: 3.2, handbrakeGrip: 0.6, health: 100,
};

export const CAR_MODELS = [
  { name: 'Solano', color: '#d84a4a', speed: 1.0, desc: 'sedan' },
  { name: 'Brisa', color: '#4a90d8', speed: 0.92, desc: 'hatchback' },
  { name: 'Toro GT', color: '#e8b04b', speed: 1.18, desc: 'sports' },
  { name: 'Camion', color: '#7a8a99', speed: 0.8, desc: 'van' },
  { name: 'Palma', color: '#58b368', speed: 0.95, desc: 'coupe' },
  { name: 'Aurea', color: '#c9a0dc', speed: 1.08, desc: 'luxury' },
  { name: 'Cometa', color: '#e86a2a', speed: 1.24, desc: 'muscle' },
  { name: 'Vela', color: '#3fc9a8', speed: 0.86, desc: 'pickup' },
];

export const WANTED = {
  decayDelay: 8, decayPerSecond: 0.25, maxStars: 5,
  stealCar: 1, shootPed: 1, shootCop: 2, killPed: 2, hitPed: 1,
};

// Respect: the street's memory of the player. Ranks unlock as the story
// advances; each rank pays a bonus on the next mission reward.
export const RESPECT_RANKS = [
  { name: 'Nobody', missions: 0, bonus: 0 },
  { name: 'Runner', missions: 1, bonus: 0.05 },
  { name: 'Wheelman', missions: 3, bonus: 0.1 },
  { name: 'Made', missions: 5, bonus: 0.15 },
  { name: 'King of Solara', missions: 7, bonus: 0.2 },
  { name: 'Bay Legend', missions: 9, bonus: 0.25 },
];

// Three radio stations, switched with Q. Each has its own bass line and
// lead pattern, played by the synth in audio.js.
export const RADIO_STATIONS = [
  { name: 'SOLARA 88.5', tag: 'Midnight Drive', bass: [55, 0, 55, 65.4, 49, 0, 55, 73.4], lead: [220, 262, 330, 262], mood: 'synthwave' },
  { name: 'FUEGO FM', tag: 'Calle Caliente', bass: [49, 49, 0, 58.3, 49, 0, 65.4, 58.3], lead: [294, 349, 392, 349], mood: 'latin' },
  { name: 'BAY BASS 101', tag: 'Low & Loud', bass: [41.2, 0, 41.2, 0, 49, 0, 46.2, 0], lead: [165, 196, 220, 196], mood: 'bass' },
];

// The story: nine jobs from Lena Ortiz, Marco Ruiz and street racer Dario Voss.
// Step kinds: stealCar, reach, wanted, loseCops, kill, grab, race (timed
// checkpoint chain, must be driving), survive (hold out for a timer).
export const MISSIONS = [
  {
    id: 'wheels', title: 'First Wheels', giver: 'Lena Ortiz',
    brief: 'Lena needs wheels. Steal any car and bring it to her garage in Old Town.',
    steps: [
      { kind: 'stealCar', text: 'Steal a car (walk up to one and press E)' },
      { kind: 'reach', x: 560, y: 300, radius: 90, text: "Drive to Lena's Garage in Old Town", needCar: true },
    ],
    reward: 400,
  },
  {
    id: 'courier', title: 'Courier Run', giver: 'Lena Ortiz',
    brief: 'A package for the docks, then one for the beach. Fast and quiet — 150 seconds.',
    timeLimit: 150,
    steps: [
      { kind: 'reach', x: 560, y: 300, radius: 70, text: "Pick up the package at Lena's Garage" },
      { kind: 'reach', x: 300, y: 2200, radius: 80, text: 'Deliver to the Marina Docks' },
      { kind: 'reach', x: 2900, y: 1000, radius: 80, text: 'Deliver to the Beachfront' },
    ],
    reward: 900,
  },
  {
    id: 'getaway', title: 'Getaway', giver: 'Marco "El Jefe" Ruiz',
    brief: 'The job went loud. Lose the cops, then get to the safehouse in Verde Park.',
    steps: [
      { kind: 'wanted', stars: 3, text: 'The cops are on you — wanted level 3!' },
      { kind: 'loseCops', text: 'Lose the cops: get your wanted level to 0' },
      { kind: 'reach', x: 1750, y: 1950, radius: 90, text: 'Reach the Safehouse in Verde Park' },
    ],
    reward: 1200,
  },
  {
    id: 'takedown', title: 'Dockside Takedown', giver: 'Marco "El Jefe" Ruiz',
    brief: 'Rival crew Los Tiburones hold the docks. Clear them out — 6 of them.',
    steps: [
      { kind: 'reach', x: 600, y: 2200, radius: 110, text: 'Go to the Marina Docks' },
      { kind: 'kill', count: 6, text: 'Take down 6 Tiburones' },
    ],
    reward: 1600,
  },
  {
    id: 'score', title: 'The Big Score', giver: 'Lena Ortiz',
    brief: 'One last job: grab the cash from the Downtown bank and vanish. Cops will come hard.',
    steps: [
      { kind: 'reach', x: 1700, y: 1000, radius: 80, text: 'Reach the Downtown Bank' },
      { kind: 'grab', text: 'Grab the cash (stand on the marker)' },
      { kind: 'wanted', stars: 4, text: 'Alarms! Wanted level 4 — run!' },
      { kind: 'reach', x: 1750, y: 1950, radius: 90, text: 'Escape to the Safehouse' },
    ],
    reward: 3000,
  },
  {
    id: 'street-kings', title: 'Street Kings', giver: 'Dario Voss',
    brief: 'Dario runs the midnight races. Beat his course: 4 checkpoints, 120 seconds, in a car.',
    timeLimit: 120,
    steps: [
      { kind: 'reach', x: 1000, y: 600, radius: 80, text: 'Get to the Downtown Start Line (in a car)', needCar: true },
      {
        kind: 'race', text: 'Race! Hit every checkpoint before the clock runs out',
        checkpoints: [
          { x: 2200, y: 600, radius: 70 },
          { x: 2200, y: 1800, radius: 70 },
          { x: 1000, y: 1800, radius: 70 },
          { x: 1000, y: 600, radius: 80 },
        ],
      },
    ],
    reward: 2000,
  },
  {
    id: 'harbor-heat', title: 'Harbor Heat', giver: 'Marco "El Jefe" Ruiz',
    brief: 'Los Tiburones want the docks back. Hold the harbor for 60 seconds — they are coming in waves.',
    steps: [
      { kind: 'reach', x: 600, y: 2200, radius: 110, text: 'Get to the Marina Docks' },
      { kind: 'survive', seconds: 60, gang: 8, text: 'Hold the docks! Survive 60 seconds of Tiburones' },
    ],
    reward: 2200,
  },
  {
    id: 'driver', title: 'The Getaway Driver', giver: 'Lena Ortiz',
    brief: 'Lena has three drops and the whole SBPD on her tail. Drive her to each one — wanted 2 the whole way.',
    steps: [
      { kind: 'reach', x: 560, y: 300, radius: 70, text: "Pick up Lena at her Garage (in a car)", needCar: true },
      { kind: 'wanted', stars: 2, text: 'The SBPD is on you — wanted level 2!' },
      { kind: 'reach', x: 300, y: 600, radius: 80, text: 'Drop 1: Old Town Hideout', needCar: true },
      { kind: 'reach', x: 2900, y: 1800, radius: 80, text: 'Drop 2: Palmera Beachfront', needCar: true },
      { kind: 'reach', x: 1750, y: 1950, radius: 90, text: 'Drop 3: Verde Safehouse', needCar: true },
    ],
    reward: 2400,
  },
  {
    id: 'crown', title: 'Crown of Solara', giver: 'Marco "El Jefe" Ruiz',
    brief: 'The vault job. Empty the Downtown bank, outrun Air One at 5 stars, and vanish to the hideout.',
    steps: [
      { kind: 'reach', x: 1700, y: 1000, radius: 80, text: 'Reach the Downtown Bank' },
      { kind: 'grab', text: 'Empty the vault (stand on the marker)' },
      { kind: 'wanted', stars: 5, text: 'AIR ONE IS UP! Wanted level 5 — run!' },
      { kind: 'reach', x: 300, y: 600, radius: 90, text: 'Escape to the Old Town Hideout' },
    ],
    reward: 5000,
  },
];

// SBPD dispatch chatter, picked by the dispatch board as the heat rises.
export const DISPATCH_LINES = {
  wanted1: ['SBPD DISPATCH: 10-38, stolen vehicle reported Downtown', 'SBPD DISPATCH: units, be advised — suspect on foot, Downtown'],
  wanted2: ['SBPD DISPATCH: 10-80, pursuit in progress — all units respond', 'SBPD DISPATCH: suspect vehicle fleeing, request backup'],
  wanted3: ['SBPD DISPATCH: 10-80 in progress — roadblocks going up', 'SBPD DISPATCH: K-9 and air support on standby'],
  wanted4: ['SBPD DISPATCH: AIR ONE is up — eyes on the suspect', 'SBPD DISPATCH: 10-80, suspect armed — approach with caution'],
  wanted5: ['SBPD DISPATCH: ALL UNITS — 5-star suspect, maximum response', 'SBPD DISPATCH: AIR ONE: visual confirmed, do not lose him'],
  roadblock: ['SBPD DISPATCH: roadblock set — spike strips ready', 'SBPD DISPATCH: roadblock on the avenue — stop the suspect'],
  heli: ['AIR ONE: I have eyes on the suspect vehicle', 'AIR ONE: tracking from above — suspect heading east'],
  lost: ['SBPD DISPATCH: suspect lost — standing down to patrol', 'SBPD DISPATCH: 10-38 cleared, resume patrol'],
  busted: ['SBPD DISPATCH: 10-15, suspect in custody', 'SBPD DISPATCH: one in custody — good work, units'],
};

// Golden-hour palette: brighter and warmer than a flat noon city, so the
// whole game reads as one sun-soaked afternoon on the bay.
export const PALETTE = {
  sky: '#ffd9a0', sun: '#fff3c4',
  road: '#41414e', roadEdge: '#2c2c33', lane: '#ffd94d',
  sidewalk: '#cbbd9c', grass: '#8fc46a', sand: '#f2dd9e', water: '#2f8fc4',
  buildingRoof: '#6b5d4f', buildingEdge: '#4a4036',
  player: '#e84a4a', playerShirt: '#f2f2f2',
  hudPanel: 'rgba(12,14,20,0.72)', hudText: '#f5f2ea', hudAccent: '#ffd23f',
  wanted: '#ff5252', mission: '#7ee787', dispatch: '#7ec8ff',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
