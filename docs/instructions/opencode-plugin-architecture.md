# OpenCode Plugin Architecture

Comprehensive reference for building opencode plugins. Covers server plugins, TUI plugins, SDK client, server API, config system, agents, and skills.

---

## Plugin System Overview

Plugins are JavaScript/TypeScript modules that extend opencode by hooking into events and customizing behavior.

### Installation Methods

| Method | Location | Notes |
|--------|----------|-------|
| Local files | `.opencode/plugins/` (project) | Automatically loaded at startup |
| Local files | `~/.config/opencode/plugins/` (global) | Automatically loaded at startup |
| npm packages | `opencode.json` → `"plugin"` array | Cached in `~/.cache/opencode/node_modules/` |
| TUI plugins | `~/.config/opencode/tui.json` | Array of paths or package names |

### Load Order

1. Global config (`~/.config/opencode/opencode.json`)
2. Project config (`opencode.json`)
3. Global plugin directory (`~/.config/opencode/plugins/`)
4. Project plugin directory (`.opencode/plugins/`)

Duplicate npm packages (same name + version) load once. Local and npm plugins with similar names both load separately.

### Dependencies

Add a `package.json` to your config directory for local plugins that need external packages:

```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

Opencode runs `bun install` at startup.

---

## Server Plugin Architecture

### Entry Point Pattern

A plugin is a JS/TS module that exports one or more plugin functions. Each function receives a context object and returns a hooks object.

```ts
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ client, project, directory, worktree, $ }) => {
  return {
    // Hook implementations go here
  }
}

export default MyPlugin
```

### Context Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `client` | Opencode SDK client | Interact with the AI — sessions, files, TUI, auth |
| `project` | string \| null | Current project identifier |
| `directory` | string | Current working directory |
| `worktree` | string \| null | Git worktree path |
| `$` | Bun shell | Execute commands via Bun's shell API |

### Return Hooks Object

The plugin function returns an object with any combination of these hooks:

| Hook | Purpose |
|------|---------|
| `dispose` | Lifecycle cleanup when plugin is unloaded |
| `tool` | Register custom tools (map of name → tool definition) |
| `event` | Handle any bus event |
| `config` | Called once on init with merged config |
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
| `experimental.session.compacting` | Inject context into compaction prompt |

### Tool Definition Pattern

Use the `tool()` helper from `@opencode-ai/plugin`:

```ts
import { tool } from "@opencode-ai/plugin"

