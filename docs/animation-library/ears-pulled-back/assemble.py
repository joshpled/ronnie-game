"""Reassemble the endpoint from saved ear artwork and the original sprite.

Run with the bundled workspace Python (Pillow). This never generates artwork.
White mask pixels select the exact original RGBA pixel; black selects the ear
layer. The binary selection prevents generated pixels from altering her face.
"""

from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

original = Image.open(ROOT / "public/assets/ronnie.webp").convert("RGBA")
neutral = original.crop((0, 0, 192, 208))
ears = Image.open(HERE / "ear-layer.png").convert("RGBA")
protected = Image.open(HERE / "protected-region.png").convert("L")
assert ears.size == protected.size == neutral.size == (192, 208)
assert {value for _, value in protected.getcolors()} <= {0, 255}

candidate = Image.composite(neutral, ears, protected)
neutral.save(HERE / "neutral.png")
candidate.save(HERE / "candidate.png")

comparison = Image.new("RGB", (808, 480), "#eee9df")
for index, sprite in enumerate((neutral, candidate)):
    enlarged = sprite.resize((384, 416), Image.Resampling.NEAREST)
    comparison.paste(enlarged, (10 + index * 404, 40), enlarged)
draw = ImageDraw.Draw(comparison)
draw.text((10, 10), "Original neutral", fill="black")
draw.text((414, 10), "Ears-back endpoint candidate", fill="black")
comparison.save(HERE / "comparison.png")
