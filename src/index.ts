/**
 * opencode-plugin-tui — server plugin scaffold
 *
 * Placeholder hooks and a demo tool. Replace with your plugin logic.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

// ─── Logging ──────────────────────────────────────────────────────────────

const DEBUG = process.env.DEBUG_PLUGIN_TUI === "1"

const log = {
  info:  (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] ${msg}\n`) },
  warn:  (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] WARN: ${msg}\n`) },
  error: (msg: string) => { process.stderr.write(`[${PLUGIN_ID}] ERROR: ${msg}\n`) },
  debug: (msg: string) => { if (DEBUG) process.stderr.write(`[${PLUGIN_ID}] DEBUG: ${msg}\n`) },
}

const PLUGIN_ID = "opencode-plugin-tui"

// ─── Demo tool ────────────────────────────────────────────────────────────

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

// ─── Plugin ───────────────────────────────────────────────────────────────

export const PluginTuiServer: Plugin = async ({ client, project, directory }) => {
  log.info(`Active — project: ${project ?? "(none)"}`)
  log.debug(`Directory: ${directory}`)

  return {
    dispose: async () => {
      log.info("Disposing")
    },

    tool: {
      hello: helloTool,
    },

    event: async ({ event }) => {
      log.debug(`[EVENT] ${event.type}`)

      if (event.type === "session.idle") {
        const sessionId = (event as any).properties?.sessionID
        log.debug(`session.idle — sessionID: ${sessionId ?? "(none)"}`)
      }

      if (event.type === "session.created") {
        const info = (event as any).properties?.info
        log.debug(`session.created — id: ${info?.id ?? "(none)"}`)
      }
    },
  }
}

const plugin: Plugin = PluginTuiServer

export default plugin
