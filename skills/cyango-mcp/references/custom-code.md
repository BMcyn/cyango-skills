# Custom Code

Cyango has two different custom-code surfaces. Pick the right one before patching:

| Surface | Stored at | Runtime scope | MCP status |
|---------|-----------|---------------|------------|
| `CUSTOM_CODE` action | Entity `actions.currentValue` or scene `sceneActions` | Receives `cyango` (`storyState`, `uiState`, `timelineState`, `types`, `utils`) | Writable through current MCP tools |
| Story Head/Footer code | `settings.customHeadCode` / `settings.customFooterCode` | No `cyango`; sandbox utilities only | Inspectable with `get_story_state`; current MCP has no story-settings write tool |

## Custom Code actions

Use `CUSTOM_CODE` actions for runtime interactions: click handlers, scene lifecycle hooks, timeline hooks, prefab spawning, state changes, and entity/scene updates during playback.

### Entity action patch

1. Fetch the existing entity first with `get_entity`; preserve unrelated actions.
2. Replace the full `actions.currentValue` array with `update_entities`.
3. Use `eventType` appropriate to the trigger (`ON_CLICK`, `ON_ENTITY_READY`, etc.).

```json
{
  "updates": [
    {
      "entityIds": ["button-entity-id"],
      "propertyPath": "actions.currentValue",
      "value": [
        {
          "id": "custom-code-open-url",
          "name": "Open docs from code",
          "type": "CUSTOM_CODE",
          "eventType": "ON_CLICK",
          "customCode": {
            "code": "cyango.uiState.openUrl('https://example.com');",
            "errorMessages": []
          }
        }
      ]
    }
  ]
}
```

### Scene action patch

Use `update_scenes` with `propertyPath: "sceneActions"` and replace the full scene action array.

```json
{
  "updates": [
    {
      "sceneIds": ["scene-id"],
      "propertyPath": "sceneActions",
      "value": [
        {
          "id": "custom-code-scene-ready",
          "name": "Scene ready code",
          "type": "CUSTOM_CODE",
          "eventType": "ON_SCENE_READY",
          "customCode": {
            "code": "console.log('Scene ready', cyango.storyState.activeSceneId);",
            "errorMessages": []
          }
        }
      ]
    }
  ]
}
```

### Language and runtime syntax

Custom Code action `code` is written as **JavaScript executed inside an async function body**:

- Top-level `await` works because the runtime wraps the snippet in an async IIFE.
- `return` is valid and exits the snippet.
- Write statements, not a module. Do not use static `import` / `export`.
- Do not use JSX or React component syntax.
- Prefer plain ES2020 JavaScript when possible.

Limited TypeScript syntax is supported for `CUSTOM_CODE` actions only:

- The action runtime transpiles the code when it detects `: Type`, `interface`, or `type Foo`.
- Safe TS-only syntax: simple type annotations, interfaces, and type aliases.
- Do not rely on TS features that need module processing or imports. Runtime values must come from `cyango`, `console`, timers, literals, or values you define in the snippet.
- Head/Footer code does **not** go through this TypeScript transpile path; write Head/Footer snippets as runnable JavaScript.

The editor's Monaco field exposes type hints for `cyango`, but those are compile-time hints only. At runtime, `cyango` is an injected object for `CUSTOM_CODE` actions; it is not imported.

### Runtime scope

Custom Code actions run in the story player sandbox. They can use:

- `cyango.storyState`: `activeStoryJson`, `activeSceneId`, `activeLanguage`, `setActiveScene`, `triggerAction`, `updateStoryData`, `instantiatePrefab`, XR helpers, asset helpers.
- `cyango.uiState`: loading/camera/breakpoint state, `openUrl`, system modal helpers.
- `cyango.timelineState`: timeline mode, elapsed time, mute state, media controls.
- `cyango.types`: enums such as `ActionType`, `EventType`, `EntityTypes`, `SceneTypes`, `PlayingModes`.
- `cyango.utils`: `getEntityById`, `getEntityByName`, `getActiveScene`, `thisEntity`, `globalVars`, `setGlobalVar`, `getGlobalVar`, GUI scroll helpers, `instantiatePrefab`, `detectDeviceType`, `detectBrowser`, `getWindowLocation`, `getNavigator`.

