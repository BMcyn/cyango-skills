# Audio entities

Both audio types use **`media?: IAnimation<IMediaClip>`** for the clip (file, trim, volume, loop). Playback is controlled with entity media actions (`PLAY_ENTITY_MEDIA`, `PAUSE_ENTITY_MEDIA`, `STOP_ENTITY_MEDIA`, `MUTE_ENTITY_MEDIA`, `UNMUTE_ENTITY_MEDIA`).

| Type | Role | Extra fields |
|------|------|-------------|
| `AUDIO_GLOBAL` | Stereo / non-spatial audio (music, VO bed). | `media` only — no spatial attenuation. |
| `AUDIO_POSITIONAL` | 3D positional audio with distance falloff. | `audio3D.currentValue` — `distance`, `rolloffFactor`, `reverb`, `echo`, `noise`. `position` is the emitter. |
