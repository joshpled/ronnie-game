# ADR 0001 — Trial a continuous walk rig before game integration

Date: 2026-09-13. Status: experimental; visual acceptance pending in draft PR #4.

## Context

Ronnie’s original eight-pose trot could be slowed but retained its abrupt limb changes. A newly generated sixteen-pose walk was rejected by Josh. Its drawings did not maintain a reliable footfall sequence or planted-foot contact.

## Decision and reason

Use a pure JavaScript gait to place each paw, solve fixed-length leg joints, and bend generated limb textures along those joints in a standalone Canvas preview. A single torso prevents face and body registration changes. The right-facing preview stays outside Phaser and does not read or write care state.

Contact is defined before joints: a planted paw moves backward in local coordinates at the same speed as the floor. Bone angles then follow the paw. Reversing that relationship would make foot contact an accidental result of hand-tuned rotations. Swing uses Hermite interpolation so contact velocity remains continuous at lift and landing.

## Alternatives and tradeoffs

More independently generated frames preserve hand-drawn silhouettes but did not solve phase consistency. Rotating separate rigid texture pieces exposed pasted-on joints. The continuous mesh avoids those seams and keeps texture distance tied to bone length, at the cost of rendering code and careful attachment/artwork tuning. A full 3D model or third-party animation editor would expand the scope and asset pipeline prematurely.

Fixed bone lengths and passing tests cannot certify natural anatomy. This experiment still needs visual acceptance, followed by a separate decision about reuse in the game. Numeric gait parameters are authored for the preview; they are not derived from video or motion capture of Ronnie. No new package, native iOS code, storage format or game behavior is introduced.
