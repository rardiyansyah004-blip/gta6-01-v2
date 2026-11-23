# Solara Bay v2 — an open-world crime game (gta6-01)

A 2D top-down open-world crime game set in the sun-soaked fictional city of
Solara Bay. All names, characters, vehicles, story and art are original.

## What is in the game

- **A complete open world**: a 3200×2400 city with 5 districts (Downtown,
  Palmera Beach, Old Town, Marina Docks, Verde Park), 22 traffic cars plus
  2 SBPD patrol cars always on the beat, 42 pedestrians, 14 parked cars to
  steal, 8 car models, cash and health pickups, a beach, a park, the docks,
  neon signs, and two burning wrecks still smoking on the avenues — all lit
  by a golden-hour dusk.
- **Nine story missions** from Lena Ortiz, Marco "El Jefe" Ruiz and street
  racer Dario Voss — car theft, courier runs, getaways, gang takedowns, bank
  jobs, a timed 4-checkpoint street race, a 60-second hold-the-docks defence,
  a getaway-driver escort and a 5-star finale against Air One.
- **SBPD dispatch**: a live dispatch feed, roadblocks at 3+ stars, up to 4
  pursuing police cars, and the Air One helicopter with a searchlight at
  4–5 stars. Wanted level 1–5, decaying when the player goes quiet.
- **Progression**: respect ranks (Nobody → Bay Legend) that pay a bonus on
  every mission reward, garage tunes at Lena's Garage ($500, +15% top speed,
  up to 3), and weapon upgrades as the story advances (Pistol → MK II → MK III).
- **Radio**: three switchable synth stations (SOLARA 88.5, FUEGO FM, BAY
  BASS 101) — Q to switch, M to mute the music.
- **Saves**: three save slots on the title screen (Space continues the
  latest, 1/2/3 pick a slot, N starts a new game). Progress saves after
  every mission and every garage tune.
- **Feel and polish**: HUD with money, health, ammo, wanted stars, mission
  objective with timer, respect rank, radio readout and a minimap with
  mission, police, roadblock and helicopter blips; title / pause / busted
  screens; particles, sirens, engine hum and WebAudio synth SFX and music.

## Controls

WASD move/drive · E steal/exit car · mouse aim, click to shoot · R reload ·
F punch · Q radio station · G garage tune (near Lena's Garage) · Shift run ·
Space handbrake · P pause · M music · N new game on the title screen.

## Play

`node serve.ts`, then open http://localhost:8080. No build step, no network.

## Build

`MAKEFUN_OUTPUT_DIR=out node main.ts` copies `game/` and `screenshots/`
and writes `out/dossier.json`. Run it twice: the output is byte-identical.

## Screenshots

Each one proves a different system at a glance — the screenshots are the
product as much as the game:

1. `1-cover.jpg` — wanted 4 downtown, Air One overhead with its
   searchlight, SBPD dispatch feed live, roadblock ahead, respect rank and
   mission 5/9 on the HUD.
2. `2-drive.jpg` — Street Kings race at 145 mph, checkpoint 2/4 with the
   timer running, radio on SOLARA 88.5, respect rank MADE.
3. `3-city.jpg` — the living city at dusk: on foot at a busy Downtown
   intersection, traffic streaming past, pedestrians on the sidewalks, a
   patrol car beside a smoking wreck, hotel and bank towers behind.
4. `4-title.jpg` — the title screen over a living city, with three save
   slots showing progress (6/9 jobs $7,400; 3/9 jobs $2,100; empty). The
   slots are staged demo saves, written by the shot staging the same way
   the cover stages a wanted level.
