export function parseIntent(prompt = '') {
  const p = prompt.toLowerCase();
  const roles = new Set(['drums', 'bass', 'piano']);
  if (/string|strings|violin|כינור|כינורות/.test(p)) roles.add('strings');
  if (/guitar|גיטרה/.test(p)) roles.add('guitar');
  if (/choir|choirs|מקהלה/.test(p)) roles.add('choir');

  const keyMatch = prompt.match(/\b([A-G](?:#|b)?m?)\b/);
  const bpmMatch = prompt.match(/(\d{2,3})\s*BPM/i);

  return {
    kind: 'intent',
    prompt,
    key: keyMatch?.[1] || 'Bm',
    bpm: bpmMatch ? Number(bpmMatch[1]) : 90,
    mood: /wide|רחב|גדול/.test(p) ? 'wide emotional' : 'human-directed',
    density: /simple|פשוט|מעט|רגוע/.test(p) ? 'low-to-medium' : 'medium',
    roles: [...roles],
    sections: ['intro', 'verse', 'chorus', 'bridge', 'final_chorus']
  };
}
