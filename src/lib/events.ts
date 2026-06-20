import type { Event } from "@opencode-ai/sdk"

// ─── Event Type Strings ─────────────────────────────────────────────────────
// Single source of truth for all opencode event type strings.
// Provides autocomplete and prevents typos in switch/case statements.

export const EVENT = {
  // Session (8)
  SessionCreated: "session.created",
  SessionUpdated: "session.updated",
  SessionDeleted: "session.deleted",
  SessionIdle: "session.idle",
  SessionCompacted: "session.compacted",
  SessionError: "session.error",
  SessionStatus: "session.status",
  SessionDiff: "session.diff",

  // Message (4)
  MessageUpdated: "message.updated",
  MessageRemoved: "message.removed",
  MessagePartUpdated: "message.part.updated",
  MessagePartRemoved: "message.part.removed",

  // File (2)
  FileEdited: "file.edited",
  FileWatcherUpdated: "file.watcher.updated",

  // LSP (2)
  LspUpdated: "lsp.updated",
  LspClientDiagnostics: "lsp.client.diagnostics",

  // Command (1)
  CommandExecuted: "command.executed",

  // Installation (2)
  InstallationUpdated: "installation.updated",
  InstallationUpdateAvailable: "installation.update-available",

  // Server (2)
  ServerConnected: "server.connected",
  ServerInstanceDisposed: "server.instance.disposed",

  // TUI (3)
  TuiPromptAppend: "tui.prompt.append",
  TuiCommandExecute: "tui.command.execute",
  TuiToastShow: "tui.toast.show",

  // Permission (2)
  PermissionUpdated: "permission.updated",
  PermissionReplied: "permission.replied",

  // VCS (1)
  VcsBranchUpdated: "vcs.branch.updated",

  // PTY (4)
  PtyCreated: "pty.created",
  PtyUpdated: "pty.updated",
  PtyExited: "pty.exited",
  PtyDeleted: "pty.deleted",

  // Todo (1)
  TodoUpdated: "todo.updated",
} as const

export type EventType = Event["type"]

// ─── Compile-Time Verification ──────────────────────────────────────────────
// Simple check: every value in EVENT is a valid SDK event type.
// Catches typos in EVENT values and SDK-removed events at compile time.

const _verifyExhaustive: EventType[] = Object.values(EVENT)

// ── Optional: Full exhaustiveness check ─────────────────────────────────────
// Uncomment to verify ALL SDK events are covered. Catches newly added events.
// This will fail compilation if any SDK event type is missing from EVENT above.
//
// type EventValues = (typeof EVENT)[keyof typeof EVENT]
// type MissingEvents = Exclude<EventType, EventValues>
// const _assertComplete: MissingEvents extends never ? true : { missing: MissingEvents } = true
// ────────────────────────────────────────────────────────────────────────────
