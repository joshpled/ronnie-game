# Ronnie — animation gallery and app concept

[Remote concept preview](https://joshpled.github.io/ronnie-game/previews/concept/?v=1).

A disposable, interactive concept preview. It pairs a phone-sized room with
seven approved animation clips. Feed replays eating; Play replays tail wag;
Rest replays curled breathing. Gallery choices replace the displayed clip
immediately; they do not demonstrate transitions between different activities.

This preview does not create or integrate the app. It has no care calculations,
save data, backend, accounts, audio or gameplay triggers. Room decoration is
preview styling. Howling is excluded and remains deferred in the backlog.

## Run

Serve this folder with `python3 -m http.server 8776 --directory docs/concept-preview`
from the repository root. Open `http://localhost:8776`. No build or dependencies
are required. JavaScript modules require HTTP hosting rather than file opening.

## Artwork and playback

`asset-provenance.json` records unchanged copies of the approved library artwork
and hashes. `clips.js` preserves the library manifest's frame order and timing;
ears-back uses its approved v3 sheet and timeline. Curled breathing reuses the
approved 4-second, maximum 3px upper-back movement with the separate bed and
fixed head/paws. No images were regenerated, retouched or recolored.

One active clip drives the room. Gallery thumbnails are static representative
poses. Pause/Play, Replay, Loop and a scrubber aid inspection. Reduced-motion
settings start paused; Replay/Play explicitly allow playback. Time in hidden
tabs does not advance the animation. Existing artwork and motion limitations
remain, including discrete pose stepping and differences between pose families.

This concept needs visual review. Remote delivery does not mean source merge,
app integration or physical iPhone validation.

## Validation

[Saved checks](qa.json): all seven gallery selections, all three phone actions,
curled/bed composition, scrubbing, Replay and loop-off completion pass. At
390px there is no horizontal overflow; choosing a clip brings the phone into
view. Reduced motion starts paused. No console warnings/errors. The eight
artwork copies match source bytes exactly; timings retain approved values.
Typecheck, lint, 13 model tests, build and module syntax checks pass. Source
review found no blocking issue. These checks do not establish physical-device
validation or concept acceptance.
