// Keyboard + mouse, read fresh every frame. Keys are tracked by code so
// keyboard layouts do not matter; the mouse aim is kept in world
// coordinates by the caller (main.js converts it before the world steps).
export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_ENTER_CAR = 4;
export const ACTION_RELOAD = 8;
export const ACTION_PUNCH = 16;
export const ACTION_RADIO = 32;
export const ACTION_NEW_GAME = 64;
export const ACTION_SLOT_1 = 128;
export const ACTION_SLOT_2 = 256;
export const ACTION_SLOT_3 = 512;

export function createInput(canvas) {
  const keys = new Set();
  const actions = { bits: 0 };
  const mouse = { x: 0, y: 0, down: false, clicked: false, rightDown: false };

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    keys.add(event.code);
    if (event.code === 'Space' || event.code === 'Enter') actions.bits |= ACTION_CONFIRM;
    if (event.code === 'KeyP' || event.code === 'Escape') actions.bits |= ACTION_PAUSE;
    if (event.code === 'KeyE') actions.bits |= ACTION_ENTER_CAR;
    if (event.code === 'KeyR') actions.bits |= ACTION_RELOAD;
    if (event.code === 'KeyF') actions.bits |= ACTION_PUNCH;
    if (event.code === 'KeyQ') actions.bits |= ACTION_RADIO;
    if (event.code === 'KeyN') actions.bits |= ACTION_NEW_GAME;
    if (event.code === 'Digit1') actions.bits |= ACTION_SLOT_1;
    if (event.code === 'Digit2') actions.bits |= ACTION_SLOT_2;
    if (event.code === 'Digit3') actions.bits |= ACTION_SLOT_3;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));
  window.addEventListener('blur', () => keys.clear());

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });
  canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { mouse.down = true; mouse.clicked = true; }
    if (event.button === 2) mouse.rightDown = true;
  });
  window.addEventListener('mouseup', (event) => {
    if (event.button === 0) mouse.down = false;
    if (event.button === 2) mouse.rightDown = false;
  });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  return {
    mouse,
    down(code) { return keys.has(code); },
    // WASD / arrows as a normalised -1..1 pair.
    moveVector() {
      let x = 0; let y = 0;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) y -= 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) y += 1;
      if (x !== 0 && y !== 0) { x *= Math.SQRT1_2; y *= Math.SQRT1_2; }
      return { x, y };
    },
    takeActions() {
      const bits = actions.bits;
      actions.bits = 0;
      return bits;
    },
    takeClick() {
      const clicked = mouse.clicked;
      mouse.clicked = false;
      return clicked;
    },
  };
}
