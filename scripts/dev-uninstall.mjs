#!/usr/bin/env node
/**
 * dev:uninstall — remove symlinks and config entries created by dev:install.
 *
 * Removes:
 * - ~/.config/opencode/plugins/<name>/ (symlink)
 * - Server plugin entry from opencode.json (if it matches our dist/index.js path)
 * - TUI plugin entry from tui.json (if it matches our workspace dir)
 */

import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'

const { HOME, USERPROFILE } = process.env
const home = HOME || USERPROFILE || ''
if (!home) {
  console.error('[dev:uninstall] ❌ Cannot detect HOME directory.')
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

console.log(`[dev:uninstall] workspace   : ${workspace}`)
console.log(`[dev:uninstall] pluginName  : ${pluginName}`)
console.log(`[dev:uninstall] symlinkDir  : ${symlinkDir}\n`)

// ── 1. Remove symlink ──────────────────────────

console.log('[dev:uninstall] Removing symlink. ..')

if (existsSync(symlinkDir)) {
  rmSync(symlinkDir, { recursive: true, force: true })
  console.log(`[dev:uninstall] ✅ Removed: ${symlinkDir}\n`)
} else {
  console.log(`[dev:uninstall] ℹ️  Symlink does not exist at ${symlinkDir}, skipping.\n`)
}

// ── 2. Remove server plugin entry from opencode.json ─────

removeServerPlugin(opencodeConfig)

// ── 3. Remove TUI plugin entry from tui.json ─────────

removeTuiPlugin(tuiConfigPath, workspaceAbs)

console.log('[dev:uninstall] ✅ Done!\n')

// ── Helpers ──

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
      const cleaned = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '')
        .replace(/,(\s*[}\]])/g, '$1')
      data = JSON.parse(cleaned)
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        return { data: data.plugin || [], isArray: true, objectShape: true }
      }
      return { data, isArray: true, objectShape: false }
    } else {
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

function removeServerPlugin(filepath) {
  const result = getConfigFile(filepath)
  if (!result) {
    console.log(`[dev:uninstall] ℹ️  ${filepath} not found, skipping server plugin cleanup.\n`)
    return
  }

  const plugins = result.data
  const filtered = plugins.filter(p => p !== serverPluginPath && !p.includes('opencode-plugin-tui'))

  if (filtered.length === plugins.length) {
    console.log(`[dev:uninstall] ℹ️  No matching server plugin in ${filepath}, skipping.\n`)
    return
  }

  if (result.objectShape && !result.isArray) {
    const existing = parseJSONC(filepath)
    writeJSONC(filepath, { ...existing, plugin: filtered })
  } else {
    writeJSONC(filepath, filtered)
  }

  console.log(`[dev:uninstall] ✅ Removed server plugin entry from ${filepath}\n`)
}

function removeTuiPlugin(filepath, workspacePath) {
  const result = getConfigFile(filepath)
  if (!result) {
    console.log(`[dev:uninstall] ℹ️  ${filepath} not found, skipping TUI plugin cleanup.\n`)
    return
  }

  const plugins = result.data
  const filtered = plugins.filter(p => p !== workspacePath && !p.includes('opencode-plugin-tui'))

  if (filtered.length === plugins.length) {
    console.log(`[dev:uninstall] ℹ️  No matching TUI plugin in ${filepath}, skipping.\n`)
    return
  }

  if (result.objectShape) {
    const existing = parseJSONC(filepath)
    writeJSONC(filepath, { ...existing, plugin: filtered })
  } else {
    writeJSONC(filepath, filtered)
  }

  console.log(`[dev:uninstall] ✅ Removed TUI plugin entry from ${filepath}\n`)
}
