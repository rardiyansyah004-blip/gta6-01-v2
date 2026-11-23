// A small seeded random source (mulberry32). One seed always builds the
// same city and the same traffic, which is what makes staged screenshots
// reproducible from one run to the next.
export function createRandom(seed) {
  let state = seed >>> 0;
  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return {
    next,
    int(min, max) { return min + Math.floor(next() * (max - min + 1)); },
    range(min, max) { return min + next() * (max - min); },
    pick(list) { return list[Math.floor(next() * list.length)]; },
    chance(p) { return next() < p; },
  };
}
