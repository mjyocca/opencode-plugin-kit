import type { Hooks } from "@opencode-ai/plugin"

// ─── Hook Input/Output Types ────────────────────────────────────────────────
// All types are derived from the Hooks interface in @opencode-ai/plugin.
// Zero duplication — automatically stays in sync with SDK updates.

// ── Helper Types ────────────────────────────────────────────────────────────

// Extracts the `input` parameter from a hook function signature.
type InputOf<H> = H extends (input: infer I, output: any) => any
  ? I
  : H extends (input: infer I) => any
    ? I
    : void

// Extracts the `output` parameter from a hook function signature.
type OutputOf<H> = H extends (input: any, output: infer O) => any
  ? O
  : H extends (...args: any) => any
    ? void
    : H

// ── Hook Types Namespace ────────────────────────────────────────────────────

export namespace Hook {
  // ── Chat Pipeline ────────────────────────────────────────────────────────

  export namespace chat {
    export type MessageInput = InputOf<Hooks["chat.message"]>
    export type MessageOutput = OutputOf<Hooks["chat.message"]>

    export type ParamsInput = InputOf<Hooks["chat.params"]>
    export type ParamsOutput = OutputOf<Hooks["chat.params"]>

    export type HeadersInput = InputOf<Hooks["chat.headers"]>
    export type HeadersOutput = OutputOf<Hooks["chat.headers"]>
  }

  // ── Tool Lifecycle ───────────────────────────────────────────────────────

  export namespace tool {
    export type ExecuteBeforeInput = InputOf<Hooks["tool.execute.before"]>
    export type ExecuteBeforeOutput = OutputOf<Hooks["tool.execute.before"]>

    export type ExecuteAfterInput = InputOf<Hooks["tool.execute.after"]>
    export type ExecuteAfterOutput = OutputOf<Hooks["tool.execute.after"]>

    export type DefinitionInput = InputOf<Hooks["tool.definition"]>
    export type DefinitionOutput = OutputOf<Hooks["tool.definition"]>
  }

  // ── Permission ───────────────────────────────────────────────────────────

  export namespace permission {
    export type AskInput = InputOf<Hooks["permission.ask"]>
    export type AskOutput = OutputOf<Hooks["permission.ask"]>
  }

  // ── Command ──────────────────────────────────────────────────────────────

  export namespace command {
    export type ExecuteBeforeInput = InputOf<Hooks["command.execute.before"]>
    export type ExecuteBeforeOutput = OutputOf<Hooks["command.execute.before"]>
  }

  // ── Shell ────────────────────────────────────────────────────────────────

  export namespace shell {
    export type EnvInput = InputOf<Hooks["shell.env"]>
    export type EnvOutput = OutputOf<Hooks["shell.env"]>
  }

  // ── Experimental ─────────────────────────────────────────────────────────

  export namespace experimental {
    export namespace chat {
      export type MessagesTransformInput = InputOf<Hooks["experimental.chat.messages.transform"]>
      export type MessagesTransformOutput = OutputOf<Hooks["experimental.chat.messages.transform"]>

      export type SystemTransformInput = InputOf<Hooks["experimental.chat.system.transform"]>
      export type SystemTransformOutput = OutputOf<Hooks["experimental.chat.system.transform"]>
    }

    export namespace provider {
      export type SmallModelInput = InputOf<Hooks["experimental.provider.small_model"]>
      export type SmallModelOutput = OutputOf<Hooks["experimental.provider.small_model"]>
    }

    export namespace session {
      export type CompactingInput = InputOf<Hooks["experimental.session.compacting"]>
      export type CompactingOutput = OutputOf<Hooks["experimental.session.compacting"]>

      export type CompactionAutoContinueInput = InputOf<Hooks["experimental.compaction.autocontinue"]>
      export type CompactionAutoContinueOutput = OutputOf<Hooks["experimental.compaction.autocontinue"]>
    }

    export namespace text {
      export type CompleteInput = InputOf<Hooks["experimental.text.complete"]>
      export type CompleteOutput = OutputOf<Hooks["experimental.text.complete"]>
    }
  }
}