### Sandbox globals and blocked browser APIs

Available globals:

- `cyango` for `CUSTOM_CODE` actions only.
- `console.log`, `console.warn`, `console.error`, `console.info`; output is namespaced as `[plugin> custom-code]`.
- `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval`; delays are capped at 60000 ms.
- Locals, functions, classes, arrays, objects, promises, and normal JavaScript built-ins.

Shadowed/blocked globals:

- `window`
- `document`
- `sessionStorage`
- `location`
- `navigator`
- `history`
- `XMLHttpRequest`
- `WebSocket`
- `eval`
- `Function`
- `globalThis`
- `self`

Use the exposed helpers instead of blocked globals:

- Use `cyango.utils.getNavigator()` instead of `navigator`.
- Use `cyango.utils.getWindowLocation()` instead of `location`.
- There is no direct `document` replacement; if the task needs DOM manipulation, explain that this sandbox is not intended for direct DOM access.

Current runtime does not shadow `fetch` or `localStorage`, but do not rely on them unless the user explicitly needs that behavior; prefer Cyango state/actions/helpers for story interactions.

### Common snippets

Set a persistent runtime variable:

```js
const count = (cyango.utils.getGlobalVar('count') ?? 0) + 1;
cyango.utils.setGlobalVar('count', count);
console.log('count', count);
```

Change scene:

```js
cyango.storyState.setActiveScene('target-scene-id');
```

Patch story data at runtime:

```js
cyango.storyState.updateStoryData([
  {
    type: 'entities',
    entityIds: ['entity-id'],
    propertyPath: 'visible.currentValue',
    value: false
  }
]);
```

Instantiate a prefab from code:

```js
cyango.utils.instantiatePrefab({
  prefabId: 'prefab-id',
  sceneId: cyango.storyState.activeSceneId
});
```

If code calls `instantiatePrefab()`, make sure the prefab is bundled in the story:

- Prefabs referenced by normal `INSTANTIATE_PREFAB` actions are included automatically.
- Prefabs referenced only by custom code must be present in `settings.options.customCodePrefabIds` so `storyJson.prefabs` keeps a snapshot.
- Current MCP can instantiate an existing story prefab with `instantiate_prefab`, but it cannot currently edit `settings.options.customCodePrefabIds` because that is a story-settings patch.

## Story Head/Footer code

Use Head/Footer code for story-wide script-style setup such as analytics or third-party bootstrapping.

Storage shape:

```json
{
  "settings": {
    "customHeadCode": {
      "code": "console.log('head init');",
      "errorMessages": []
    },
    "customFooterCode": {
      "code": "console.log('footer init');",
      "errorMessages": []
    }
  }
}
```

Runtime behavior:

- `customHeadCode.code` runs when the story head component applies custom head code.
- `customFooterCode.code` runs when the story footer component applies custom footer code.
- These snippets are evaluated by the same sandbox helper but **without** the `cyango` namespace. Do not use `cyango.storyState`, `cyango.utils`, entity IDs, scene actions, or prefab APIs here.
- Direct browser globals are blocked. `console`, safe `setTimeout` / `setInterval`, and the code's own local variables are available.

Current MCP limitation:

- The enabled MCP tools expose `get_story_state`, `update_entities`, and `update_scenes`, but no story-level update command.
- Therefore an MCP agent can inspect existing Head/Footer code with `get_story_state`, but should not claim it has patched Head/Footer code through `update_scenes` or `update_entities`.
- If the MCP server later adds a story-settings patch tool, write these as full values at `settings.customHeadCode` and `settings.customFooterCode` with `{ "code": "...", "errorMessages": [] }`.

## Verification

After writing Custom Code actions:

1. Use `get_entity` or `get_scene` to verify the action array contains the new action and preserved existing actions.
2. Use `capture_screenshot` only for visible scene/GUI effects; custom-code errors are usually visible in the browser console, not the screenshot.
3. If the user asks to persist the story, call `save_story` only after explicit save permission.

