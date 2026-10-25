<div align="center">

# OpenCluely

**A desktop AI assistant that answers what you ask by voice, text, or screenshot.**

Answers come from Google Gemini, OpenAI, or a free model running on your own computer through Ollama.

<p>
  <a href="https://github.com/Kaberia-Timo/OpenCluely/releases/latest"><img src="https://img.shields.io/github/v/release/Kaberia-Timo/OpenCluely?style=for-the-badge&label=Latest&color=111111&labelColor=000000" alt="Latest release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-111111?style=for-the-badge&labelColor=000000" alt="Apache 2.0 License" /></a>
  <img src="https://img.shields.io/badge/Platforms-Windows%20%7C%20Linux%20%7C%20macOS%20(source)-111111?style=for-the-badge&labelColor=000000" alt="Platforms" />
</p>

<a href="#install-on-windows"><b>Install</b></a> &nbsp;|&nbsp;
<a href="#choose-an-ai-provider">Choose a provider</a> &nbsp;|&nbsp;
<a href="#using-opencluely">Use it</a> &nbsp;|&nbsp;
<a href="#run-from-source">Run from source</a>

</div>

> This is a fork of [TechyCSR/OpenCluely](https://github.com/TechyCSR/OpenCluely), released under the same Apache 2.0 license. See [What this fork changes](#what-this-fork-changes).

## What it does

OpenCluely puts a small floating window on your screen. You can:

- **Type** a question in the chat window.
- **Speak** a question. It's transcribed on your computer with Whisper.
- **Take a screenshot.** It answers every question visible on screen, numbered to match.

Answers are short by default and stream in as they're written. Ask it to "explain" or "go into detail" when you want more. It remembers the conversation, so follow-up questions work.

## Install on Windows

You don't need any command-line tools for this.

1. Open the [latest release](https://github.com/Kaberia-Timo/OpenCluely/releases/latest).
2. Download **`OpenCluely-Setup-<version>.exe`**.
3. Run it. Windows may show **"Windows protected your PC"**, because the installer isn't code-signed. Click **More info**, then **Run anyway**.
4. Pick an install folder and finish. The installer adds Start Menu and desktop shortcuts.
5. Start **OpenCluely**. A setup wizard opens on first launch:
   - **AI provider:** choose Gemini, OpenAI, or Ollama. See [Choose an AI provider](#choose-an-ai-provider).
   - **Speech (optional):** choose local Whisper and click **Install**, or skip it.

You can change any of this later in **Settings** (`Ctrl + ,`).

> **Linux:** the same release page has a `.deb` (Debian/Ubuntu) and an `.AppImage`. **macOS:** there's no pre-built app, because unsigned apps are blocked by Gatekeeper. Use [Run from source](#run-from-source).

## Choose an AI provider

| Provider | Cost | Speed | Reads screenshots | What you need |
|---|---|---|---|---|
| **Google Gemini** | Free tier, with a daily limit | Fast, 1–5 s | Yes | A free API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenAI** | Pay per use, about $0.001 per question | Fast, 1–5 s | Yes | An API key and prepaid credit from [platform.openai.com](https://platform.openai.com/api-keys). A ChatGPT Plus subscription doesn't include API use. |
| **Ollama (local)** | Free, unlimited, private | Depends on your PC, 15–90 s on a laptop CPU | With a vision model such as `gemma3:4b` | [Ollama](https://ollama.com/download) installed, plus one downloaded model |

### Setting up Ollama (free, runs on your computer)

1. Install Ollama from [ollama.com/download](https://ollama.com/download). It starts automatically and shows a llama icon in the system tray.
2. Download a model once. Open **Command Prompt** or **PowerShell** and run:

   ```bash
   ollama pull gemma3:4b
   ```

   `gemma3:4b` is about 3.3 GB, reads screenshots, and runs on a normal laptop. With a dedicated graphics card you can try bigger models.
3. In OpenCluely, choose **Ollama (local, free)** in the wizard or in **Settings → AI Provider**, and enter the model name (`gemma3:4b`).

Nothing leaves your computer with Ollama. Speed depends on your hardware: without a graphics card that Ollama can use, expect about 15–30 s for a short answer and 45–90 s for a screenshot.

### Other OpenAI-compatible services

Choose **Other OpenAI-compatible** in **Settings → AI Provider** and enter the service's server address (ending in `/v1`), API key, and model. This works with xAI, DeepSeek, Groq, Mistral, LM Studio and similar services.

## Using OpenCluely

| Action | Shortcut |
|---|---|
| Screenshot and answer | `Ctrl + Shift + S` |
| Start or stop voice input | `Alt + R` |
| Open the chat window | `Ctrl + Shift + C` |
| Show or hide all windows | `Ctrl + Shift + V` |
| Make the overlay clickable or click-through | `Ctrl + Shift + I` or `Alt + A` |
| Settings | `Ctrl + ,` |

On macOS, use `Cmd` instead of `Ctrl`.

**To quit:** open Settings (`Ctrl + ,`) and click **Quit**.

**Answer length:**
- Typed and spoken questions get short answers, 1–3 sentences or a few bullets.
- Ask with words like "explain", "in detail" or "step by step" for a full answer.
- Screenshots answer every question shown. Factual questions get short answers; open-ended questions ("How would you…", "What would you do if…") get a few sentences with concrete steps.
- Coding questions always get complete code.

**Tip:** with voice input on, everything the microphone hears can trigger a request. Turn it off with `Alt + R` when you aren't asking questions, especially on Gemini's free tier.

## Run from source

Use this for macOS, for development, or if you'd rather not run an installer.

**Prerequisites:** [Node.js 20+](https://nodejs.org/) and [Git](https://git-scm.com/). Voice input also needs [Python 3.10+](https://www.python.org/downloads/).

```bash
git clone https://github.com/Kaberia-Timo/OpenCluely.git
```

```bash
cd OpenCluely
```

```bash
npm install
```

```bash
npx electron .
```

On first launch the setup wizard opens, the same as in the installed app. To set things up without the wizard, copy `env.example` to `.env` and edit it (see [Configuration](#configuration)).

On macOS and Linux, or in Git Bash on Windows, `./setup.sh` does all of the above and also prepares local Whisper for voice input.

## Build the installer yourself

```bash
npm run build:win
```

The installer appears in `dist/` as `OpenCluely-Setup-<version>.exe`. Use `npm run build:linux` for Linux packages.

### Publishing a release

Releases are built automatically by GitHub Actions ([`.github/workflows/release.yml`](.github/workflows/release.yml)). Push a version tag and the workflow builds the Windows installer and Linux packages, then attaches them to a new GitHub Release with SHA-256 checksums:

```bash
git tag v1.1.0
```

```bash
git push origin v1.1.0
```

## Configuration

Settings live in a `.env` file. The Settings window and setup wizard write it for you.

- **Installed app (Windows):** `%APPDATA%\OpenCluely\.env`
- **Running from source:** `.env` in the project folder

```bash
# AI provider: gemini (default) or openai (also used for Ollama and other compatible services)
LLM_PROVIDER=gemini

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI or an OpenAI-compatible service
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# Example: local Ollama instead
# LLM_PROVIDER=openai
# OPENAI_BASE_URL=http://localhost:11434/v1
# OPENAI_MODEL=gemma3:4b
# OPENAI_API_KEY=ollama

# Speech (optional): whisper (local) or azure
SPEECH_PROVIDER=whisper
WHISPER_MODEL=base
```

See [`env.example`](env.example) for every option, including Azure Speech and Whisper tuning.

## Troubleshooting

<details>
<summary><b>The answer says "I'm having trouble processing that right now…"</b></summary>

That's a fallback message shown when the AI request failed. Common causes:

- **Gemini daily limit reached.** The free tier allows a limited number of requests per day per model. Wait for the reset, enable billing on your Google AI project, or switch provider in Settings.
- **Ollama isn't running.** Start Ollama from the Start menu, and check that the model name matches `ollama list`.
- **Wrong or missing API key.** Re-enter it in Settings → AI Provider.

The detailed error is in the log files at `%USERPROFILE%\.OpenCluely\logs\`.
</details>

<details>
<summary><b>Answers are slow with Ollama</b></summary>

Local models run on your processor unless Ollama can use your graphics card. Smaller models are faster: `gemma3:4b` is a good balance, and `gemma3:1b` is faster but simpler. Screenshots are the slowest, because the image itself takes time to analyse. For fast screenshot answers, use Gemini or OpenAI.
</details>

<details>
<summary><b>Screenshots aren't answered, or the answer describes the screen</b></summary>

Make sure the provider supports images: with Ollama, use a vision model such as `gemma3:4b`. Some older text-only models, like `llama2`, can't read images. Small local models occasionally merge or skip questions on very long lists.
</details>

<details>
<summary><b>Voice input doesn't work</b></summary>

Voice is optional. For local Whisper, install Python 3.10+, then open Settings or rerun the wizard and click **Install**. The microphone button hides itself when no speech provider is configured.
</details>

<details>
<summary><b>Windows SmartScreen blocks the installer</b></summary>

The installer isn't code-signed. Click **More info**, then **Run anyway**. You can check the download against `SHA256SUMS.txt` on the release page.
</details>

## Privacy and responsible use

- OpenCluely sends no telemetry. Your questions, screenshots and voice transcripts go only to the AI provider you choose. With Ollama, nothing leaves your computer.
- On Windows and macOS, the overlay is excluded from screen capture and screen sharing by design.
- Use OpenCluely only where AI assistance is allowed. Don't use it to get answers in exams, interviews or other situations where you're expected to work unaided. Your AI provider's usage policy applies to everything you send.

## What this fork changes

Compared with [TechyCSR/OpenCluely](https://github.com/TechyCSR/OpenCluely):

- **Answers any topic,** not only data structures and algorithms (DSA).
- **More AI providers:** OpenAI, local Ollama, and other OpenAI-compatible services alongside Gemini. You choose in the setup wizard or Settings.
- **Concise answers by default,** with detail when you ask for it. This makes local models about 4× faster for everyday questions.
- **Better screenshots:** captures at full resolution on scaled displays (they were blurry at 150% scaling), and every question on screen gets answered instead of the screen being described.
- **Quieter logs:** the repeating "Source is not capturable" error is fixed.

## License

Apache License 2.0. See [LICENSE](LICENSE). Original project by [TechyCSR](https://github.com/TechyCSR/OpenCluely). This fork's changes are listed above and in the git history.

## Acknowledgments

- [TechyCSR/OpenCluely](https://github.com/TechyCSR/OpenCluely), the original project
- Google Gemini, OpenAI and [Ollama](https://ollama.com) for the AI backends
- OpenAI Whisper and Azure Speech for voice input
- Electron for the desktop runtime
