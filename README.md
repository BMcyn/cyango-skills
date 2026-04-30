# cyango-skills

Agent skills for the Cyango platform. Install them into any project with a single command.

## Install a skill

```bash
npx @cyango/skills install cyango-mcp
```

This downloads the skill files into `.agents/skills/cyango-mcp/` inside your project. Cursor and other AI agent tools will pick them up automatically.

## Available skills

| Skill | Description |
|-------|-------------|
| `cyango-mcp` | Teaches AI agents how to work with the Cyango MCP live editor — batch tools, entity types, GUI layout, scene hierarchy, and schema-safe values. |

## Adding skills to a project manually

If you prefer not to use the CLI, copy the contents of `skills/<skill-name>/` into `.agents/skills/<skill-name>/` in your project.

## Updating a skill

Re-run the install command — it overwrites the existing files with the latest version:

```bash
npx @cyango/skills install cyango-mcp
```
