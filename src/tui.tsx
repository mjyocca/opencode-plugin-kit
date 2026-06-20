/** @jsxImportSource @opentui/solid */

import type { TuiPlugin, TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui";
import { TextAttributes } from "@opentui/core";
import { Show, createSignal } from "solid-js";
import { PLUGIN_ID } from "./lib/constants.js";

const SIDEBAR_ORDER = 300;
const COMPACT_ORDER = 90;
const REFRESH_INTERVAL_MS = 5000;

/**
 * Logs to SDK if available, falls back to stderr.
 * TUI plugins may not have reliable client access, so we use optional chaining.
 */
function log(api: TuiPluginApi, level: "info" | "warn" | "error" | "debug", msg: string) {
  const client = (api as any).client;
  if (client?.app?.log) {
    // SDK logging available (async, but we don't await in TUI context)
    void client.app.log({
      level,
      message: `[${PLUGIN_ID}] ${msg}`,
      extra: {},
    });
  } else {
    // Fallback to stderr for TUI
    const prefix = level === "debug" ? "DEBUG: " : level === "warn" ? "WARN: " : level === "error" ? "ERROR: " : "";
    process.stderr.write(`[${PLUGIN_ID}] ${prefix}${msg}\n`);
  }
}

function todayMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function CompactStatusLine(props: {
  api: TuiPluginApi;
  text: () => string;
  justifyContent: "flex-start" | "center" | "flex-end";
}) {
  return (
    <Show when={props.text()}>
      <box flexDirection="row" justifyContent={props.justifyContent}>
        <text fg={props.api.theme.current.textMuted} wrapMode="none">
          {props.text()}
        </text>
      </box>
    </Show>
  );
}

function SidebarPanel(props: { api: TuiPluginApi; statusText: () => string }) {
  const theme = () => props.api.theme.current;

  return (
    <box padding={1}>
      <text attributes={TextAttributes.BOLD} fg={theme().text}>
        Plugin TUI
      </text>
      <text fg={theme().textMuted}>
        {"\n"}
        {props.statusText()}
      </text>
    </box>
  );
}

function HomeBottomView(props: { api: TuiPluginApi; compactText: () => string }) {
  return (
    <box gap={0}>
      <text> </text>
      <CompactStatusLine api={props.api} text={props.compactText} justifyContent="center" />
    </box>
  );
}

function SessionPromptWithStatus(props: {
  api: TuiPluginApi;
  sessionID: string;
  compactText: () => string;
  visible?: boolean;
  disabled?: boolean;
  onSubmit?: () => void;
}) {
  const Prompt = props.api.ui?.Prompt;
  if (!Prompt) {
    return <CompactStatusLine api={props.api} text={props.compactText} justifyContent="flex-end" />;
  }
  return (
    <box gap={0}>
      <Prompt
        sessionID={props.sessionID}
        visible={props.visible}
        disabled={props.disabled}
        onSubmit={props.onSubmit}
      />
      <CompactStatusLine api={props.api} text={props.compactText} justifyContent="flex-end" />
    </box>
  );
}

const tui: TuiPlugin = async (api, _options) => {
  log(api, "info", "TUI plugin initializing");

  const [statusText, setStatusText] = createSignal("Initializing...");
  const [compactText, setCompactText] = createSignal("");

  function refreshStatus() {
    const now = new Date().toLocaleTimeString();
    setStatusText(`Plugin TUI Loaded — ${todayMonth()} — ${now}`);
    setCompactText(`[${PLUGIN_ID}] active`);
  }

  refreshStatus();
  const interval = setInterval(refreshStatus, REFRESH_INTERVAL_MS);
  const unsubEvent = api.event.on("session.idle", () => {
    refreshStatus();
  });

  log(api, "info", "TUI plugin initialized — slots registered");

  api.slots.register({
    order: SIDEBAR_ORDER,
    slots: {
      sidebar_content: (_ctx, _props) => <SidebarPanel api={api} statusText={statusText} />,
    },
  });

  api.slots.register({
    order: COMPACT_ORDER,
    slots: {
      home_bottom: () => <HomeBottomView api={api} compactText={compactText} />,
      session_prompt: (_ctx, props) => (
        <SessionPromptWithStatus
          api={api}
          sessionID={props.session_id}
          compactText={compactText}
          visible={props.visible}
          disabled={props.disabled}
          onSubmit={props.on_submit}
        />
      ),
    },
  });

  api.lifecycle.onDispose(() => {
    log(api, "info", "TUI plugin disposing");
    clearInterval(interval);
    unsubEvent();
  });
};

const plugin: TuiPluginModule & { id: string } = {
  id: PLUGIN_ID,
  tui,
};

export default plugin;
