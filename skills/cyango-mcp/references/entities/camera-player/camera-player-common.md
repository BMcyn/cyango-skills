# Camera, player, webcam & face entities

| Type | Payload | Key fields |
|------|---------|------------|
| `CAMERA` | `camera?: IAnimation<IEntityCamera>` | `type` (perspective/orthographic), `fov`, `near`, `far`, `controls` (`ICameraControls` — orbit, damping, targets). Pairs with `CAMERA_LOOK_AT` actions. |
| `PLAYER` | `player?: IAnimation<IEntityPlayer>` | `PlayerType` (`FIRST_PERSON`, `THIRD_PERSON`, `FREE_CAMERA`), height, radius, jump, `wasd`/`joystick`/`xrLocomotion` speeds, `physics`. One per scene typical. |
| `WEBCAM` | `webcam?: IEntityWebcam` | `cameraFacingUser`, `mirrored`. Used in `WEBCAM_SCENE`. |
| `FACE_MESH` | *(transform follows AR face anchor)* | Face-tracking mesh overlay. Product-specific blend shapes — use `get_entity` for extra keys. Used in `FACE_TRACKING_SCENE`. |
