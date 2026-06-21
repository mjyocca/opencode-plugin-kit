# OpenCode Ecosystem Reference

Curated links to community plugins, projects, and agents built with OpenCode.

For the complete overview of the plugin architecture, see [OpenCode Plugin Architecture](./opencode-plugin-architecture.md).

---

## Official Ecosystem Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Official ecosystem page | https://opencode.ai/docs/ecosystem/ | Complete list maintained by OpenCode team |
| awesome-opencode | https://github.com/awesome-opencode/awesome-opencode | Community awesome list |
| opencode.cafe | https://opencode.cafe | Community hub aggregating ecosystem |

---

## Notable Plugins

These plugins extend OpenCode with new capabilities. Browse the complete list at [opencode.ai/docs/ecosystem#plugins](https://opencode.ai/docs/ecosystem#plugins).


### Session & Workflow Enhancement

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-helicone-session | Inject Helicone session headers for request grouping | [H2Shami/opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session) |
| opencode-skillful | Lazy load prompts on demand with skill discovery | [zenobi-us/opencode-skillful](https://github.com/zenobi-us/opencode-skillful) |
| opencode-supermemory | Persistent memory across sessions | [supermemoryai/opencode-supermemory](https://github.com/supermemoryai/opencode-supermemory) |
| opencode-background-agents | Claude Code-style background agents | [kdcokenny/opencode-background-agents](https://github.com/kdcokenny/opencode-background-agents) |
| micode | Structured Brainstorm → Plan → Implement workflow | [vtemian/micode](https://github.com/vtemian/micode) |
| opencode-conductor | Protocol-driven automation workflow | [derekbar90/opencode-conductor](https://github.com/derekbar90/opencode-conductor) |

### Provider Authentication

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-gemini-auth | Use Gemini plan instead of API billing | [jenslys/opencode-gemini-auth](https://github.com/jenslys/opencode-gemini-auth) |
| opencode-antigravity-auth | Use Antigravity's free models | [NoeFabris/opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) |
| opencode-openai-codex-auth | Use ChatGPT Plus/Pro subscription | [numman-ali/opencode-openai-codex-auth](https://github.com/numman-ali/opencode-openai-codex-auth) |

### Code Quality & Optimization

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-dynamic-context-pruning | Optimize token usage by pruning obsolete outputs | [Tarquinen/opencode-dynamic-context-pruning](https://github.com/Tarquinen/opencode-dynamic-context-pruning) |
| opencode-vibeguard | Redact secrets/PII before LLM calls | [inkdust2021/opencode-vibeguard](https://github.com/inkdust2021/opencode-vibeguard) |
| opencode-type-inject | Auto-inject TypeScript/Svelte types | [nick-vi/opencode-type-inject](https://github.com/nick-vi/opencode-type-inject) |
| opencode-morph-fast-apply | 10x faster code editing with Morph API | [JRedeker/opencode-morph-fast-apply](https://github.com/JRedeker/opencode-morph-fast-apply) |
| opencode-md-table-formatter | Clean up markdown tables | [franlol/opencode-md-table-formatter](https://github.com/franlol/opencode-md-table-formatter) |

### Development Environment

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-daytona | Run sessions in isolated Daytona sandboxes | [daytonaio/daytona](https://github.com/daytonaio/daytona/tree/main/libs/opencode-plugin) |
| opencode-devcontainers | Multi-branch devcontainer isolation | [athal7/opencode-devcontainers](https://github.com/athal7/opencode-devcontainers) |
| opencode-worktree | Zero-friction git worktrees | [kdcokenny/opencode-worktree](https://github.com/kdcokenny/opencode-worktree) |
| opencode-pty | Background processes in a PTY | [shekohex/opencode-pty](https://github.com/shekohex/opencode-pty) |

### Notifications & Monitoring

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-notificator | Desktop notifications and sound alerts | [panta82/opencode-notificator](https://github.com/panta82/opencode-notificator) |
| opencode-notify | Native OS notifications | [kdcokenny/opencode-notify](https://github.com/kdcokenny/opencode-notify) |
| opencode-wakatime | Wakatime usage tracking | [angristan/opencode-wakatime](https://github.com/angristan/opencode-wakatime) |
| opencode-sentry-monitor | Trace and debug with Sentry AI Monitoring | [stolinski/opencode-sentry-monitor](https://github.com/stolinski/opencode-sentry-monitor) |

### Tools & Extensions

| Plugin | Description | GitHub |
|--------|-------------|--------|
| opencode-shell-strategy | Instructions for non-interactive shell commands | [JRedeker/opencode-shell-strategy](https://github.com/JRedeker/opencode-shell-strategy) |
| opencode-websearch-cited | Native websearch with Google grounded style | [ghoulr/opencode-websearch-cited](https://github.com/ghoulr/opencode-websearch-cited) |
| opencode-firecrawl | Web scraping via Firecrawl CLI | [firecrawl/opencode-firecrawl](https://github.com/firecrawl/opencode-firecrawl) |
| opencode-jfrog-plugin | JFrog platform integration | [jfrog/opencode-jfrog-plugin](https://github.com/jfrog/opencode-jfrog-plugin) |
| opencode-scheduler | Schedule recurring jobs with cron | [different-ai/opencode-scheduler](https://github.com/different-ai/opencode-scheduler) |

### Meta & Bundled

| Plugin | Description | GitHub |
|--------|-------------|--------|
| oh-my-opencode | Background agents, LSP/AST/MCP tools, curated agents | [code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) |
| opencode-workspace | Bundled multi-agent orchestration (16 components) | [kdcokenny/opencode-workspace](https://github.com/kdcokenny/opencode-workspace) |

---

## Notable Projects

These projects build on OpenCode or integrate it into other tools. Browse the complete list at [opencode.ai/docs/ecosystem#projects](https://opencode.ai/docs/ecosystem#projects).

### Editor Integrations

| Project | Description | GitHub |
|---------|-------------|--------|
| opencode.nvim | Neovim plugin for editor-aware prompts | [NickvanDyke/opencode.nvim](https://github.com/NickvanDyke/opencode.nvim) |
| opencode.nvim | Neovim frontend for terminal-based AI coding | [sudo-tee/opencode.nvim](https://github.com/sudo-tee/opencode.nvim) |
| OpenCode-Obsidian | Embeds OpenCode in Obsidian's UI | [mtymek/opencode-obsidian](https://github.com/mtymek/opencode-obsidian) |

### Web & Desktop UIs

| Project | Description | GitHub |
|---------|-------------|--------|
| portal | Mobile-first web UI for OpenCode over Tailscale/VPN | [hosenur/portal](https://github.com/hosenur/portal) |
| OpenChamber | Web/Desktop App and VS Code Extension | [btriapitsyn/openchamber](https://github.com/btriapitsyn/openchamber) |
| CodeNomad | Desktop, Web, Mobile and Remote Client App | [NeuralNomadsAI/CodeNomad](https://github.com/NeuralNomadsAI/CodeNomad) |
| OpenWork | Open-source alternative to Claude Cowork | [different-ai/openwork](https://github.com/different-ai/openwork) |

### SDKs & Integrations

| Project | Description | GitHub |
|---------|-------------|--------|
| ai-sdk-provider-opencode-sdk | Vercel AI SDK provider for OpenCode | [ben-vargas/ai-sdk-provider-opencode-sdk](https://github.com/ben-vargas/ai-sdk-provider-opencode-sdk) |
| kimaki | Discord bot to control OpenCode sessions | [remorses/kimaki](https://github.com/remorses/kimaki) |

### Development Tools

| Project | Description | GitHub |
|---------|-------------|--------|
| opencode plugin template | Template for building OpenCode plugins | [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template) |
| ocx | OpenCode extension manager with portable profiles | [kdcokenny/ocx](https://github.com/kdcokenny/ocx) |

### Workflow Tools

| Project | Description | GitHub |
|---------|-------------|--------|
| @plannotator/opencode | Interactive plan review with visual annotation | [backnotprop/plannotator](https://github.com/backnotprop/plannotator/tree/main/apps/opencode-plugin) |
| @openspoon/subtask2 | Extend /commands into orchestration system | [spoons-and-mirrors/subtask2](https://github.com/spoons-and-mirrors/subtask2) |
| octto | Interactive browser UI for AI brainstorming | [vtemian/octto](https://github.com/vtemian/octto) |

---

## Notable Agents

These are custom agent configurations and collections. Browse the complete list at [opencode.ai/docs/ecosystem#agents](https://opencode.ai/docs/ecosystem#agents).

| Agent | Description | GitHub |
|-------|-------------|--------|
| Agentic | Modular AI agents and commands for structured development | [Cluster444/agentic](https://github.com/Cluster444/agentic) |
| opencode-agents | Configs, prompts, agents, and plugins for enhanced workflows | [darrenhinde/opencode-agents](https://github.com/darrenhinde/opencode-agents) |

---

## Contributing to the Ecosystem

Want to add your OpenCode project to the official ecosystem page?

1. Submit a PR to the [OpenCode repo](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/ecosystem.mdx)
2. Add to [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode)
3. Share on [opencode.cafe](https://opencode.cafe)

---

## See Also

- [OpenCode Plugin Architecture](./opencode-plugin-architecture.md) — Plugin system overview
- [SDK Reference](./sdk-reference.md) — Complete SDK API documentation
- [Official Ecosystem](https://opencode.ai/docs/ecosystem/) — Official maintained list
