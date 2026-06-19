# opencode-plugin-tui

Scaffold template for building [opencode](https://opencode.ai) plugins with server and TUI support.

## Features

- **Server plugin** — hooks, tools, event handling via `@opencode-ai/plugin` SDK
- **TUI plugin** — JSX-based terminal UI with slot renderers via `@opentui/solid`
- **Single package** — unified `package.json` with exports for both server and TUI
- **pnpm workspace** — ready for future expansion
- **TypeScript** — strict mode, proper type declarations

## Quick Start

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Watch mode
pnpm run dev

# Type-check
pnpm run build:check
```

## Usage

### As a local server plugin

In your `opencode.json`:

```json
{
  "plugin": [
    "/path/to/opencode-plugin-tui/dist/index.js"
  ]
}
```

### As a TUI plugin

In `~/.config/opencode/tui.json`:

```json
["/path/to/opencode-plugin-tui"]
```

### From npm

```json
{
  "plugin": [
    "opencode-plugin-tui"
  ]
}
```

## Project Structure

```
opencode-plugin-tui/
├── src/
│   ├── index.ts          # Server plugin
│   └── tui.tsx           # TUI plugin
├── scripts/
│   └── build-tui.mjs     # TUI build script
├── dist/                 # Build output
├── .agents/skills/       # Development skills
│   ├── plugin-server/SKILL.md
│   └── plugin-tui/SKILL.md
├── package.json
├── tsconfig.json
└── AGENTS.md
```

## Exports

| Path | File | Purpose |
|------|------|---------|
| `.` | `dist/index.js` | Server plugin |
| `./server` | `dist/index.js` | Server plugin (explicit) |
| `./tui` | `dist/tui.tsx` | TUI plugin |

## Development

See [AGENTS.md](./AGENTS.md) for the full development workflow, conventions, and troubleshooting guide.

## License

MIT
