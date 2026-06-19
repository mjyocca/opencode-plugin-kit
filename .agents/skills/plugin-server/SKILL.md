---
name: plugin-server
description: Use ONLY when developing opencode server plugins. Covers hook registration, tool definitions, event handling, plugin lifecycle, and SDK patterns. Use when editing src/index.ts or adding server-side plugin functionality.
---

# Server Plugin Development

For the complete opencode plugin architecture reference, see `docs/instructions/opencode-plugin-architecture.md`.

## Plugin Entry Point

A plugin module exports a `Plugin` function that returns hooks:

```ts
import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ client, project, directory, worktree, $ }) => {
  return {
    dispose: async () => { /* cleanup */ },
    tool: { myTool: myToolDef },
    event: async ({ event }) => { /* handle events */ },
  }
}

export default MyPlugin
```

### Context Parameters

| Parameter | Description |
|-----------|-------------|
| `client` | Opencode SDK client for sessions, files, TUI, auth |
| `project` | Current project identifier (string or null) |
| `directory` | Current working directory |
| `worktree` | Git worktree path (string or null) |
| `$` | Bun shell API for executing commands |

## Available Hooks

| Hook | Purpose |
|------|---------|
| `dispose` | Lifecycle cleanup when plugin is unloaded |
| `event({ event })` | Every bus event (see full event list below) |
| `config(cfg)` | Called once on init with merged config |
| `chat.message` | Transform message before sending to model |
| `chat.params` | Transform request parameters (model, temperature, etc.) |
| `chat.headers` | Add or modify HTTP headers for the request |
| `tool.execute.before` | Runs before any tool executes |
| `tool.execute.after` | Runs after any tool executes |
| `tool.definition` | Transform a tool's definition |
| `command.execute.before` | Runs before a slash command executes |
| `shell.env` | Inject environment variables into shell execution |
| `permission.asked` | Intercept permission requests |
| `permission.replied` | Runs after a permission decision is made |
| `experimental.session.compacting` | Inject context into compaction prompt or replace it |

## Defining Tools

```ts
const myTool = tool({
  description: "What this tool does.",
  args: {
    // zod schema for arguments
  },
  execute: async (args) => {
    return {
      title: "Tool Result Title",
      output: "Markdown output",
    }
  },
})
```

Register in the plugin return:
```ts
return {
  tool: { myTool },
}
```

## Event Handling

```ts
event: async ({ event }) => {
  if (event.type !== "session.idle") return

  const sessionId = event.properties?.sessionID
  if (!sessionId) return

  // Fetch session messages
  const resp = await client.session.messages({ path: { id: sessionId } })
  const messages = resp.data ?? []

  // Process messages...
}
```

## All Events

### Session Events

| Event | Properties |
|-------|------------|
| `session.created` | `info` (Session object) |
| `session.updated` | `info` (Session object) |
| `session.idle` | `sessionID` |
| `session.deleted` | `sessionID` |
| `session.compacted` | `sessionID` |
| `session.error` | `sessionID` |
| `session.status` | `sessionID` |
| `session.diff` | `sessionID` |

### Message Events

| Event | Properties |
|-------|------------|
| `message.updated` | `info.sessionID`, `info.id`, `info.role`, `info.tokens`, `info.cost` |
| `message.removed` | `sessionID`, `messageID` |
| `message.part.updated` | `info.sessionID`, `info.id` |
| `message.part.removed` | — |

### Tool Events

| Event | Properties |
|-------|------------|
| `tool.execute.before` | `input.tool`, `input.args`, `output.args` |
| `tool.execute.after` | `input.tool`, `output.result` |

### Permission Events

| Event | Properties |
|-------|------------|
| `permission.asked` | `tool` |
| `permission.replied` | `tool`, `response` |

### Other Events

| Event | Properties |
|-------|------------|
| `todo.updated` | `sessionID` |
| `file.edited` | — |
| `file.watcher.updated` | — |
| `lsp.updated` | — |
| `lsp.client.diagnostics` | — |
| `command.executed` | — |
| `installation.updated` | — |
| `server.connected` | — |
| `tui.prompt.append` | — |
| `tui.command.execute` | — |
| `tui.toast.show` | — |
| `shell.env` | `input.cwd`, `output.env` |

## Client API

| Method | Purpose |
|--------|---------|
| `client.session.messages({ path: { id } })` | Get session messages |
| `client.config.providers()` | Get provider catalog (for pricing) |
| `client.tui.showToast({ body: { message, variant } })` | Show toast notification |
| `client.app.log({ level, message })` | Log to opencode |

## Toast Notifications

```ts
client.tui.showToast({
  body: {
    message: "Your message here",
    variant: "info" | "success" | "warning" | "error",
    duration?: 9000, // milliseconds
    title?: "Optional title",
  },
}).catch(() => {})
```

Toasts are **non-blocking** — always `.catch(() => {})` to prevent unhandled rejections.

## Logging

Use `process.stderr.write`, not `console.log`:

```ts
const DEBUG = process.env.DEBUG_MY_PLUGIN === "1"

const log = {
  info:  (msg: string) => { process.stderr.write(`[my-plugin] ${msg}\n`) },
  warn:  (msg: string) => { process.stderr.write(`[my-plugin] WARN: ${msg}\n`) },
  error: (msg: string) => { process.stderr.write(`[my-plugin] ERROR: ${msg}\n`) },
  debug: (msg: string) => { if (DEBUG) process.stderr.write(`[my-plugin] DEBUG: ${msg}\n`) },
}
```

## Config Loading

```ts
import { readFileSync, existsSync } from "fs"
import { homedir } from "os"
import { join } from "path"

function loadConfig(projectDirectory: string) {
  const candidates = [
    join(projectDirectory, ".opencode", "my-plugin.config.json"),
    join(homedir(), ".config", "opencode", "my-plugin.config.json"),
  ]

  for (const configPath of candidates) {
    if (!existsSync(configPath)) continue
    try {
      const raw = readFileSync(configPath, "utf-8")
        .replace(/\/\/[^\n]*/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
      return JSON.parse(raw)
    } catch {}
  }

  return { /* defaults */ }
}
```

## Deduplication Pattern

```ts
const inFlightSessions = new Set<string>()

event: async ({ event }) => {
  if (event.type !== "session.idle") return
  const sessionId = event.properties?.sessionID
  if (!sessionId || inFlightSessions.has(sessionId)) return
  inFlightSessions.add(sessionId)

  try {
    // process...
  } finally {
    inFlightSessions.delete(sessionId)
  }
}
```

## Atomic File Writes

```ts
import { writeFileSync } from "fs"

async function atomicWrite(path: string, data: object) {
  const tmpPath = path + ".tmp"
  writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8")
  await rename(tmpPath, path)
}
```
