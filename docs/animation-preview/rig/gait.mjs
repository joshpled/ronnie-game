// Authored walk, in local art pixels. No care/game state is involved.
export const WALK = Object.freeze({
  duration: 1.6,
  speed: 32,
  duty: 0.7,
  lift: 10,
});
export const LEGS = Object.freeze([
  {
    id: "far-hind",
    kind: "hind",
    far: true,
    offset: 0.5,
    x: 50,
    y: 107,
    ground: 184,
  },
  {
    id: "far-front",
    kind: "front",
    far: true,
    offset: 0.25,
    x: 140,
    y: 117,
    ground: 184,
  },
  {
    id: "near-hind",
    kind: "hind",
    far: false,
    offset: 0,
    x: 44,
    y: 111,
    ground: 188,
  },
  {
    id: "near-front",
    kind: "front",
    far: false,
    offset: 0.75,
    x: 133,
    y: 121,
    ground: 188,
  },
]);
export const wrap = (n) => ((n % 1) + 1) % 1;

// Stance moves backward at the exact speed of forward travel. Swing is a
// Hermite curve: its endpoint velocity matches stance, avoiding a landing snap.
export function footAt(time, leg) {
  const phase = wrap(time / WALK.duration + leg.offset);
  const stride = WALK.duration * WALK.speed;
  const reach = (stride * WALK.duty) / 2;
  let x,
    lift = 0;
  const planted = phase < WALK.duty;
  if (planted) x = reach - stride * phase;
  else {
    const u = (phase - WALK.duty) / (1 - WALK.duty);
    const u2 = u * u,
      u3 = u2 * u;
    const tangent = -stride * (1 - WALK.duty);
    x =
      (2 * u3 - 3 * u2 + 1) * -reach +
      (u3 - 2 * u2 + u) * tangent +
      (-2 * u3 + 3 * u2) * reach +
      (u3 - u2) * tangent;
    lift = WALK.lift * 16 * u2 * (1 - u) * (1 - u);
  }
  return { x: leg.x + x, y: leg.ground - lift, phase, planted };
}

// Exact two-bone solution; the branch chooses the elbow/knee bend direction.
export function jointBetween(root, end, first, second, bend) {
  const dx = end.x - root.x,
    dy = end.y - root.y;
  const distance = Math.hypot(dx, dy);
  if (distance > first + second || distance < Math.abs(first - second))
    throw new Error("Unreachable leg: shorten stride or adjust bone lengths");
  const along =
    (first * first - second * second + distance * distance) / (2 * distance);
  const side = Math.sqrt(Math.max(0, first * first - along * along));
  return {
    x: root.x + (dx * along) / distance + (bend * dy * side) / distance,
    y: root.y + (dy * along) / distance - (bend * dx * side) / distance,
  };
}

export function poseAt(time) {
  const phase = wrap(time / WALK.duration);
  const bob = 0.45 * Math.sin(phase * Math.PI * 4);
  return {
    phase,
    bob,
    legs: LEGS.map((leg) => {
      const foot = footAt(time, leg);
      const root = { x: leg.x, y: leg.y + bob };
      const ankle = { x: foot.x, y: foot.y - 6 };
      if (leg.kind === "front") {
        return {
          ...leg,
          foot,
          points: [root, jointBetween(root, ankle, 32, 32, -1), ankle],
        };
      }
      const hock = { x: ankle.x - 8, y: ankle.y - 14 };
      return {
        ...leg,
        foot,
        points: [root, jointBetween(root, hock, 32, 32, 1), hock, ankle],
      };
    }),
  };
}
