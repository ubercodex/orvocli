```
▀▀█ ▄▀▀▄ █   
▄▀  █▀▀█ █   
▀▀▀ ▀  ▀ ▀▀▀
```

An AI-powered terminal assistant built with [Ink](https://github.com/vadimdemedes/ink) and TypeScript. Chat with multiple LLM providers, extend the AI with custom tools, and manage tool profiles — all from your terminal.

Runs natively on **Windows**, **macOS**, and **Linux**.

## Features

- **LLM Chat** — streaming chat with Anthropic, Google, and OpenAI models; chat is the default view on launch
- **Multi-provider** — configure API keys and models per provider; the first configured provider is used automatically
- **Tool calling** — AI can call tools mid-conversation (e.g. get the current date/time, fetch live data)
- **Plugin system** — create custom tools by describing what you want; AI generates the code and registers it
- **Tool profiles** — group tools into named profiles; activate a profile to restrict the AI to only those tools
- **Themes** — 5 built-in colour themes (Ocean Blue, Matrix Green, Neon Purple, Crimson, Amber)
- **Encrypted API keys** — keys are stored AES-256-GCM encrypted, derived from your machine identity
- **Per-workspace settings** — settings and plugins are stored in `.zal/` relative to your working directory

## Requirements

- Node.js >= 18

## Installation

```bash
git clone https://github.com/ubercodex/zalcli.git
cd zalcli
npm install
npm link
```

Then run from anywhere:

```bash
zal
```

## Usage

Just type — the chat interface opens immediately. Type `/` to open the command palette:

| Command | Description |
|---|---|
| `/settings` | Configure API keys, models, and theme |
| `/plugins` | Manage tools and profiles |
| `/exit` | Exit |

### Settings (`/settings`)

Set your API key and preferred model for each provider (Anthropic, Google, OpenAI).

### Plugins (`/plugins`)

#### Manage Tools
- **Enable / disable** any tool with `Space`
- **View / edit** a tool with `Enter`
  - `Ctrl+A` — describe a change in plain English; AI updates the code automatically
  - `Ctrl+E` — open the code in your OS default editor (`$EDITOR`, or Notepad on Windows)
  - `Ctrl+T` — test the tool interactively (prompts for each param)
  - `Ctrl+D` — delete the tool
- **Create a new tool** — select `+ New tool`, describe what it should do, AI generates name + params + code

#### Manage Profiles
- Create named profiles and assign any subset of tools to each
- Press `A` on a profile to **activate** it — the AI will only call tools in that profile
- The active profile name is shown in the splash screen on every launch

## Development

```bash
npm run dev   # run with file watching
npm start     # run once
npm run build # type-check + compile
```

## Attribution

ZAL CLI is open source. If you build a tool, product, or project on top of it, a mention of **ZAL CLI** in your README, about screen, or documentation is appreciated — it helps the project grow.

> _"Built with [ZAL CLI](https://github.com/ubercodex/zalcli)"_

## License

MIT — see [LICENSE](./LICENSE)