const myTool = tool({
  description: "What this tool does.",
  args: {
    // zod schema for arguments
    // e.g., foo: tool.schema.string()
  },
  async execute(args, context) {
    const { directory, worktree } = context
    return {
      title: "Tool Result",
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

If a plugin tool uses the same name as a built-in tool, the plugin tool takes precedence.

### Logging Pattern

**Recommended:** Use `client.app.log()` for structured logging:

```ts
export const MyPlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",  // debug | info | warn | error
      message: "Plugin initialized",
      extra: { project: "my-project" },  // optional metadata
    },
  })
}
```

**TUI fallback:** In TUI plugins where `client` may not be available, use `process.stderr.write`:

```ts
process.stderr.write("[my-plugin-tui] message\n")
```

Filter logs:

```bash
opencode --log-level DEBUG --print-logs 2>&1 | grep "my-plugin"
```

For complete SDK reference, see [SDK Reference](./sdk-reference.md).

---

## Event Reference

All events available via the `event` hook. Subscribe with `event: async ({ event }) => { ... }`.

### Command Events

| Event | Properties |
|-------|------------|
| `command.executed` | — |

### File Events

| Event | Properties |
|-------|------------|
| `file.edited` | — |
| `file.watcher.updated` | — |

### Installation Events

| Event | Properties |
|-------|------------|
| `installation.updated` | — |

### LSP Events

| Event | Properties |
|-------|------------|
| `lsp.client.diagnostics` | — |
| `lsp.updated` | — |

### Message Events

| Event | Properties |
|-------|------------|
| `message.part.removed` | — |
| `message.part.updated` | `info.sessionID`, `info.id` |
| `message.removed` | `sessionID`, `messageID` |
| `message.updated` | `info.sessionID`, `info.id`, `info.role`, `info.tokens`, `info.cost` |

### Permission Events

| Event | Properties |
|-------|------------|
| `permission.asked` | `tool` |
| `permission.replied` | `tool`, `response` |

### Server Events

| Event | Properties |
|-------|------------|
| `server.connected` | — |

### Session Events

| Event | Properties |
|-------|------------|
| `session.created` | `info` (Session object) |
| `session.compacted` | `sessionID` |
| `session.deleted` | `sessionID` |
| `session.diff` | `sessionID` |
| `session.error` | `sessionID` |
| `session.idle` | `sessionID` |
| `session.status` | `sessionID` |
| `session.updated` | `info` (Session object) |

### Todo Events

| Event | Properties |
|-------|------------|
| `todo.updated` | `sessionID` |

### Shell Events

| Event | Properties |
|-------|------------|
| `shell.env` | `input.cwd`, `output.env` (modifiable) |

### Tool Events

| Event | Properties |
|-------|------------|
| `tool.execute.before` | `input.tool`, `input.args`, `output.args` |
| `tool.execute.after` | `input.tool`, `output.result` |

### TUI Events

| Event | Properties |
|-------|------------|
| `tui.prompt.append` | — |
| `tui.command.execute` | — |
| `tui.toast.show` | — |

---

## SDK Usage Patterns

For the complete SDK reference, see [SDK Reference](./sdk-reference.md).

### Context Injection Without LLM Response

Inject content into a session without triggering the model:

```ts
await client.session.prompt({
  path: { id: sessionID },
  body: {
    noReply: true,
    parts: [{ type: "text", text: "System context here", ignored: true }],
  },
})
```

`ignored: true` keeps the content visible to the user but excludes it from future model context.

### Session Metadata Lookup

Get the current model and provider for a session:

```ts
const session = await client.session.get({ path: { id: sessionID } })
const modelID = session.data?.modelID
const providerID = session.data?.providerID
const isSubagent = !!session.data?.parentID  // subagent sessions have parentID
```

### Toast Notifications

```ts
await client.tui.showToast({
  body: {
    message: "Task completed",
    variant: "info",  // info | success | warning | error
    duration: 9000,   // optional, milliseconds
  },
})
```

---

## SDK Client Reference

This section provides a quick overview of the SDK. For complete API documentation, method signatures, and usage patterns, see [SDK Reference](./sdk-reference.md).

Install: `npm install @opencode-ai/sdk`

### Create Client

```ts
// Start server + client
import { createOpencode } from "@opencode-ai/sdk"
const { client } = await createOpencode()

// Client only (connect to existing server)
import { createOpencodeClient } from "@opencode-ai/sdk"
const client = createOpencodeClient({ baseUrl: "http://localhost:4096" })
```

### Key APIs

#### Global

| Method | Response |
|--------|----------|
| `client.global.health()` | `{ healthy: true, version: string }` |

#### App

| Method | Response |
|--------|----------|
| `client.app.log({ body })` | `boolean` |
| `client.app.agents()` | `Agent[]` |

#### Project

| Method | Response |
|--------|----------|
| `client.project.list()` | `Project[]` |
| `client.project.current()` | `Project` |

#### Config

| Method | Response |
|--------|----------|
| `client.config.get()` | `Config` |
| `client.config.providers()` | `{ providers: Provider[], default: {...} }` |

#### Sessions

| Method | Notes |
|--------|-------|
| `client.session.list()` | Returns `Session[]` |
| `client.session.get({ path })` | Returns `Session` |
| `client.session.create({ body })` | Returns `Session` |
| `client.session.delete({ path })` | Returns `boolean` |
| `client.session.update({ path, body })` | Returns `Session` |
| `client.session.messages({ path })` | Returns `{ info: Message, parts: Part[] }[]` |
| `client.session.prompt({ path, body })` | Sends prompt, returns `AssistantMessage`. Use `body.noReply: true` for context-only |
| `client.session.command({ path, body })` | Execute slash command |
| `client.session.shell({ path, body })` | Run shell command |
| `client.session.abort({ path })` | Abort running session |
| `client.session.share({ path })` | Share session |
| `client.session.unshare({ path })` | Unshare session |
| `client.session.summarize({ path, body })` | Summarize session |
| `client.session.revert({ path, body })` | Revert a message |
| `client.session.unrevert({ path })` | Restore reverted messages |
| `client.session.children({ path })` | List child sessions |
| `client.session.init({ path, body })` | Analy app and create AGENTS.md |
| `client.session.fork({ path, body })` | Fork session at message |

#### Files

| Method | Response |
|--------|----------|
| `client.find.text({ query })` | Array of matches |
| `client.find.files({ query })` | `string[]` paths |
| `client.find.symbols({ query })` | `Symbol[]` |
| `client.file.read({ query })` | `{ type: "raw" \| "patch", content: string }` |
| `client.file.status({ query? })` | `File[]` |

#### TUI

| Method | Response |
|--------|----------|
| `client.tui.appendPrompt({ body })` | `boolean` |
| `client.tui.showToast({ body })` | `boolean` |
| `client.tui.executeCommand({ body })` | `boolean` |
| `client.tui.openHelp()` | `boolean` |
| `client.tui.openSessions()` | `boolean` |
| `client.tui.openThemes()` | `boolean` |
| `client.tui.openModels()` | `boolean` |
| `client.tui.submitPrompt()` | `boolean` |
| `client.tui.clearPrompt()` | `boolean` |

#### Auth

| Method | Response |
|--------|----------|
| `client.auth.set({ path, body })` | `boolean` |

#### Events

| Method | Response |
|--------|----------|
| `client.event.subscribe()` | SSE stream — `for await (const event of events.stream) { ... }` |

### Structured Output

```ts
const result = await client.session.prompt({
  path: { id: sessionId },
  body: {
    parts: [{ type: "text", text: "Research and provide info" }],
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          version: { type: "string" },
        },
        required: ["name"],
      },
    },
  },
})
```

---

## Server API Overview

### Architecture

- The TUI is a **client** that talks to an HTTP server
- The server exposes an **OpenAPI 3.1 spec** at `/doc`
- The SDK is generated from this spec
- Multiple clients can connect (TUI, IDE plugins, web, CLI)

### Starting the Server

```bash
opencode serve [--port 4096] [--hostname 127.0.0.1] [--cors http://localhost:5173]
```

### Authentication

```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/global/health` | Server health and version |
| GET | `/global/event` | SSE event stream |
| GET | `/project` | List all projects |
| GET | `/project/current` | Current project |
| GET | `/session` | List sessions |
| POST | `/session` | Create session |
| GET | `/session/:id` | Get session |
| POST | `/session/:id/message` | Send message |
| GET | `/session/:id/message` | List messages |
| GET | `/file/content?path=` | Read file |
| POST | `/tui/append-prompt` | Append to prompt |
| POST | `/tui/show-toast` | Show toast |
| GET | `/event` | SSE event stream |
| GET | `/doc` | OpenAPI spec |

---

## TUI Plugin API Overview

The TUI plugin receives an `api` object with these surfaces:

| API | Purpose |
|-----|---------|
| `api.client` | SDK client (same as server plugin `client`) |
| `api.ui.toast` | Show toast notifications |
| `api.ui.Prompt` | Prompt input component wrapper |
| `api.ui.dialog` | Dialog management (replace, setSize, clear) |
| `api.slots.register` | Register slot renderers |
| `api.event.on` | Subscribe to events |
| `api.lifecycle.onDispose` | Register cleanup callbacks |
| `api.theme.current` | Theme colors (text, textMuted, error, warning) |
| `api.kv` | Key-value storage for plugin state |
| `api.keymap` | Register slash commands (experimental) |

For the complete TUI API reference, see [SDK Reference](./sdk-reference.md#tui-plugin-api-reference).

### TUI Plugin Logging

```ts
// Use api.client for logging in TUI plugins
await api.client?.app?.log?.({
  body: {
    service: "my-plugin-tui",
    level: "info",
    message: "TUI initialized",
  },
})
```

Always use optional chaining (`?.`) in TUI plugins as APIs may not be available in all contexts.

---

## TUI Plugin Architecture

### File Requirements

- **Must** be named `.tsx` (not `.js` or `.jsx`)
- **Must** start with `/** @jsxImportSource @opentui/solid */`
- **tsconfig.json** must have `"jsx": "preserve"`
- Do **not** import types from `@opencode-ai/plugin/tui` — causes silent load failures

### Plugin Structure

```ts
/** @jsxImportSource @opentui/solid */

import { TextAttributes } from "@opentui/core"
import { Show, createSignal } from "solid-js"

const plugin = {
  id: "my-plugin-tui",
  tui: async (api: any, _options: any) => {
    // signals, events, slot registration
  },
}

export default plugin
```

### Available Slots

| Slot | Visibility |
|------|------------|
| `sidebar_content` | Inside active sessions only |
| `home_bottom` | Home screen |
| `home_footer` | Home screen |
| `session_prompt` | Below chat input |
| `app_bottom` | Always visible |

### JSX Components

#### Layout

```tsx
<box padding={1} gap={1} flexDirection="row" justifyContent="center">
  <text fg={color}>Content</text>
</box>

<scrollbox width="100%" flexGrow={1} minHeight={6} maxHeight={28}>
  {/* scrollable content */}
</scrollbox>
```

#### Text

```tsx
<text fg={theme().text}>Normal text</text>
<text fg={theme().textMuted}>Muted text</text>
<text fg={theme().error}>Error text</text>
<text fg={theme().warning}>Warning text</text>
<text attributes={TextAttributes.BOLD}>Bold text</text>
<text wrapMode="word" width="100%">Wrapped text</text>
```

#### Conditional Rendering

```tsx
<Show when={condition()}>
  <text>Shown when true</text>
</Show>
```

#### Progress Bar

```tsx
<Slider
  orientation="horizontal"
  value={pct}
  min={0}
  max={100}
  foregroundColor={color}
  backgroundColor={theme().textMuted}
/>
```

#### Markdown

```tsx
<Markdown content={markdownString} />
```

### State Management

```ts
import { createSignal } from "solid-js"

const [value, setValue] = createSignal(0)
// Read: value()
// Write: setValue(newValue)
```

Signals trigger automatic re-renders when changed.

### Event System

```ts
const unsubEvent = api.event.on("session.idle", () => {
  // refresh data
})

api.lifecycle.onDispose(() => {
  unsubEvent()
})
```

### TUI Events

| Event | Properties |
|-------|------------|
| `session.idle` | `sessionID` |
| `session.updated` | `info.id`, `info.modelID`, `info.providerID` |
| `session.compacted` | `sessionID` |
| `message.updated` | `info.sessionID`, `info.id`, `info.role`, `info.tokens`, `info.cost` |
| `message.removed` | `sessionID`, `messageID` |
| `tui.session.select` | `sessionID` |

### Theme Colors

```ts
const theme = () => ctx.theme.current

theme().text        // Primary text color
theme().textMuted   // Secondary/muted text color
theme().error       // Error/red color
theme().warning     // Warning/yellow color
```

### File Access

`api.client.file.read()` is **sandboxed** to the workspace directory. Use Node `fs` directly:

```ts
import { readFileSync, existsSync } from "fs"

if (existsSync(path)) {
  const content = readFileSync(path, "utf-8")
}
```

### Toast Notifications

```ts
api.ui.toast?.({
  message: "Toast message",
  variant: "info" | "success" | "warning" | "error",
})
```

### Slot Component Signature

```ts
function MyComponent(ctx: any, props: { session_id?: string }) {
  // session_id is optional — non-session slots don't provide it
  const theme = () => ctx.theme.current
  return <box padding={1}><text fg={theme().text}>Hello</text></box>
}
```

### Keymap / Slash Commands (Experimental)

```ts
const keymap = (api as any).keymap
if (!keymap?.registerLayer) return

const dispose = keymap.registerLayer({
  commands: [{
    namespace: "palette",
    name: "my-plugin.command",
    title: "My Command",
    desc: "Description",
    category: "My Plugin",
    slashName: "my_command",
    run(input?: unknown) {
      // execute command
    },
  }],
})

if (typeof dispose === "function") {
  api.lifecycle.onDispose(dispose)
}
```

**Warning:** `api.keymap.registerLayer` may break plugin loading in some versions. Test carefully.

---

## Config System

### Config Locations and Precedence

Loaded in order (later overrides earlier):

1. Remote config (`.well-known/opencode`) — organizational defaults
2. Global config (`~/.config/opencode/opencode.json`) — user preferences
3. Custom config (`OPENCODE_CONFIG` env var) — custom overrides
4. Project config (`opencode.json`) — project-specific
5. `.opencode` directories — agents, commands, plugins
6. Inline config (`OPENCODE_CONFIG_CONTENT` env var) — runtime overrides
7. Managed config files — admin-controlled

Config files are **merged**, not replaced. Non-conflicting settings from all sources are preserved.

### JSON vs JSONC

Both `.json` and `.jsonc` (JSON with comments) are supported.

### Key Config Sections

| Section | Purpose |
|---------|---------|
| `server` | Port, hostname, mDNS, CORS |
| `shell` | Shell for interactive terminal |
| `tools` | Enable/disable tools |
| `provider` / `model` / `small_model` | Provider and model configuration |
| `agent` | Custom agents |
| `default_agent` | Default agent |
| `share` | Sharing mode (manual/auto/disabled) |
| `command` | Custom commands |
| `permission` | Tool permissions |
| `compaction` | Context compaction settings |
| `watcher` | File watcher ignore patterns |
| `mcp` | MCP servers |
| `plugin` | npm plugins |
| `instructions` | Instruction file paths |
| `formatter` | Code formatters |
| `lsp` | LSP servers |
| `disabled_providers` / `enabled_providers` | Provider allowlist/blocklist |

### Variable Substitution

```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  },
  "instructions": ["{file:./custom-instructions.md}"]
}
```

### TUI Config

Separate file: `tui.json` or `tui.jsonc`

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "opencode",
  "keybinds": { "command_list": "ctrl+p" },
  "scroll_speed": 3,
  "diff_style": "auto",
  "mouse": true,
  "attention": {
    "enabled": true,
    "notifications": true,
    "sound": true,
    "volume": 0.4
  }
}
```

---

## Agent System

### Agent Types

- **Primary agents** — main assistants you interact with directly (Tab to cycle)
- **Subagents** — specialized assistants invoked by primary agents or via `@mention`

### Built-in Agents

| Agent | Mode | Purpose |
|-------|------|---------|
| `build` | primary | Default — all tools enabled |
| `plan` | primary | Planning/analysis — restricted permissions |
| `general` | subagent | General-purpose, full tool access |
| `explore` | subagent | Read-only codebase exploration |
| `scout` | subagent | External docs and dependency research |
| `compaction` | primary | Hidden — context compaction |
| `title` | primary | Hidden — session title generation |
| `summary` | primary | Hidden — session summary generation |

### Agent Config (JSON)

```json
{
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer...",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    }
  }
}
```

### Agent Config (Markdown)

Place in `~/.config/opencode/agents/` or `.opencode/agents/`:

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---

You are in code review mode. Focus on security, performance, and maintainability.
```

### Permission System

| Value | Behavior |
|-------|----------|
| `"allow"` | Tool runs without approval |
| `"ask"` | User prompted for approval |
| `"deny"` | Tool disabled |

Permission keys support glob patterns:

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status *": "allow",
      "git *": "ask"
    }
  }
}
```

Last matching rule wins.

### Task Permissions

Control which subagents an agent can invoke:

```json
{
  "agent": {
    "orchestrator": {
      "permission": {
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

---

## Skills System

### File Placement

Skills are `SKILL.md` files in directories:

- Project: `.opencode/skills/<name>/SKILL.md`
- Global: `~/.config/opencode/skills/<name>/SKILL.md`
- Claude-compatible: `.claude/skills/<name>/SKILL.md`, `~/.claude/skills/<name>/SKILL.md`
- Agent-compatible: `.agents/skills/<name>/SKILL.md`, `~/.agents/skills/<name>/SKILL.md`

### Discovery

Opencode walks up from cwd to git worktree, loading any matching `skills/*/SKILL.md` along the way.

### Frontmatter

```yaml
---
name: my-skill
description: What this skill does (1-1024 chars)
license: MIT
compatibility: opencode
metadata:
  audience: developers
---
```

### Name Validation

- 1–64 characters
- Lowercase alphanumeric with single hyphen separators
- Not start/end with `-`, no consecutive `--`
- Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

### Skill Permissions

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

---

## Ecosystem

### Community Plugins

Browse at [opencode.ai/docs/ecosystem#plugins](https://opencode.ai/docs/ecosystem#plugins)

Notable plugins:
- `opencode-helicone-session` — Helicone session headers
- `opencode-wakatime` — Wakatime tracking
- `opencode-dynamic-context-pruning` — Token optimization
- `opencode-vibeguard` — Secret redaction
- `opencode-notificator` — Desktop notifications
- `opencode-shell-strategy` — Shell command safety

### Community Projects

Browse at [opencode.ai/docs/ecosystem#projects](https://opencode.ai/docs/ecosystem#projects)

Notable projects:
- `opencode.nvim` — Neovim plugin
- `portal` — Mobile-first web UI
- `OpenChamber` — Web/Desktop/VS Code extension
- `ai-sdk-provider-opencode-sdk` — Vercel AI SDK provider

### Community Agents

Browse at [opencode.ai/docs/ecosystem#agents](https://opencode.ai/docs/ecosystem#agents)

For a curated reference of ecosystem plugins, projects, and agents, see [Ecosystem Reference](./ecosystem-reference.md).

---

## Upstream References

| Resource | URL |
|----------|-----|
| Official docs | https://opencode.ai/docs/ |
| Plugin docs | https://opencode.ai/docs/plugins/ |
| SDK docs | https://opencode.ai/docs/sdk/ |
| Server docs | https://opencode.ai/docs/server/ |
| Config docs | https://opencode.ai/docs/config/ |
| Agents docs | https://opencode.ai/docs/agents/ |
| Ecosystem | https://opencode.ai/docs/ecosystem/ |
| Source code | https://github.com/anomalyco/opencode |
| SDK source | https://github.com/anomalyco/opencode/tree/dev/packages/sdk |
| Plugin package | https://github.com/anomalyco/opencode/tree/dev/packages/plugin |
| Docs source | https://github.com/anomalyco/opencode/tree/dev/packages/web/src/content/docs |

---

## Troubleshooting Quick Reference

### Plugin Doesn't Load

1. Check file extension (`.js` or `.ts` for server, `.tsx` for TUI)
2. Verify exports — must export a function (not a plain object)
3. Don't import from `@opencode-ai/plugin/tui` — causes silent failures
4. Check opencode logs: `DEBUG_MY_PLUGIN=1 opencode`

### TUI Plugin Issues

1. File **must** be `.tsx` extension
2. Must have `/** @jsxImportSource @opentui/solid */` pragma
3. `tsconfig.json` must have `"jsx": "preserve"`
4. Build script must **copy** `.tsx` to `dist/`, not compile to `.jsx`
5. Don't import types from `@opencode-ai/plugin/tui`

### Skill Not Showing Up

1. Verify `SKILL.md` is spelled in all caps
2. Check frontmatter includes `name` and `description`
3. Ensure skill names are unique across all locations
4. Check permissions — skills with `deny` are hidden

### Config Not Applying

1. Check precedence order — managed settings override everything
2. Config files are merged, not replaced
3. Use `opencode debug config` to see resolved config

### Debug Logging

```bash
# Server plugin
DEBUG_MY_PLUGIN=1 opencode

# TUI plugin
process.stderr.write("[my-plugin-tui] message\n")

# Filter all logs
opencode --log-level DEBUG --print-logs 2>&1 | grep "my-plugin"
```

### File Sandbox Errors

Use `fs.readFileSync` instead of `api.client.file.read()` — the API is sandboxed to workspace.

### Common Error Patterns

| Issue | Solution |
|-------|----------|
| `api.keymap.registerLayer` breaks loading | Guard with `if (!keymap?.registerLayer) return` |
| Toast notifications not showing | Use `.catch(() => {})` — they're non-blocking |
| `session_id` undefined in slot props | Make it optional — non-session slots don't provide it |
| Plugin logs not visible | Use `process.stderr.write`, not `console.log` |
