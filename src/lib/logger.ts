import type { PluginInput } from "@opencode-ai/plugin"

type Client = PluginInput["client"]
type LogLevel = "info" | "warn" | "error" | "debug"
type LogMetadata = Record<string, unknown>

export interface Logger {
  info: (msg: string, extra?: LogMetadata) => Promise<void>
  warn: (msg: string, extra?: LogMetadata) => Promise<void>
  error: (msg: string, extra?: LogMetadata) => Promise<void>
  debug: (msg: string, extra?: LogMetadata) => Promise<void>
}

/**
 * Creates an SDK-based logger that uses client.app.log() for structured logging.
 * Use this for server plugins where client is available.
 */
export function createSdkLogger(
  client: Client,
  pluginId: string,
  debugEnvVar?: string,
): Logger {
  const DEBUG = debugEnvVar ? process.env[debugEnvVar] === "1" : false

  const log = async (
    level: LogLevel,
    msg: string,
    extra?: LogMetadata,
  ): Promise<void> => {
    // Filter debug logs unless explicitly enabled
    if (level === "debug" && !DEBUG) return

    await client.app.log({
      body: {
        service: pluginId,
        level,
        message: msg,
        extra: extra ?? {},
      },
    })
  }

  return {
    info: (msg, extra) => log("info", msg, extra),
    warn: (msg, extra) => log("warn", msg, extra),
    error: (msg, extra) => log("error", msg, extra),
    debug: (msg, extra) => log("debug", msg, extra),
  }
}

/**
 * Creates a stderr-based logger for TUI plugins where client may not be available.
 * Falls back to process.stderr.write for logging.
 */
export function createLogger(pluginId: string, debugEnvVar?: string): Omit<Logger, "info" | "warn" | "error" | "debug"> & {
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
  debug: (msg: string) => void
} {
  const DEBUG = debugEnvVar ? process.env[debugEnvVar] === "1" : false
  return {
    info:  (msg: string) => { process.stderr.write(`[${pluginId}] ${msg}\n`) },
    warn:  (msg: string) => { process.stderr.write(`[${pluginId}] WARN: ${msg}\n`) },
    error: (msg: string) => { process.stderr.write(`[${pluginId}] ERROR: ${msg}\n`) },
    debug: (msg: string) => { if (DEBUG) process.stderr.write(`[${pluginId}] DEBUG: ${msg}\n`) },
  }
}
