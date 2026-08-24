import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {};

type Point = { x: number; y: number };

const cubicPoint = (
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point => {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
};

// Fractions of the composition's width/height, derived from the original
// 1080x1350 design, so the same snake-shaped layout adapts to any aspect ratio.
const PLAY_F: Point = { x: 260 / 1080, y: 300 / 1350 };
const OPENAI_F: Point = { x: 540 / 1080, y: 675 / 1350 };
const APPY_F: Point = { x: 820 / 1080, y: 1050 / 1350 };
const SEG_A_P1_F: Point = { x: 620 / 1080, y: 240 / 1350 };
const SEG_A_P2_F: Point = { x: 180 / 1080, y: 610 / 1350 };
const SEG_B_P1_F: Point = { x: 900 / 1080, y: 740 / 1350 };
const SEG_B_P2_F: Point = { x: 460 / 1080, y: 1010 / 1350 };

export const GooglePlay: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Icon/stroke sizes were tuned for a 1080-wide-or-tall canvas; scale them
  // to keep proportions consistent across different composition sizes.
  const scale = Math.min(width, height) / 1080;
  const toPoint = (f: Point): Point => ({ x: f.x * width, y: f.y * height });

  const PLAY = toPoint(PLAY_F);
  const OPENAI = toPoint(OPENAI_F);
  const APPY = toPoint(APPY_F);

  const wiggle = Math.sin(frame / 24) * 18 * scale;

  const segA = {
    p0: PLAY,
    p1: { ...toPoint(SEG_A_P1_F), y: toPoint(SEG_A_P1_F).y + wiggle },
    p2: { ...toPoint(SEG_A_P2_F), y: toPoint(SEG_A_P2_F).y - wiggle },
    p3: OPENAI,
  };
  const segB = {
    p0: OPENAI,
    p1: { ...toPoint(SEG_B_P1_F), y: toPoint(SEG_B_P1_F).y - wiggle },
    p2: { ...toPoint(SEG_B_P2_F), y: toPoint(SEG_B_P2_F).y + wiggle },
    p3: APPY,
  };

  const pathPoint = (u: number): Point =>
    u <= 0.5
      ? cubicPoint(u * 2, segA.p0, segA.p1, segA.p2, segA.p3)
      : cubicPoint((u - 0.5) * 2, segB.p0, segB.p1, segB.p2, segB.p3);

  const pathD = `M${segA.p0.x},${segA.p0.y} C${segA.p1.x},${segA.p1.y} ${segA.p2.x},${segA.p2.y} ${segA.p3.x},${segA.p3.y} C${segB.p1.x},${segB.p1.y} ${segB.p2.x},${segB.p2.y} ${segB.p3.x},${segB.p3.y}`;

  const pathOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffset = -(frame * 1.4);

  const particleCount = 5;
  const period = 90;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const loopFrame = (frame + i * (period / particleCount)) % period;
    const u = loopFrame / period;
    const pos = pathPoint(u);
    const opacity = interpolate(u, [0, 0.04, 0.96, 1], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { key: `particle-${i}`, x: pos.x, y: pos.y, opacity, u };
  });

  const pulseNear = (target: number) => {
    const closest = Math.min(...particles.map((p) => Math.abs(p.u - target)));
    return interpolate(closest, [0, 0.03, 0.08], [1.35, 1.1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const playEntrance = entrance(0);
  const openaiEntrance = entrance(15);
  const appyEntrance = entrance(30);

  const playScale = playEntrance * pulseNear(0);
  const openaiScale = openaiEntrance * pulseNear(0.5);
  const appyScale = appyEntrance * pulseNear(1);

  const openaiRotation = frame * 0.6;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0d12" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={pathD}
          fill="none"
          stroke="#4b5160"
          strokeWidth={5 * scale}
          strokeLinecap="round"
          strokeDasharray={`${2 * scale} ${22 * scale}`}
          strokeDashoffset={dashOffset}
          pathLength={1000}
          opacity={pathOpacity}
        />
        {particles.map((particle) => (
          <circle
            key={particle.key}
            cx={particle.x}
            cy={particle.y}
            r={9 * scale}
            fill="#e5a663"
            opacity={particle.opacity}
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: PLAY.x,
          top: PLAY.y,
          width: 170 * scale,
          height: 170 * scale,
          transform: `translate(-50%, -50%) scale(${playScale})`,
          opacity: playEntrance,
        }}
      >
        <Img
          src={staticFile("play.svg")}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: OPENAI.x,
          top: OPENAI.y,
          width: 190 * scale,
          height: 190 * scale,
          transform: `translate(-50%, -50%) scale(${openaiScale}) rotate(${openaiRotation}deg)`,
          opacity: openaiEntrance,
        }}
      >
        <Img
          src={staticFile("openai.svg")}
          style={{ width: "100%", height: "100%", filter: "invert(1)" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: APPY.x,
          top: APPY.y,
          width: 170 * scale,
          height: 170 * scale,
          transform: `translate(-50%, -50%) scale(${appyScale})`,
          opacity: appyEntrance,
        }}
      >
        <Img
          src={staticFile("appy.svg")}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </AbsoluteFill>
  );
};
