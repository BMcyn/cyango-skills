# Environment entities

| Type | Payload | Key fields |
|------|---------|------------|
| `SKYBOX` | `skybox?: IAnimation<IEntitySkybox>` | Procedural sky — sun angles, `rayleigh`, `mieCoefficient`, `turbidity`, `distance`. Often paired with `DIRECTIONAL_LIGHT` for shadows. |
| `HDR` | `hdr?: IEntityEnvironment` | HDRI environment map — `backgroundIntensity`, `environmentIntensity`, rotations, `blur`, `ground` block. Asset supplies the `.hdr` texture. |

Both are usually large/infinite-scale; transform may be minimal or used for rotation.

---

## MCP defaults (create path)

| Entity | MCP merge behavior |
|--------|-------------------|
| **`SKYBOX`** | **`skybox.currentValue`** is deep-merged with `{ distance: 4000 }`. Caller keys (e.g. `turbidity`, `rayleigh`, sun angles) override defaults. |
| **`HDR`** | Plain **`hdr`** object merged with defaults: `background: false`, `backgroundBlurriness: 0`, `backgroundIntensity: 1`, `environmentIntensity: 1`. Caller fields win. |
