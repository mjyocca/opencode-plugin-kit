export function createLogger(pluginId: string, debugEnvVar?: string) {
  const DEBUG = debugEnvVar ? process.env[debugEnvVar] === "1" : false
  return {
    info:  (msg: string) => { process.stderr.write(`[${pluginId}] ${msg}\n`) },
    warn:  (msg: string) => { process.stderr.write(`[${pluginId}] WARN: ${msg}\n`) },
    error: (msg: string) => { process.stderr.write(`[${pluginId}] ERROR: ${msg}\n`) },
    debug: (msg: string) => { if (DEBUG) process.stderr.write(`[${pluginId}] DEBUG: ${msg}\n`) },
  }
}
