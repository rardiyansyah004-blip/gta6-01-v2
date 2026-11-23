// Boot and the one loop for Solara Bay v2: input is read every frame, the
// world advances in fixed 1/60 s steps, and the renderer paints what is
// there. The game moves between title, play, paused and busted screens.
// The title screen shows three save slots: Space continues the latest save,
// 1/2/3 pick a slot, N starts a fresh game. Progress saves after every
// mission and after every garage tune.
//
// ?seed=N fixes the city and traffic. ?shot=cover|drive|chase|mission stages
// that scene instead of running the loop, paints it twice and sets
// window.__shotReady. window.__game exposes the live state for play-testing
// (never used by the game itself).
import { STEP } from './config.js';
import { createWorld, EVENT_BUSTED, EVENT_WASTED } from './world.js';
import {
  ACTION_CONFIRM, ACTION_PAUSE, ACTION_RADIO, ACTION_NEW_GAME,
  ACTION_SLOT_1, ACTION_SLOT_2, ACTION_SLOT_3, createInput,
} from './input.js';
import { createAudio } from './audio.js';
import { createRenderer, SCREEN_BUSTED, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 20261121;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(seed);
const renderer = createRenderer(canvas);
const audio = createAudio();

window.__game = world;
window.__shotReady = false;

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    // The title shot needs the live save-slot list, not null, so the staged
    // saves actually show on the title screen.
    renderer.draw(world, scene.screen, world.listSlots());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let saveSlots = world.listSlots();
  let accumulator = 0;
  let last = performance.now();

  function announce(message) { status.textContent = message; }

  function latestSlot() {
    let best = null;
    for (const entry of saveSlots) {
      if (entry.data && (!best || entry.data.savedAt > best.data.savedAt)) best = entry;
    }
    return best;
  }

  function startGame(slot, fresh) {
    audio.unlock();
    world.reset();
    if (!fresh) {
      const entry = slot ? saveSlots.find((e) => e.slot === slot) : latestSlot();
      if (entry && entry.data) {
        world.applySave(entry.data, entry.slot);
        announce(`Continuing slot ${entry.slot} — ${entry.data.missionsDone}/9 jobs done.`);
      }
    } else {
      world.state.slot = slot || 1;
      announce('New game. Steal a car and follow the mission marker.');
    }
    accumulator = 0;
    screen = SCREEN_PLAY;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    // Mouse aim, in world coordinates, before the world steps.
    const mouseWorld = renderer.worldFromScreen(input.mouse.x, input.mouse.y, world.state.camera);
    world.state.player.aimX = mouseWorld.x;
    world.state.player.aimY = mouseWorld.y;
    const actions = input.takeActions();
    if (screen === SCREEN_TITLE) {
      if (actions & ACTION_SLOT_1) startGame(1, false);
      else if (actions & ACTION_SLOT_2) startGame(2, false);
      else if (actions & ACTION_SLOT_3) startGame(3, false);
      else if (actions & ACTION_NEW_GAME) startGame(1, true);
      else if (actions & ACTION_CONFIRM) startGame(null, !latestSlot());
      else if (input.takeClick()) startGame(null, !latestSlot());
    } else if (screen === SCREEN_BUSTED) {
      if (actions & ACTION_CONFIRM) { screen = SCREEN_PLAY; world.state.gameOver = false; }
    } else if (screen === SCREEN_PLAY) {
      if (actions & ACTION_PAUSE) { screen = SCREEN_PAUSED; announce('Paused.'); }
    } else if (screen === SCREEN_PAUSED) {
      if (actions & (ACTION_PAUSE | ACTION_CONFIRM)) { screen = SCREEN_PLAY; announce('Playing.'); }
    }
    if (input.down('KeyM') && !frame.mPressed) { audio.toggleMusic(); frame.mPressed = true; }
    if (!input.down('KeyM')) frame.mPressed = false;
    if (actions & ACTION_RADIO && screen === SCREEN_PLAY) {
      // The world step already switched the station and announced it; this
      // just keeps the audio in step with the radio state.
      audio.setStation(world.radio.index);
    }
    // A failed mission can be retried from the banner: Space, Enter or a
    // click while the banner says FAILED restarts that job.
    if (screen === SCREEN_PLAY && world.missions.failed && ((actions & ACTION_CONFIRM) || input.takeClick())) {
      world.missions.retry();
      announce(`Retrying ${world.missions.current().title}.`);
    }

    if (screen === SCREEN_PLAY) {
      accumulator += dt;
      // The frame already took this frame's one-shot presses; hand the car /
      // reload / punch / radio bits to the first world step so they are not lost.
      let pendingActions = actions;
      while (accumulator >= STEP) {
        const events = world.step(STEP, input, audio, pendingActions);
        pendingActions = 0;
        accumulator -= STEP;
        if (events & (EVENT_BUSTED | EVENT_WASTED)) {
          world.state.gameOver = events & EVENT_BUSTED ? 'busted' : 'wasted';
          screen = SCREEN_BUSTED;
          audio.busted();
          announce(world.state.message);
          break;
        }
        if (world.missions.allDone() && !world.state.storyAnnounced) {
          world.state.storyAnnounced = true;
          announce('Story complete! Free roam — Solara Bay is yours.');
        }
      }
    } else if (screen === SCREEN_TITLE) {
      // The title screen lives over a city that keeps moving.
      accumulator += dt;
      while (accumulator >= STEP) {
        world.step(STEP, {
          mouse: { x: 0, y: 0, down: false },
          down: () => false,
          moveVector: () => ({ x: 0, y: 0 }),
          takeActions: () => 0,
          takeClick: () => false,
        }, audio);
        accumulator -= STEP;
      }
      // Refresh the slot list so the title always shows the newest saves.
      saveSlots = world.listSlots();
    } else {
      accumulator = 0;
    }
    renderer.draw(world, screen, saveSlots);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Solara Bay. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
