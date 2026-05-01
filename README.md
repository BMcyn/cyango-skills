# cyango-skills

Agent skills for the Cyango platform. Install them into any project with a single command.

## Install a skill

```bash
npx @cyango-tools/skills@latest install cyango-mcp
```

This copies the skill from **inside the npm package** into `.agents/skills/cyango-mcp/` in your project. There is **no** clone from GitHub — only what ships in `@cyango-tools/skills` on npm. Cursor and other agent tools pick up `.agents/skills/` automatically.

## Available skills

| Skill | Description |
|-------|-------------|
| `cyango-mcp` | Teaches AI agents how to work with the Cyango MCP live editor — plural/batched write tools, entity types, GUI layout, scene hierarchy, schema-safe values, bridge status, patch validation, and prefab instantiation. |

## Adding skills to a project manually

If you prefer not to use the CLI, copy the contents of `skills/<skill-name>/` into `.agents/skills/<skill-name>/` in your project.

## Updating a skill

The CLI copies only from the **installed npm package** (`skills/<name>/` in the tarball). It does **not** pull from GitHub. Re-run install to overwrite `.agents/skills/`:

```bash
npx @cyango-tools/skills@latest install cyango-mcp
```

Use `@latest` (or a pinned version) so `npx` does not keep an old cached tarball of the CLI.

## Publishing to npm

This package uses scope **`@cyango-tools/skills`** (same org as **`@cyango-tools/mcp-server`** on npmjs). The repo `.npmrc` sends **`@cyango-tools/*`** to **npmjs** and keeps **`@cyango/*`** on Gitea for internal packages, matching the MCP server setup. If a global `~/.npmrc` overrides **`@cyango-tools:registry`**, use the scripts below so the tarball still lands on npmjs.

Use the npm scripts so the tarball always goes to **npmjs**:

```bash
npm run publish:patch   # or publish:minor / publish:major
```

Publish the current version only (no version bump):

```bash
npm run publish:npm
```

If you publish manually, pass both `--registry` and the scope override:

```bash
npm publish --access public --registry https://registry.npmjs.org/ '--@cyango-tools:registry=https://registry.npmjs.org/'
```

Log in when needed: `npm login --registry https://registry.npmjs.org/`.
