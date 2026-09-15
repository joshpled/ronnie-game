"""Assemble generated ear layers with approved endpoints; no artwork generation.

Run with bundled workspace Python (Pillow and NumPy). The registered ear layers
are the durable generation inputs; motion-registration.json records extraction.
"""

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
neutral = Image.open(HERE / "neutral.png").convert("RGBA")
sad = Image.open(HERE / "candidate-v2.png").convert("RGBA")
layers = Image.open(HERE / "motion-ear-layers.png").convert("RGBA")
protected = Image.open(HERE / "protected-region.png").convert("L")
expression = np.array(Image.open(HERE / "expression-mask-v2.png")) > 0
original = np.array(neutral)
endpoint = np.array(sad)
assert layers.size == (576, 208)
poses = [neutral]
for index, fraction in enumerate((0.25, 0.5, 0.75)):
    layer = layers.crop((index * 192, 0, (index + 1) * 192, 208))
    pixels = np.array(Image.composite(neutral, layer, protected))
    blended = np.rint(original.astype(float) * (1 - fraction) + endpoint * fraction)
    pixels[expression] = blended.astype(np.uint8)[expression]
    poses.append(Image.fromarray(pixels))
poses.append(sad)

atlas = Image.new("RGBA", (960, 208))
contact = Image.new("RGB", (1000, 248), "#eee9df")
draw = ImageDraw.Draw(contact)
allowed = (np.array(protected) == 0) | expression
checks = []
for index, pose in enumerate(poses):
    pixels = np.array(pose)
    changed = np.any(pixels != original, axis=2)
    assert not changed[~allowed].any(), "Changes outside ears/expression"
    assert np.array_equal(pixels[85:], original[85:]), "Body changed"
    assert not np.any(pixels[[0, -1], :, 3]), "Vertical clipping"
    assert not np.any(pixels[:, [0, -1], 3]), "Horizontal clipping"
    checks.append({"pose": index, "changedPixels": int(changed.sum()),
                   "outsideAllowedRegion": 0, "bodyExact": True})
    atlas.paste(pose, (index * 192, 0))
    contact.paste(pose, (index * 200 + 4, 32), pose)
    draw.text((index * 200 + 8, 10), f"Pose {index}: {index * 25}%", fill="#302c28")
atlas.save(HERE / "motion-v3.png")
contact.save(HERE / "motion-contact.png")

timeline = [
    {"pose": 0, "duration": 400, "phase": "Neutral"},
    *[{"pose": p, "duration": 100, "phase": "Ears drawing back"} for p in (1, 2, 3, 4)],
    {"pose": 4, "duration": 800, "phase": "Sad hold"},
    *[{"pose": p, "duration": 125, "phase": "Returning"} for p in (3, 2, 1, 0)],
    {"pose": 0, "duration": 300, "phase": "Neutral"},
]
assert sum(step["duration"] for step in timeline) == 2400
(HERE / "timeline.json").write_text(json.dumps(timeline, indent=2) + "\n")

# GIF uses 10 ms sampling (its time unit). Browser playback uses the exact
# 125 ms return steps. Flatten onto the same warm review background for GIF.
gif_frames = []
for time in range(0, 2400, 10):
    end = 0
    for step in timeline:
        end += step["duration"]
        if time < end:
            break
    frame = Image.new("RGB", neutral.size, "#eee9df")
    frame.paste(poses[step["pose"]], (0, 0), poses[step["pose"]])
    gif_frames.append(frame)
gif_frames[0].save(HERE / "motion-v3.gif", save_all=True, append_images=gif_frames[1:],
                   duration=10, loop=0, disposal=2)

atlas_path = HERE.parents[2] / "public/assets/ronnie.webp"
digest = hashlib.sha256(atlas_path.read_bytes()).hexdigest()
assert digest == "b7f6304beea6f7fe16a6201ab82d7b25b97b19ab3824aaf8342ebea41085bd6e"
assert np.array_equal(np.array(poses[0]), original)
assert np.array_equal(np.array(poses[-1]), endpoint)
report = {"revision": 3, "durationMs": 2400, "uniquePoses": 5,
          "originalAtlasSha256": digest, "neutralExact": True, "sadEndpointExact": True,
          "frames": checks, "endpointApproval": "Josh: Yes continue",
          "motionApproval": "Approved by Josh: Approve. Merge (2026-09-14)"}
(HERE / "qa-motion.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))
