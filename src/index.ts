/**
 * opencode-plugin-tui — server plugin scaffold
 *
 * Comprehensive stub template with all available hooks, events, and patterns.
 * Uncomment and implement the hooks you need for your plugin.
 *
 * Reference implementations: src/examples/
 */

import type { Plugin } from "@opencode-ai/plugin"
import type { Event } from "@opencode-ai/sdk"
import { tool } from "@opencode-ai/plugin"
import { createLogger } from "./lib/logger.js"

// ─── Constants ──────────────────────────────────────────────────────────────

const PLUGIN_ID = "opencode-plugin-tui"
const log = createLogger(PLUGIN_ID, "DEBUG_PLUGIN_TUI")

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
    //   log.debug(`[tool.definition] ${input.toolID}`)
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

    // ── Permission Hook ────────────────────────────────────────────────────

    // "permission.asked": async (input, output) => {
    //   // Intercept permission requests
    //   // input.type — permission type
    //   // output.status — "allow" | "deny" | "ask"
    //   log.debug(`[permission.asked] ${input.type}`)
    // },

    // ── Compaction Hook ────────────────────────────────────────────────────

    // "experimental.session.compacting": async (input, output) => {
    //   // Inject context into compaction prompt or replace it entirely
    //   // output.context.push("## Custom Context\n...")
    //   // output.prompt = "Custom compaction prompt..."
    // },

    // ── Compaction Auto-Continue Hook ──────────────────────────────────────

    // "experimental.compaction.autocontinue": async (input, output) => {
    //   // Set enabled to false to skip the synthetic user "continue" turn
    //   // output.enabled = false
    // },

    // ── Experimental Chat Hooks ────────────────────────────────────────────

    // "experimental.chat.messages.transform": async (input, output) => {
    //   // Transform messages before sending to the model
    // },

    // "experimental.chat.system.transform": async (input, output) => {
    //   // Modify system prompt strings
    // },

    // "experimental.provider.small_model": async (input, output) => {
    //   // Override the small model used for lightweight tasks
    // },

    // ── Experimental Text Complete Hook ────────────────────────────────────

    // "experimental.text.complete": async (input, output) => {
    //   // Called when a text part completes
    // },

    // ── Event Handler ──────────────────────────────────────────────────────

    event: async ({ event }) => {
      log.debug(`[EVENT] ${event.type}`)

      switch (event.type) {
        // ── Session Events ───────────────────────────────────────────────

        case "session.created": {
          log.debug(`session.created — id: ${event.properties.info.id}`)
          break
        }

        case "session.updated": {
          log.debug(`session.updated — id: ${event.properties.info.id}`)
          break
        }

        case "session.idle": {
          log.debug(`session.idle — sessionID: ${event.properties.sessionID}`)
          break
        }

        case "session.deleted": {
          log.debug(`session.deleted — id: ${event.properties.info.id}`)
          break
        }

        case "session.compacted": {
          log.debug(`session.compacted — sessionID: ${event.properties.sessionID}`)
          break
        }

        case "session.error": {
          log.debug(`session.error — sessionID: ${event.properties.sessionID ?? "(none)"}`)
          break
        }

        case "session.status": {
          log.debug(`session.status — sessionID: ${event.properties.sessionID}, status: ${event.properties.status.type}`)
          break
        }

        case "session.diff": {
          log.debug(`session.diff — sessionID: ${event.properties.sessionID}, files: ${event.properties.diff.length}`)
          break
        }

        // ── Message Events ───────────────────────────────────────────────

        case "message.updated": {
          log.debug(`message.updated — session: ${event.properties.info.sessionID}, id: ${event.properties.info.id}`)
          break
        }

        case "message.removed": {
          log.debug(`message.removed — session: ${event.properties.sessionID}, message: ${event.properties.messageID}`)
          break
        }

        case "message.part.updated": {
          log.debug(`message.part.updated — session: ${event.properties.part.sessionID}, part: ${event.properties.part.type}`)
          break
        }

        case "message.part.removed": {
          log.debug(`message.part.removed — session: ${event.properties.sessionID}, part: ${event.properties.partID}`)
          break
        }

        // ── Todo Events ──────────────────────────────────────────────────

        case "todo.updated": {
          log.debug(`todo.updated — sessionID: ${event.properties.sessionID}`)
          break
        }

        // ── File Events ──────────────────────────────────────────────────

        case "file.edited": {
          log.debug(`file.edited — file: ${event.properties.file}`)
          break
        }

        case "file.watcher.updated": {
          log.debug(`file.watcher.updated — file: ${event.properties.file}, event: ${event.properties.event}`)
          break
        }

        // ── LSP Events ───────────────────────────────────────────────────

        case "lsp.updated": {
          log.debug(`lsp.updated`)
          break
        }

        case "lsp.client.diagnostics": {
          log.debug(`lsp.client.diagnostics — server: ${event.properties.serverID}`)
          break
        }

        // ── Command Events ───────────────────────────────────────────────

        case "command.executed": {
          log.debug(`command.executed — name: ${event.properties.name}`)
          break
        }

        // ── Installation Events ──────────────────────────────────────────

        case "installation.updated": {
          log.debug(`installation.updated — version: ${event.properties.version}`)
          break
        }

        case "installation.update-available": {
          log.debug(`installation.update-available — version: ${event.properties.version}`)
          break
        }

        // ── Server Events ────────────────────────────────────────────────

        case "server.connected": {
          log.debug(`server.connected`)
          break
        }

        case "server.instance.disposed": {
          log.debug(`server.instance.disposed — directory: ${event.properties.directory}`)
          break
        }

        // ── TUI Events ───────────────────────────────────────────────────

        case "tui.prompt.append": {
          log.debug(`tui.prompt.append — text: ${event.properties.text}`)
          break
        }

        case "tui.command.execute": {
          log.debug(`tui.command.execute — command: ${event.properties.command}`)
          break
        }

        case "tui.toast.show": {
          log.debug(`tui.toast.show — message: ${event.properties.message}`)
          break
        }

        // ── Permission Events ────────────────────────────────────────────

        case "permission.updated": {
          log.debug(`permission.updated — type: ${event.properties.type}`)
          break
        }

        case "permission.replied": {
          log.debug(`permission.replied — session: ${event.properties.sessionID}, response: ${event.properties.response}`)
          break
        }

        // ── VCS Events ───────────────────────────────────────────────────

        case "vcs.branch.updated": {
          log.debug(`vcs.branch.updated — branch: ${event.properties.branch ?? "(none)"}`)
          break
        }

        // ── PTY Events ───────────────────────────────────────────────────

        case "pty.created": {
          log.debug(`pty.created — id: ${event.properties.info.id}, command: ${event.properties.info.command}`)
          break
        }

        case "pty.updated": {
          log.debug(`pty.updated — id: ${event.properties.info.id}`)
          break
        }

        case "pty.exited": {
          log.debug(`pty.exited — id: ${event.properties.id}, exitCode: ${event.properties.exitCode}`)
          break
        }

        case "pty.deleted": {
          log.debug(`pty.deleted — id: ${event.properties.id}`)
          break
        }
      }
    },
  }
}

const plugin: Plugin = PluginTuiServer

export default plugin
