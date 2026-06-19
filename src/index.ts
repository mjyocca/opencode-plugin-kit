/**
 * opencode-plugin-tui — server plugin scaffold
 *
 * Comprehensive stub template with all available hooks, events, and patterns.
 * Uncomment and implement the hooks you need for your plugin.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

// ─── Constants ──────────────────────────────────────────────────────────────

const PLUGIN_ID = "opencode-plugin-tui"
const DEBUG = process.env.DEBUG_PLUGIN_TUI === "1"

// ─── Logging ────────────────────────────────────────────────────────────────

const log = {
  info:  (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] ${msg}\n`) },
  warn:  (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] WARN: ${msg}\n`) },
  error: (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] ERROR: ${msg}\n`) },
  debug: (msg: string) => { if (DEBUG) process.stderr.write(`[${PLUGIN_ID}] DEBUG: ${msg}\n`) },
}

// ─── Demo Tool ──────────────────────────────────────────────────────────────

const helloTool = tool({
  description: "Demo tool — shows that the plugin is loaded and working.",
  args: {},
  execute: async () => {
    return {
      title: "Plugin TUI — Server",
      output: "opencode-plugin-tui server plugin is active.",
    }
  },
})

// ─── Plugin ─────────────────────────────────────────────────────────────────

export const PluginTuiServer: Plugin = async ({ client, project, directory, worktree, $ }) => {
  log.info(`Active — project: ${project ?? "(none)"}, dir: ${directory}`)

  return {
    // ── Lifecycle ──────────────────────────────────────────────────────────

    dispose: async () => {
      log.info("Disposing")
    },

    // ── Tools ──────────────────────────────────────────────────────────────

    tool: {
      hello: helloTool,
      // Add more tools:
      // myTool: myToolDef,
    },

    // ── Config Hook ────────────────────────────────────────────────────────
    // Called once on init with the merged config object.

    // config: async (cfg) => {
    //   log.debug(`Config loaded: ${JSON.stringify(cfg)}`)
    // },

    // ── Chat Pipeline Hooks ────────────────────────────────────────────────

    // "chat.message": async (input, output) => {
    //   // Transform the message before sending to the model
    // },

    // "chat.params": async (input, output) => {
    //   // Transform request parameters (model, temperature, etc.)
    // },

    // "chat.headers": async (input, output) => {
    //   // Add or modify HTTP headers for the request
    // },

    // ── Tool Lifecycle Hooks ───────────────────────────────────────────────

    // "tool.execute.before": async (input, output) => {
    //   // Runs before any tool executes
    //   // input.tool — tool name
    //   // input.args — tool arguments
    //   // output.args — modifiable args
    //   log.debug(`[tool.execute.before] ${input.tool}`)
    // },

    // "tool.execute.after": async (input, output) => {
    //   // Runs after any tool executes
    //   // input.tool — tool name
    //   // output.result — tool result (modifiable)
    //   log.debug(`[tool.execute.after] ${input.tool}`)
    // },

    // "tool.definition": async (input, output) => {
    //   // Transform a tool's definition (description, schema, etc.)
    //   log.debug(`[tool.definition] ${input.tool}`)
    // },

    // ── Command Hook ───────────────────────────────────────────────────────

    // "command.execute.before": async (input, output) => {
    //   // Runs before a slash command executes
    //   log.debug(`[command.execute.before] ${input.command}`)
    // },

    // ── Shell Environment Hook ─────────────────────────────────────────────

    // "shell.env": async (input, output) => {
    //   // Inject environment variables into all shell execution
    //   // output.env.MY_API_KEY = "secret"
    //   // output.env.PROJECT_ROOT = input.cwd
    // },

    // ── Permission Hooks ───────────────────────────────────────────────────

    // "permission.asked": async (input, output) => {
    //   // Intercept permission requests
    //   // input.tool — tool requesting permission
    //   // output.response — "allow" | "deny"
    //   log.debug(`[permission.asked] ${input.tool}`)
    // },

    // "permission.replied": async (input) => {
    //   // Runs after a permission decision is made
    //   log.debug(`[permission.replied] ${input.tool} → ${input.response}`)
    // },

    // ── Compaction Hook ────────────────────────────────────────────────────

    // "experimental.session.compacting": async (input, output) => {
    //   // Inject context into compaction prompt or replace it entirely
    //   // output.context.push("## Custom Context\n...")
    //   // output.prompt = "Custom compaction prompt..."
    // },

    // ── Event Handler ──────────────────────────────────────────────────────

    event: async ({ event }) => {
      log.debug(`[EVENT] ${event.type}`)

      switch (event.type) {
        // ── Session Events ───────────────────────────────────────────────

        case "session.created": {
          const info = (event as any).properties?.info
          log.debug(`session.created — id: ${info?.id ?? "(none)"}`)
          break
        }

        case "session.updated": {
          const info = (event as any).properties?.info
          log.debug(`session.updated — id: ${info?.id ?? "(none)"}`)
          break
        }

        case "session.idle": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.idle — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        case "session.deleted": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.deleted — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        case "session.compacted": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.compacted — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        case "session.error": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.error — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        case "session.status": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.status — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        case "session.diff": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`session.diff — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        // ── Message Events ───────────────────────────────────────────────

        case "message.updated": {
          const info = (event as any).properties?.info
          log.debug(`message.updated — session: ${info?.sessionID}, id: ${info?.id}`)
          break
        }

        case "message.removed": {
          const sessionId = (event as any).properties?.sessionID
          const messageId = (event as any).properties?.messageID
          log.debug(`message.removed — session: ${sessionId}, message: ${messageId}`)
          break
        }

        case "message.part.updated": {
          const info = (event as any).properties?.info
          log.debug(`message.part.updated — session: ${info?.sessionID}`)
          break
        }

        case "message.part.removed": {
          log.debug(`message.part.removed`)
          break
        }

        // ── Todo Events ──────────────────────────────────────────────────

        case "todo.updated": {
          const sessionId = (event as any).properties?.sessionID
          log.debug(`todo.updated — sessionID: ${sessionId ?? "(none)"}`)
          break
        }

        // ── File Events ──────────────────────────────────────────────────

        case "file.edited": {
          log.debug(`file.edited`)
          break
        }

        case "file.watcher.updated": {
          log.debug(`file.watcher.updated`)
          break
        }

        // ── LSP Events ───────────────────────────────────────────────────

        case "lsp.updated": {
          log.debug(`lsp.updated`)
          break
        }

        case "lsp.client.diagnostics": {
          log.debug(`lsp.client.diagnostics`)
          break
        }

        // ── Command Events ───────────────────────────────────────────────

        case "command.executed": {
          log.debug(`command.executed`)
          break
        }

        // ── Installation Events ──────────────────────────────────────────

        case "installation.updated": {
          log.debug(`installation.updated`)
          break
        }

        // ── Server Events ────────────────────────────────────────────────

        case "server.connected": {
          log.debug(`server.connected`)
          break
        }

        // ── TUI Events ───────────────────────────────────────────────────

        case "tui.prompt.append": {
          log.debug(`tui.prompt.append`)
          break
        }

        case "tui.command.execute": {
          log.debug(`tui.command.execute`)
          break
        }

        case "tui.toast.show": {
          log.debug(`tui.toast.show`)
          break
        }
      }
    },
  }
}

const plugin: Plugin = PluginTuiServer

export default plugin
