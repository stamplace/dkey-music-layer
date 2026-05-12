# AI Intent Layer

## Purpose

The AI layer does not replace the human. It translates human musical language into structured production decisions.

## Input examples

- “Make the chorus wider.”
- “Keep the verse low and intimate.”
- “Give me real Hasidic strings.”
- “The bass should support, not dominate.”
- “Export stems and a clean playback version.”

## Output shape

```json
{
  "mood": "wide emotional",
  "density": "medium",
  "key": "Bm",
  "bpm": 90,
  "sections": ["intro", "verse", "chorus"],
  "roles": ["drums", "bass", "piano", "strings", "guitar"]
}
```

## Rule

Every AI decision must be representable as editable project state.

If it cannot be inspected, edited and verified, it is not production-ready.
