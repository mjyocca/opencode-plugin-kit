/**
 * opencode-plugin-tui — server plugin scaffold
 *
 * Comprehensive stub template with all available hooks, events, and patterns.
 * Uncomment and implement the hooks you need for your plugin.
 *
 * Reference implementations: src/examples/
 */

import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { createLogger } from "./lib/logger.js"
import { EVENT } from "./lib/events.js"
import { hooks } from "./lib/hooks.js"
import type { Hook } from "./lib/hook-types.js"

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

    // [hooks.chat.message]: async (input: Hook.chat.MessageInput, output: Hook.chat.MessageOutput) => {
    //   // Transform the message before sending to the model
    // },

    // [hooks.chat.params]: async (input: Hook.chat.ParamsInput, output: Hook.chat.ParamsOutput) => {
    //   // Transform request parameters (model, temperature, etc.)
    // },

    // [hooks.chat.headers]: async (input: Hook.chat.HeadersInput, output: Hook.chat.HeadersOutput) => {
    //   // Add or modify HTTP headers for the request
    // },

    // ── Tool Lifecycle Hooks ───────────────────────────────────────────────

    // [hooks.tool.executeBefore]: async (input: Hook.tool.ExecuteBeforeInput, output: Hook.tool.ExecuteBeforeOutput) => {
    //   // Runs before any tool executes
    //   // input.tool — tool name
    //   // input.args — tool arguments
    //   // output.args — modifiable args
    //   log.debug(`[${hooks.tool.executeBefore}] ${input.tool}`)
    // },

    // [hooks.tool.executeAfter]: async (input: Hook.tool.ExecuteAfterInput, output: Hook.tool.ExecuteAfterOutput) => {
    //   // Runs after any tool executes
    //   // input.tool — tool name
    //   // output.result — tool result (modifiable)
    //   log.debug(`[${hooks.tool.executeAfter}] ${input.tool}`)
    // },

    // [hooks.tool.definition]: async (input: Hook.tool.DefinitionInput, output: Hook.tool.DefinitionOutput) => {
    //   // Transform a tool's definition (description, schema, etc.)
    //   log.debug(`[${hooks.tool.definition}] ${input.toolID}`)
    // },

    // ── Command Hook ───────────────────────────────────────────────────────

    // [hooks.command.executeBefore]: async (input: Hook.command.ExecuteBeforeInput, output: Hook.command.ExecuteBeforeOutput) => {
    //   // Runs before a slash command executes
    //   log.debug(`[${hooks.command.executeBefore}] ${input.command}`)
    // },

    // ── Shell Environment Hook ─────────────────────────────────────────────

    // [hooks.shell.env]: async (input: Hook.shell.EnvInput, output: Hook.shell.EnvOutput) => {
    //   // Inject environment variables into all shell execution
    //   // output.env.MY_API_KEY = "secret"
    //   // output.env.PROJECT_ROOT = input.cwd
    // },

    // ── Permission Hook ────────────────────────────────────────────────────

    // [hooks.permission.ask]: async (input: Hook.permission.AskInput, output: Hook.permission.AskOutput) => {
    //   // Intercept permission requests
    //   // input.type — permission type
    //   // output.status — "allow" | "deny" | "ask"
    //   log.debug(`[${hooks.permission.ask}] ${input.type}`)
    // },

    // ── Experimental Hooks ─────────────────────────────────────────────────

    // [hooks.experimental.session.compacting]: async (input: Hook.experimental.session.CompactingInput, output: Hook.experimental.session.CompactingOutput) => {
    //   // Inject context into compaction prompt or replace it entirely
    //   // output.context.push("## Custom Context\n...")
    //   // output.prompt = "Custom compaction prompt..."
    // },

    // [hooks.experimental.session.compactionAutoContinue]: async (input: Hook.experimental.session.CompactionAutoContinueInput, output: Hook.experimental.session.CompactionAutoContinueOutput) => {
    //   // Set enabled to false to skip the synthetic user "continue" turn
    //   // output.enabled = false
    // },

    // [hooks.experimental.chat.messagesTransform]: async (input: Hook.experimental.chat.MessagesTransformInput, output: Hook.experimental.chat.MessagesTransformOutput) => {
    //   // Transform messages before sending to the model
    // },

    // [hooks.experimental.chat.systemTransform]: async (input: Hook.experimental.chat.SystemTransformInput, output: Hook.experimental.chat.SystemTransformOutput) => {
    //   // Modify system prompt strings
    // },

    // [hooks.experimental.provider.smallModel]: async (input: Hook.experimental.provider.SmallModelInput, output: Hook.experimental.provider.SmallModelOutput) => {
    //   // Override the small model used for lightweight tasks
    // },

    // [hooks.experimental.text.complete]: async (input: Hook.experimental.text.CompleteInput, output: Hook.experimental.text.CompleteOutput) => {
    //   // Called when a text part completes
    // },

    // ── Event Handler ──────────────────────────────────────────────────────

    event: async ({ event }) => {
      log.debug(`[EVENT] ${event.type}`)

      switch (event.type) {
        // ── Session Events ───────────────────────────────────────────────

        case EVENT.SessionCreated: {
          log.debug(`session.created — id: ${event.properties.info.id}`)
          break
        }

        case EVENT.SessionUpdated: {
          log.debug(`session.updated — id: ${event.properties.info.id}`)
          break
        }

        case EVENT.SessionIdle: {
          log.debug(`session.idle — sessionID: ${event.properties.sessionID}`)
          break
        }

        case EVENT.SessionDeleted: {
          log.debug(`session.deleted — id: ${event.properties.info.id}`)
          break
        }

        case EVENT.SessionCompacted: {
          log.debug(`session.compacted — sessionID: ${event.properties.sessionID}`)
          break
        }

        case EVENT.SessionError: {
          log.debug(`session.error — sessionID: ${event.properties.sessionID ?? "(none)"}`)
          break
        }

        case EVENT.SessionStatus: {
          log.debug(`session.status — sessionID: ${event.properties.sessionID}, status: ${event.properties.status.type}`)
          break
        }

        case EVENT.SessionDiff: {
          log.debug(`session.diff — sessionID: ${event.properties.sessionID}, files: ${event.properties.diff.length}`)
          break
        }

        // ── Message Events ───────────────────────────────────────────────

        case EVENT.MessageUpdated: {
          log.debug(`message.updated — session: ${event.properties.info.sessionID}, id: ${event.properties.info.id}`)
          break
        }

        case EVENT.MessageRemoved: {
          log.debug(`message.removed — session: ${event.properties.sessionID}, message: ${event.properties.messageID}`)
          break
        }

        case EVENT.MessagePartUpdated: {
          log.debug(`message.part.updated — session: ${event.properties.part.sessionID}, part: ${event.properties.part.type}`)
          break
        }

        case EVENT.MessagePartRemoved: {
          log.debug(`message.part.removed — session: ${event.properties.sessionID}, part: ${event.properties.partID}`)
          break
        }

        // ── Todo Events ──────────────────────────────────────────────────

        case EVENT.TodoUpdated: {
          log.debug(`todo.updated — sessionID: ${event.properties.sessionID}`)
          break
        }

        // ── File Events ──────────────────────────────────────────────────

        case EVENT.FileEdited: {
          log.debug(`file.edited — file: ${event.properties.file}`)
          break
        }

        case EVENT.FileWatcherUpdated: {
          log.debug(`file.watcher.updated — file: ${event.properties.file}, event: ${event.properties.event}`)
          break
        }

        // ── LSP Events ───────────────────────────────────────────────────

        case EVENT.LspUpdated: {
          log.debug(`lsp.updated`)
          break
        }

        case EVENT.LspClientDiagnostics: {
          log.debug(`lsp.client.diagnostics — server: ${event.properties.serverID}`)
          break
        }

        // ── Command Events ───────────────────────────────────────────────

        case EVENT.CommandExecuted: {
          log.debug(`command.executed — name: ${event.properties.name}`)
          break
        }

        // ── Installation Events ──────────────────────────────────────────

        case EVENT.InstallationUpdated: {
          log.debug(`installation.updated — version: ${event.properties.version}`)
          break
        }

        case EVENT.InstallationUpdateAvailable: {
          log.debug(`installation.update-available — version: ${event.properties.version}`)
          break
        }

        // ── Server Events ────────────────────────────────────────────────

        case EVENT.ServerConnected: {
          log.debug(`server.connected`)
          break
        }

        case EVENT.ServerInstanceDisposed: {
          log.debug(`server.instance.disposed — directory: ${event.properties.directory}`)
          break
        }

        // ── TUI Events ───────────────────────────────────────────────────

        case EVENT.TuiPromptAppend: {
          log.debug(`tui.prompt.append — text: ${event.properties.text}`)
          break
        }

        case EVENT.TuiCommandExecute: {
          log.debug(`tui.command.execute — command: ${event.properties.command}`)
          break
        }

        case EVENT.TuiToastShow: {
          log.debug(`tui.toast.show — message: ${event.properties.message}`)
          break
        }

        // ── Permission Events ────────────────────────────────────────────

        case EVENT.PermissionUpdated: {
          log.debug(`permission.updated — type: ${event.properties.type}`)
          break
        }

        case EVENT.PermissionReplied: {
          log.debug(`permission.replied — session: ${event.properties.sessionID}, response: ${event.properties.response}`)
          break
        }

        // ── VCS Events ───────────────────────────────────────────────────

        case EVENT.VcsBranchUpdated: {
          log.debug(`vcs.branch.updated — branch: ${event.properties.branch ?? "(none)"}`)
          break
        }

        // ── PTY Events ───────────────────────────────────────────────────

        case EVENT.PtyCreated: {
          log.debug(`pty.created — id: ${event.properties.info.id}, command: ${event.properties.info.command}`)
          break
        }

        case EVENT.PtyUpdated: {
          log.debug(`pty.updated — id: ${event.properties.info.id}`)
          break
        }

        case EVENT.PtyExited: {
          log.debug(`pty.exited — id: ${event.properties.id}, exitCode: ${event.properties.exitCode}`)
          break
        }

        case EVENT.PtyDeleted: {
          log.debug(`pty.deleted — id: ${event.properties.id}`)
          break
        }
      }
    },
  }
}

const plugin: Plugin = PluginTuiServer

export default plugin
