"""Reassemble endpoint revisions from saved generated regions and original art.

Run with the bundled workspace Python (Pillow). This never generates artwork.
White mask pixels select the exact original RGBA pixel; black selects the ear
layer. Revision 1 preserves the face. Revision 2 adds only the approved eye and
mouth expression regions, while preserving the existing silhouette alpha.
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

# The saved expression layer is already registered. Only its three soft-mask
# regions may alter revision 1; the rest of the face, ears and body stay exact.
expression = Image.open(HERE / "expression-layer-v2.png").convert("RGBA")
expression_mask = Image.open(HERE / "expression-mask-v2.png").convert("L")
assert expression.size == expression_mask.size == candidate.size
revised = Image.composite(expression, candidate, expression_mask)
revised.putalpha(candidate.getchannel("A"))
revised.save(HERE / "candidate-v2.png")

comparison_v2 = Image.new("RGB", (808, 480), "#eee9df")
for index, sprite in enumerate((neutral, revised)):
    enlarged = sprite.resize((384, 416), Image.Resampling.NEAREST)
    comparison_v2.paste(enlarged, (10 + index * 404, 40), enlarged)
draw = ImageDraw.Draw(comparison_v2)
draw.text((10, 10), "Original neutral", fill="black")
draw.text((414, 10), "Revision 2: ears back and sad expression", fill="black")
comparison_v2.save(HERE / "comparison-v2.png")

expression_comparison = Image.new("RGB", (808, 700), "#eee9df")
for index, sprite in enumerate((candidate, revised)):
    enlarged = sprite.resize((384, 416), Image.Resampling.NEAREST)
    expression_comparison.paste(enlarged, (10 + index * 404, 40), enlarged)
    face = sprite.crop((78, 35, 138, 85)).resize((240, 200), Image.Resampling.NEAREST)
    expression_comparison.paste(face, (78 + index * 404, 490), face)
draw = ImageDraw.Draw(expression_comparison)
draw.text((10, 10), "Previous endpoint: neutral face", fill="black")
draw.text((414, 10), "Revision 2: sad face", fill="black")
expression_comparison.save(HERE / "expression-comparison-v2.png")
