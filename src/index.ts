import type { Plugin, Hooks } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { createLogger } from "./lib/logger.js";
import { EVENT } from "./lib/events.js";

const PLUGIN_ID = "opencode-plugin-tui";
const log = createLogger(PLUGIN_ID, "DEBUG_PLUGIN_TUI");

const handleEvent: NonNullable<Hooks["event"]> = async (input) => {
  const { event } = input;
  log.debug(`[EVENT] ${event.type}`);

  switch (event.type) {
    case EVENT.SessionCreated:
      log.debug(`session.created — id: ${event.properties.info.id}`);
      break;

    case EVENT.MessageUpdated:
      log.debug(
        `message.updated — session: ${event.properties.info.sessionID}`,
      );
      break;

    case EVENT.FileEdited:
      log.debug(`file.edited — file: ${event.properties.file}`);
      break;

    default:
      log.debug(`event: ${event.type}`);
  }
};

export const PluginTuiServer: Plugin = async ({ project, directory }) => {
  log.info(`Active — project: ${project ?? "(none)"}, dir: ${directory}`);

  const helloTool = tool({
    description: "Demo tool — shows that the plugin is loaded and working.",
    args: {},
    execute: async () => {
      return {
        title: "Plugin TUI — Server",
        output: "opencode-plugin-tui server plugin is active.",
      };
    },
  });

  return {
    dispose: async () => {
      log.info("Disposing");
    },

    tool: {
      hello: helloTool,
    },

    event: handleEvent,
  };
};

export { PluginTuiServer as default };
