#!/usr/bin/env node
/**
 * dev:install — build the plugin and create symlinks + config entries for opencode.
 *
 * Server plugin → ~/.config/opencode/plugins/<name>/ → <workspace>/dist
 * TUI plugin → <workspace> (the workspace root itself is the TUI plugin dir)
 *
 * Adds entries to opencode.json and tui.json if not already present.
 */

import { existsSync, readFileSync, writeFileSync, rmSync, symlinkSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'

const { HOME, USERPROFILE } = process.env
const home = HOME || USERPROFILE || ''
if (!home) {
  console.error('[dev:install] ❌ Cannot detect HOME directory.')
  process.exit(1)
}

const workspace = process.cwd()
const distDir = join(workspace, 'dist')
const pluginsDir = resolve(home, '.config', 'opencode', 'plugins')
const opencodeConfig = resolve(home, '.config', 'opencode', 'opencode.json')
const tuiConfigPath = resolve(home, '.config', 'opencode', 'tui.json')

// Derive plugin name from package.json or fallback to workspace dir name
let pluginName
try {
  const pkg = JSON.parse(readFileSync(join(workspace, 'package.json'), 'utf-8'))
  pluginName = pkg.name || 'opencode-plugin'
} catch {
  pluginName = workspace.split('/').slice(-1)[0] || 'opencode-plugin'
}

const symlinkDir = join(pluginsDir, pluginName)
const workspaceAbs = resolve(workspace)
const serverPluginPath = `file://${join(workspaceAbs, 'dist', 'index.js')}`

console.log(`[dev:install] workspace   : ${workspace}`)
console.log(`[dev:install] pluginName  : ${pluginName}`)
console.log(`[dev:install] symlinkDir  : ${symlinkDir}`)
console.log(`[dev:install] server path : ${serverPluginPath}\n`)

// ── 1. Build ──────────────────────────────────────

console.log('[dev:install] Building...')
try {
  execSync('pnpm run build', { cwd: workspace, stdio: 'inherit' })
} catch (err) {
  console.error(`[dev:install] ❌ Build failed.`)
  process.exit(1)
}

// ── 2. Create symlink ─────────────────────────────

console.log('[dev:install] Creating symlink...')

try {
  if (existsSync(symlinkDir)) {
    rmSync(symlinkDir, { recursive: true, force: true })
  }

  // Ensure parent directory exists
  if (!existsSync(pluginsDir)) {
    mkdirSync(pluginsDir, { recursive: true })
  }

  symlinkSync(distDir, symlinkDir, 'dir')
  console.log(`[dev:install] ✅ Symlink: ${symlinkDir} → ${distDir}\n`)
} catch (err) {
  console.error(`[dev:install] ❌ Failed to create symlink:\n${err.message}`)
  process.exit(1)
}

// ── 3. Update opencode.json (server) ──────────────

updateServerPlugin(opencodeConfig, serverPluginPath)

// ── 4. Update tui.json (TUI) ──────────────────────

updateTuiPlugin(tuiConfigPath, workspaceAbs)

console.log('[dev:install] ✅ Done!\n')

// ── Helpers ───────────────────────────────────────

function parseJSONC(filepath) {
  const raw = readFileSync(filepath, 'utf-8')
  const cleaned = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(cleaned)
}

function writeJSONC(filepath, data) {
  const raw = readFileSync(filepath, 'utf-8')
  const jsonStr = JSON.stringify(data, null, 2)
  writeFileSync(filepath, `${jsonStr}\n`, 'utf-8')
}

function getConfigFile(filepath) {
  if (!existsSync(filepath)) return null
  try {
    const raw = readFileSync(filepath, 'utf-8')
    const firstNonSpace = raw.trimStart()[0]
    let data
    if (firstNonSpace === '[') {
      // tui.json is an array
      const cleaned = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '')
        .replace(/,(\s*[}\]])/g, '$1')
      data = JSON.parse(cleaned)
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        // It's { plugin: [...] } — unwrap it
        return { data: data.plugin || [], isArray: true, objectShape: true }
      }
      return { data, isArray: true, objectShape: false }
    } else {
      // opencode.json is an object
      const cleaned = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '')
        .replace(/,(\s*[}\]])/g, '$1')
      data = JSON.parse(cleaned)
      if (!Array.isArray(data.plugin)) {
        data.plugin = []
      }
      return { data: data.plugin, isArray: false, objectShape: true }
    }
  } catch {
    return null
  }
}

function updateServerPlugin(filepath, serverPath) {
  const result = getConfigFile(filepath)
  if (!result) {
    // Create the file
    console.log(`[dev:install] ℹ️  ${filepath} not found — creating.`)
    writeJSONC(filepath, { plugin: [serverPath] })
    console.log(`[dev:install] ✅ Added server plugin to ${filepath}\n`)
    return
  }

  const plugins = result.data
  const expectedAbs = `file://${join(workspaceAbs, 'dist', 'index.js')}`

  if (plugins.includes(serverPath) || plugins.includes(expectedAbs)) {
    console.log(`[dev:install] ℹ️  Server plugin already in ${filepath}\n`)
    return
  }

  plugins.push(expectedAbs)

  if (result.objectShape && !result.isArray) {
    // Re-wrap as { plugin: [...] }
    const existing = existsSync(filepath) && parseJSONC(filepath)
    writeJSONC(filepath, { ...existing, plugin: plugins })
  } else {
    writeJSONC(filepath, plugins)
  }

  console.log(`[dev:install] ✅ Added server plugin to ${filepath}: ${expectedAbs}\n`)
}

function updateTuiPlugin(filepath, workspacePath) {
  const result = getConfigFile(filepath)
  if (!result) {
    console.log(`[dev:install] ℹ️  ${filepath} not found — creating.`)
    writeJSONC(filepath, [workspacePath])
    console.log(`[dev:install] ✅ Added TUI plugin to ${filepath}\n`)
    return
  }

  const plugins = result.data
  if (plugins.includes(workspacePath)) {
    console.log(`[dev:install] ℹ️  TUI plugin already in ${filepath}\n`)
    return
  }

  plugins.push(workspacePath)

  if (result.objectShape) {
    const existing = existsSync(filepath) && parseJSONC(filepath)
    writeJSONC(filepath, { ...existing, plugin: plugins })
  } else {
    writeJSONC(filepath, plugins)
  }

  console.log(`[dev:install] ✅ Added TUI plugin to ${filepath}: ${workspacePath}\n`)
}
