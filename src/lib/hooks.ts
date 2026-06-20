// ─── Hook Constants ─────────────────────────────────────────────────────────
// Single source of truth for all opencode plugin hook names.
// Provides autocomplete and prevents typos in hook definitions.
//
// Usage: [hooks.chat.message] instead of "chat.message"

export const hooks = {
  // ── Chat Pipeline ──────────────────────────────────────────────────────────

  chat: {
    message: "chat.message",
    params: "chat.params",
    headers: "chat.headers",
  },

  // ── Tool Lifecycle ─────────────────────────────────────────────────────────

  tool: {
    executeBefore: "tool.execute.before",
    executeAfter: "tool.execute.after",
    definition: "tool.definition",
  },

  // ── Permission ─────────────────────────────────────────────────────────────

  permission: {
    ask: "permission.ask",
  },

  // ── Command ────────────────────────────────────────────────────────────────

  command: {
    executeBefore: "command.execute.before",
  },

  // ── Shell ──────────────────────────────────────────────────────────────────

  shell: {
    env: "shell.env",
  },

  // ── Experimental ───────────────────────────────────────────────────────────

  experimental: {
    chat: {
      messagesTransform: "experimental.chat.messages.transform",
      systemTransform: "experimental.chat.system.transform",
    },
    provider: {
      smallModel: "experimental.provider.small_model",
    },
    session: {
      compacting: "experimental.session.compacting",
      compactionAutoContinue: "experimental.compaction.autocontinue",
    },
    text: {
      complete: "experimental.text.complete",
    },
  },
} as const

// ── Union Type ──────────────────────────────────────────────────────────────

export type HookPath =
  | (typeof hooks.chat)[keyof typeof hooks.chat]
  | (typeof hooks.tool)[keyof typeof hooks.tool]
  | (typeof hooks.permission)[keyof typeof hooks.permission]
  | (typeof hooks.command)[keyof typeof hooks.command]
  | (typeof hooks.shell)[keyof typeof hooks.shell]
  | (typeof hooks.experimental.chat)[keyof typeof hooks.experimental.chat]
  | (typeof hooks.experimental.provider)[keyof typeof hooks.experimental.provider]
  | (typeof hooks.experimental.session)[keyof typeof hooks.experimental.session]
  | (typeof hooks.experimental.text)[keyof typeof hooks.experimental.text]
