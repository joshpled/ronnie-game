# Ronnie — A little home

A cozy 2D pet-care prototype starring **Ronnie (she/her)**, based on her owner's dog photos. Built with Phaser and TypeScript, initially for Safari on iPhone. No Swift application code.

## Play

Public prototype: **https://joshpled.github.io/ronnie-game/** (available after the first Pages deployment).

Tap the rug to call Ronnie over. Tap her, or use **Pet**, to show affection. **Feed** restores fullness, **Play** starts a ball chase, and **Rest** restores energy over time. While she rests, **Wake** brings her back. The call button provides an alternative to tapping the canvas.

For a Home Screen shortcut on iPhone, open the game in Safari and use **Share → Add to Home Screen** (Share may be inside the More menu). Turn on **Open as Web App**, then tap **Add**. [Apple's instructions](https://support.apple.com/guide/iphone/iphea86e5236/ios). This is a browser prototype, not a TestFlight or App Store build. An internet connection is currently needed to open/reload it; the manifest does not provide offline caching.

Progress saves in this browser's local storage. There are no accounts, analytics, external fonts, game servers, or uploads of care data. Different browsers/devices have separate saves. Clearing website data clears progress. If browser storage is unavailable, the game still runs and shows that the session cannot be saved.

## Develop

Use Node.js 22 (tested on 22.16) and npm.

```sh
npm ci
npm run dev
```

Open the printed localhost address on your Mac. To test on an iPhone connected to the same Wi-Fi, use the printed network address (for example, `http://192.168.1.10:5173`). The development server must keep running, and the Mac firewall must permit the connection.

```sh
npm run check       # TypeScript, ESLint, model tests, production build
npm run format     # Format source and documentation
npm run build
npm run preview    # Serve the production build locally
```

No environment variables or API keys are required. `vite.config.ts` uses relative asset paths so the build works under the GitHub Pages repository path.

## What is implemented

- A portrait room with a window, rug, cushion, bowl, and animated Ronnie.
- Tap-to-move, gentle wandering, affection, feeding, a ball chase, rest/wake.
- Fullness, happiness, energy, and a count of completed care moments.
- Saved progress and time-based needs, capped at eight hours away.
- Accessible HTML care controls, readable status messages, and reduced-motion support.

This first prototype reuses the approved desktop pet atlas. Feeding uses her downward gaze; rest uses a seated pose. Dedicated eating and sleeping artwork is available in the [approved animation library](docs/animation-library/README.md), with disclosed motion limitations; it is not integrated into gameplay. Toy-carrying art remains future work. The existing small sprites may look soft when enlarged. Canvas details do not have a full screen-reader equivalent, although all care actions are available as HTML buttons.

## Project map

Start with [the Kanban board](KANBAN.md) for current work, open reviews and future ideas. The [project manager workflow](docs/project-management.md) explains how the agent keeps it current from idea to completion.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the ownership boundaries, [docs/decisions.md](docs/decisions.md) for decisions and tradeoffs, and [docs/validation.md](docs/validation.md) for checks and remaining device testing.

`public/assets/ronnie.webp` is the previously approved 1536 × 2288 pet atlas. Source photographs are not included. The character artwork is supplied for this Ronnie project; no separate license to reuse the character is granted by making this repository public.
