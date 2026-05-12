export function createMixProfile({ target = 'streaming-ready', vocal = 'clear', lowEnd = 'warm' } = {}) {
  return {
    kind: 'mix-profile',
    target,
    vocal,
    lowEnd,
    reverb: 'controlled',
    width: 'wide-chorus-safe-verse',
    limiter: 'safe-placeholder'
  };
}
