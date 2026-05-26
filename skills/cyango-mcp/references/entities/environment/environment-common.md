# Environment entities

| Type | Payload | Key fields |
|------|---------|------------|
| `SKYBOX` | `skybox?: IAnimation<IEntitySkybox>` | Procedural sky — sun angles, `rayleigh`, `mieCoefficient`, `turbidity`, `distance`. Often paired with `DIRECTIONAL_LIGHT` for shadows. |
| `HDR` | `hdr?: IEntityEnvironment` | HDRI environment map — `backgroundIntensity`, `environmentIntensity`, rotations, `blur`, `ground` block. Asset supplies a `.hdr` or `.exr` environment texture (`AssetCategories.HDR`). |

Both are usually large/infinite-scale; transform may be minimal or used for rotation.
