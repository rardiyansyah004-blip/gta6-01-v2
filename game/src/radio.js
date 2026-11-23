// The car radio: three switchable stations, Q to change. Each station is
// just a name, a bass line and a lead pattern — the synth in audio.js plays
// them, and the HUD shows which one is on. No audio files, no network.
import { RADIO_STATIONS } from './config.js';

export function createRadio() {
  let index = 0;
  let on = true;

  function current() { return RADIO_STATIONS[index]; }

  function next() {
    index = (index + 1) % RADIO_STATIONS.length;
    return current();
  }

  function toggle() {
    on = !on;
    return on;
  }

  return {
    get index() { return index; },
    set index(v) { index = v % RADIO_STATIONS.length; },
    get on() { return on; },
    current, next, toggle,
    label() { return on ? `${current().name} — ${current().tag}` : 'RADIO OFF'; },
  };
}
