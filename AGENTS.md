# opencode-plugin-tui — Agent Harness

## What This Is

A scaffold template for building opencode plugins with **server** (SDK hooks, tools, events) and **TUI** (JSX-based terminal UI) support. Use this as a starting point for any new plugin idea.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Build
pnpm run build

# 3. Type-check without emitting
pnpm run build:check

# 4. Watch mode during development
pnpm run dev
```

## Project Structure

```
opencode-plugin-tui/
├── src/
│   ├── index.ts          # Server plugin — hooks, tools, events
│   └── tui.tsx           # TUI plugin — JSX slot renderers
├── docs/
│   └── instructions/
│       └── opencode-plugin-architecture.md  # Comprehensive opencode reference
├── scripts/
│   └── build-tui.mjs     # Copies tui.tsx → dist/tui.tsx (no compilation)
├── dist/                 # Build output
├── package.json          # Single package, exports for . /server /tui
├── tsconfig.json         # jsx: "preserve" (required for TUI runtime)
├── .agents/skills/       # Agent skills for development guidance
│   ├── plugin-server/SKILL.md
│   ├── plugin-tui/SKILL.md
│   ├── opencode-agents/SKILL.md
│   └── opencode-troubleshooting/SKILL.md
└── AGENTS.md             # This file
```

## Exports

| Export Path | File | Purpose |
|-------------|------|---------|
| `.` | `dist/index.js` | Server plugin (default) |
| `./server` | `dist/index.js` | Server plugin (explicit) |
| `./tui` | `dist/tui.tsx` | TUI plugin (raw TSX, not compiled) |

## Installing in opencode

### As a local plugin

Add to your `opencode.json`:

```json
{
  "plugin": [
    "/absolute/path/to/opencode-plugin-tui/dist/index.js"
  ]
}
```

### As a TUI plugin

Add to `~/.config/opencode/tui.json`:

```json
["/absolute/path/to/opencode-plugin-tui"]
```

The TUI runtime loads `index.tsx` from the `dist/` directory.

### From npm (after publishing)

```json
{
  "plugin": [
    "opencode-plugin-tui"
  ]
}
```

## Development Workflow

### Server Plugin

1. Edit `src/index.ts`
2. `pnpm run build` (or `pnpm run dev` for watch)
3. Restart opencode to pick up changes

### TUI Plugin

1. Edit `src/tui.tsx`
2. `pnpm run build` (copies `.tsx` to `dist/`)
3. Restart opencode TUI to pick up changes

### Debug Logging

Server plugin:
```bash
DEBUG_PLUGIN_TUI=1 opencode
```

TUI plugin — use `process.stderr.write`:
```ts
process.stderr.write("[opencode-plugin-tui] message\n")
```

Filter logs:
```bash
opencode --log-level DEBUG --print-logs 2>&1 | grep "opencode-plugin-tui"
```

## Key Conventions

### Server Plugin (`src/index.ts`)

- Export a `Plugin` function (not a plain object)
- Use `tool()` from `@opencode-ai/plugin` to define tools
- Register event handlers via the returned hooks object
- Log via `process.stderr.write`, not `console.log`
- Context params: `client`, `project`, `directory`, `worktree`, `$` (Bun shell)

### TUI Plugin (`src/tui.tsx`)

- **Must** start with `/** @jsxImportSource @opentui/solid */`
- **Must** use `.tsx` extension (not `.js` or `.jsx`)
- `tsconfig.json` must have `"jsx": "preserve"`
- Do **not** import types from `@opencode-ai/plugin/tui` (breaks loading)
- Use `api: any` instead of typed imports
- Use `readFileSync`/`existsSync` from `fs` for file access (sandboxed API)
- Register slots via `api.slots.register({ order, slots })`
- Clean up via `api.lifecycle.onDispose()`

### TUI Quick Reference

- **Slots:** `sidebar_content`, `home_bottom`, `home_footer`, `session_prompt`, `app_bottom`
- **Components:** `<box>`, `<text>`, `<scrollbox>`, `<Slider>`, `<Show>`, `<Markdown>`
- **Theme:** `api.theme.current.text`, `.textMuted`, `.error`, `.warning`

For the complete list of hooks, events, slots, and components, see the [architecture reference](./docs/instructions/opencode-plugin-architecture.md).

## Export Stubs

`src/index.ts` includes commented stubs for all available hooks and events. Uncomment and implement the hooks you need:

- **Lifecycle:** `dispose`
- **Tools:** `tool` map
- **Config:** `config(cfg)`
- **Chat pipeline:** `chat.message`, `chat.params`, `chat.headers`
- **Tool lifecycle:** `tool.execute.before`, `tool.execute.after`, `tool.definition`
- **Command:** `command.execute.before`
- **Shell:** `shell.env`
- **Permission:** `permission.asked`, `permission.replied`
- **Compaction:** `experimental.session.compacting`
- **Events:** 22+ event types across session, message, tool, file, LSP, TUI, and more categories

See the [architecture reference](./docs/instructions/opencode-plugin-architecture.md) for detailed documentation on each hook and event.

## Available Skills

| Skill | When to Use |
|-------|-------------|
| `plugin-server` | Developing server plugins — hook registration, tool definitions, event handling |
| `plugin-tui` | Developing TUI plugins — slot registration, JSX components, SolidJS signals |
| `opencode-agents` | Configuring or creating agents — permissions, subagents, agent options |
| `opencode-troubleshooting` | Debugging issues — plugin loading, TUI problems, config resolution |

Skills are loaded automatically. Agents discover them via the `skill` tool and load context on demand.

## OpenCode Reference

For detailed information about opencode plugin architecture, hooks, events, SDK, server API, TUI components, config system, agents, and skills:

- **[OpenCode Plugin Architecture](./docs/instructions/opencode-plugin-architecture.md)** — comprehensive reference covering all opencode plugin development topics

## Known Gotchas

1. **TUI file must be `.tsx`** — the runtime looks for this extension specifically
2. **`jsx: "preserve"` is required** — JSX must not be compiled away
3. **`api.client.file.read()` is sandboxed** — use Node `fs` directly for files outside workspace
4. **Don't import from `@opencode-ai/plugin/tui`** — causes silent load failures
5. **`api.keymap.registerLayer` may break loading** — untested API surface
6. **`session_id` in slot props must be optional** — non-session slots don't have it
7. **Toast notifications are non-blocking** — don't await them in event handlers

## Spec-Driven Development

For non-trivial features, follow this workflow:

```
spec draft → review → implementation → spec reconciliation → merge
```

Create feature specs in a `specs/features/` directory using the pattern:
- `specs/features/0001-feature-name.md`

Trivial fixes (typos, copy changes) don't need a spec. If a reviewer would ask "why did we do it this way?" six months from now, it needs a spec.

## Publishing

```bash
pnpm run build:check && pnpm run build
pnpm publish --access public
```

The `prepublishOnly` script runs automatically before publish.
