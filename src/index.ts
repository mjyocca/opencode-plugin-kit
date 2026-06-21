import type { Plugin } from "@opencode-ai/plugin";
import type { Event } from "@opencode-ai/sdk";
import { tool } from "@opencode-ai/plugin";
import { createSdkLogger } from "./lib/logger.js";
import { PLUGIN_ID } from "./lib/constants.js";

export const PluginTuiServer: Plugin = async ({
  client,
  project,
  directory,
}) => {
  const logger = createSdkLogger(client, PLUGIN_ID, "DEBUG_PLUGIN_TUI");

  await logger.info(
    `Active — project: ${project ?? "(none)"}, dir: ${directory}`,
  );

  const handleEvent = async ({ event }: { event: Event }): Promise<void> => {
    await logger.debug(`[EVENT] ${event.type}`);

    switch (event.type) {
      case "session.created":
        await logger.debug(`session.created — id: ${event.properties.info.id}`);
        break;

      case "message.updated":
        await logger.debug(
          `message.updated — session: ${event.properties.info.sessionID}`,
        );
        break;

      case "file.edited":
        await logger.debug(`file.edited — file: ${event.properties.file}`);
        break;

      default:
        await logger.debug(`event: ${event.type}`);
    }
  };

  const helloTool = tool({
    description: "Demo tool — shows that the plugin is loaded and working.",
    args: {},
    execute: async () => {
      return {
        title: "Plugin Kit — Server",
        output: "opencode-plugin-kit server plugin is active.",
      };
    },
  });

  return {
    dispose: async () => {
      await logger.info("Disposing");
    },

    tool: {
      hello: helloTool,
    },

    event: handleEvent,
  };
};

export { PluginTuiServer as default };
