import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {};

type GradientStop = { offset: string; color: string };

type Piece = {
  key: string;
  d: string;
  gradientId: string;
  gradient: {
    x1: string;
    y1: string;
    x2: string;
    y2: string;
    stops: GradientStop[];
  };
  nativeCenter: { x: number; y: number };
  flourish: number;
  appyColor: string;
  bar: { x: number; y: number; width: number; height: number };
};

// Native play.svg viewBox is "-29.45 0 466.9 466.9". Mapping it 1:1 into our
// 0-100 canvas keeps the resting logo pixel-identical to the source asset.
const BASE_SCALE = 100 / 466.9;
const BASE_TX = 29.45 * BASE_SCALE;
const PARK_SCALE = 0.08;

const PIECES: Piece[] = [
  {
    key: "green",
    d: "M261.7 142.3L15 1.3C11.9-.5 8-.4 5 1.4c-3.1 1.8-5 5-5 8.6 0 0 .1 13 .2 34.4l179.7 179.7 81.8-81.8z",
    gradientId: "playGreen",
    gradient: {
      x1: "0",
      y1: "112.094",
      x2: "261.746",
      y2: "112.094",
      stops: [
        { offset: "0", color: "#63be6b" },
        { offset: ".506", color: "#5bbc6a" },
        { offset: "1", color: "#4ab96a" },
      ],
    },
    nativeCenter: { x: 130, y: 107 },
    flourish: 20,
    appyColor: "#0F9D58",
    bar: { x: 6, y: 45, width: 16, height: 50 },
  },
  {
    key: "blue",
    d: "M.2 44.4C.5 121.6 1.4 309 1.8 402.3L180 224.1.2 44.4z",
    gradientId: "playBlue",
    gradient: {
      x1: ".152",
      y1: "223.393",
      x2: "179.896",
      y2: "223.393",
      stops: [
        { offset: "0", color: "#3ec6f2" },
        { offset: "1", color: "#45afe3" },
      ],
    },
    nativeCenter: { x: 90, y: 223 },
    flourish: -15,
    appyColor: "#4285F4",
    bar: { x: 30, y: 15, width: 16, height: 80 },
  },
  {
    key: "yellow",
    d: "M402.9 223l-141.2-80.7-81.9 81.8 92.4 92.4L403 240.3c3.1-1.8 5-5.1 5-8.6 0-3.6-2-6.9-5.1-8.7z",
    gradientId: "playYellow",
    gradient: {
      x1: "179.896",
      y1: "229.464",
      x2: "407.976",
      y2: "229.464",
      stops: [
        { offset: "0", color: "#faa51a" },
        { offset: ".387", color: "#fab716" },
        { offset: ".741", color: "#fac412" },
        { offset: "1", color: "#fac80f" },
      ],
    },
    nativeCenter: { x: 291, y: 229 },
    flourish: 15,
    appyColor: "#F4B400",
    bar: { x: 54, y: 5, width: 16, height: 90 },
  },
  {
    key: "red",
    d: "M1.7 402.3c.2 33.3.3 54.6.3 54.6 0 3.6 1.9 6.9 5 8.6 3.1 1.8 6.9 1.8 10 0l255.3-148.9-92.4-92.4L1.7 402.3z",
    gradientId: "playRed",
    gradient: {
      x1: "1.744",
      y1: "345.521",
      x2: "272.296",
      y2: "345.521",
      stops: [
        { offset: "0", color: "#ec3b50" },
        { offset: "1", color: "#e7515b" },
      ],
    },
    nativeCenter: { x: 137, y: 344 },
    flourish: -20,
    appyColor: "#EA4335",
    bar: { x: 78, y: 30, width: 16, height: 65 },
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Outro: React.FC<Props> = () => {
  const frame = useCurrentFrame();

  const repositionStart = 30;
  const repositionEnd = 75;
  const morphStart = 75;
  const morphEnd = 130;

  const rawReposition = interpolate(
    frame,
    [repositionStart, repositionEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const tReposition = Easing.inOut(Easing.cubic)(rawReposition);

  const rawMorph = interpolate(frame, [morphStart, morphEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tMorph = Easing.inOut(Easing.cubic)(rawMorph);

  const entrance = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(
    frame,
    [morphEnd + 10, morphEnd + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0d12",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          opacity: entrance,
        }}
      >
        <svg width={340} height={340} viewBox="0 0 100 100">
          <defs>
            {PIECES.map((piece) => (
              <linearGradient
                key={piece.gradientId}
                id={piece.gradientId}
                gradientUnits="userSpaceOnUse"
                x1={piece.gradient.x1}
                y1={piece.gradient.y1}
                x2={piece.gradient.x2}
                y2={piece.gradient.y2}
              >
                {piece.gradient.stops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            ))}
          </defs>

          {PIECES.map((piece) => {
            const parkedTx =
              piece.bar.x +
              piece.bar.width / 2 -
              piece.nativeCenter.x * PARK_SCALE;
            const parkedTy =
              piece.bar.y +
              piece.bar.height / 2 -
              piece.nativeCenter.y * PARK_SCALE;

            const tx = lerp(BASE_TX, parkedTx, tReposition);
            const ty = lerp(0, parkedTy, tReposition);
            const scale = lerp(BASE_SCALE, PARK_SCALE, tReposition);
            const angle = Math.sin(tReposition * Math.PI) * piece.flourish;

            const wedgeOpacity = 1 - tMorph;
            const wedgeClip = `inset(0% 0% ${tMorph * 100}% 0%)`;

            return (
              <g key={piece.key}>
                <g
                  transform={`translate(${tx} ${ty}) rotate(${angle}) scale(${scale})`}
                  style={{ opacity: wedgeOpacity, clipPath: wedgeClip }}
                >
                  <path d={piece.d} fill={`url(#${piece.gradientId})`} />
                </g>
                <rect
                  x={piece.bar.x}
                  y={piece.bar.y}
                  width={piece.bar.width}
                  height={piece.bar.height}
                  rx={7}
                  fill={piece.appyColor}
                  style={{
                    clipPath: `inset(${(1 - tMorph) * 100}% 0% 0% 0%)`,
                  }}
                />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            opacity: textOpacity,
            fontFamily: "Menlo, Monaco, 'Courier New', monospace",
            fontSize: 40,
            color: "#e6e6e6",
            letterSpacing: 2,
          }}
        >
          {"appy.fyi"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
