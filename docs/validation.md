# Prototype validation

Checked September 13, 2026.

## Automated source checks

`npm run check` runs TypeScript, ESLint, five Node test cases, and a production build. Tests cover action rewards, bounds, capped time away, duplicate elapsed-time application, rest restoration, invalid saves, and future saved timestamps. The dependency audit reported no known vulnerabilities at build time.

## Browser checks

Headless Chrome and WebKit 26.5 were exercised with touch-capable iPhone-sized viewports. This is browser emulation, **not a physical iPhone test**.

- All assets loaded without console exceptions or failed responses.
- Feed increased fullness from 68 to 93; pet increased happiness from 76 to 84.
- Ball play increased happiness and used energy; each completed care action counted once.
- Eight extra Feed clicks while busy did not create extra rewards.
- Tapping Ronnie directly triggered affection; tapping the floor triggered movement.
- Rest/wake worked and resting remained active after a reload.
- A saved resting state at 20 energy, last updated one hour earlier, restored to 44 energy.
- When browser storage rejected writes, care still worked and the UI reported a session-only save.
- Reduced-motion mode remained playable.
- Help opened/closed, and narrow 320-pixel and 390-pixel layouts had no horizontal overflow.
- At 390 × 844 the footer fit within the viewport. Desktop layout was visually inspected at 1440 × 1000.

## Review findings addressed

During source review, the periodic save/update loop was restricted to visible tabs. Otherwise, a background browser that continues running timers could apply decay repeatedly and defeat the intended cap on time away. Visibility and page-exit events still save once, and resume applies elapsed time once.

## Still needs the owner's device

Open the live Pages URL in iPhone Safari, use each action, close/reopen it, and add it to the Home Screen. Check touch comfort, background/resume behavior, and animation smoothness on actual hardware. Safari and a Home Screen installation may use separate storage contexts; cloud save is not implemented.

No offline service worker, App Store package, dedicated eating/sleeping animation, full canvas screen-reader navigation, or cross-device save is claimed by this prototype.
