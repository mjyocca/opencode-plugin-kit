/** @jsxImportSource @opentui/solid */

import { TextAttributes } from "@opentui/core";
import { Show, createSignal } from "solid-js";

const PLUGIN_ID = "opencode-plugin-tui";

function todayMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const plugin = {
  id: PLUGIN_ID,
  tui: async (api: any, _options: any) => {
    const [statusText, setStatusText] = createSignal("Initializing...");
    const [compactText, setCompactText] = createSignal("");

    function refreshStatus() {
      const now = new Date().toLocaleTimeString();
      setStatusText(`Plugin TUI Loaded — ${todayMonth()} — ${now}`);
      setCompactText(`[${PLUGIN_ID}] active`);
    }

    refreshStatus();
    const interval = setInterval(refreshStatus, 5000);
    const unsubEvent = api.event.on("session.idle", () => {
      refreshStatus();
    });

    function SidebarPanel(ctx: any, _props: any) {
      const theme = () => ctx.theme.current;

      return (
        <box padding={1}>
          <text attributes={TextAttributes.BOLD} fg={theme().text}>
            Plugin TUI
          </text>
          <text fg={theme().textMuted}>{"\n"}{statusText()}</text>
        </box>
      );
    }

    function CompactStatusLine(props: { text: () => string; justifyContent: "flex-start" | "center" | "flex-end" }) {
      return (
        <Show when={props.text()}>
          <box flexDirection="row" justifyContent={props.justifyContent}>
            <text fg={api.theme.current.textMuted} wrapMode="none">
              {props.text()}
            </text>
          </box>
        </Show>
      );
    }

    function HomeBottomView() {
      return (
        <box gap={0}>
          <text> </text>
          <CompactStatusLine text={() => compactText()} justifyContent="center" />
        </box>
      );
    }

    function SessionPromptWithStatus(props: { sessionID: string; visible?: boolean; disabled?: boolean; onSubmit?: () => void }) {
      const Prompt = api.ui?.Prompt;
      if (!Prompt) {
        return <CompactStatusLine text={() => compactText()} justifyContent="flex-end" />;
      }
      return (
        <box gap={0}>
          <Prompt
            sessionID={props.sessionID}
            visible={props.visible}
            disabled={props.disabled}
            onSubmit={props.onSubmit}
          />
          <CompactStatusLine text={() => compactText()} justifyContent="flex-end" />
        </box>
      );
    }

    api.slots.register({
      order: 300,
      slots: {
        sidebar_content: SidebarPanel,
      },
    });

    api.slots.register({
      order: 90,
      slots: {
        home_bottom: () => <HomeBottomView />,
        home_footer: () => <HomeBottomView />,
        session_prompt: (_ctx: any, props: any) => (
          <SessionPromptWithStatus
            sessionID={props.session_id}
            visible={props.visible}
            disabled={props.disabled}
            onSubmit={props.on_submit}
          />
        ),
      },
    });

    api.lifecycle.onDispose(() => {
      clearInterval(interval);
      unsubEvent();
    });
  },
};

export default plugin;
