import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolate,
  useCurrentFrame,
} from "remotion"

type Props = {}

export const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {}
}

const HEART_PATTERN = [
  ".XX.XX.",
  "XXXXXXX",
  "XXXXXXX",
  ".XXXXX.",
  "..XXX..",
  "...X...",
]

type PixelHeartProps = { size: number; color?: string }

const PixelHeart: React.FC<PixelHeartProps> = ({ size, color = "#ff6b81" }) => {
  return (
    <svg width={size} height={(size * 6) / 7} viewBox="0 0 7 6">
      {HEART_PATTERN.flatMap((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "X" ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
            ) : null
          )
      )}
    </svg>
  )
}

const HEART_COUNT = 3
const HEART_STAGGER = 14
const HEART_TRAVEL = 34
const PAUSE_AFTER_HEARTS = 26
const BAR_GROW_DURATION = 22
const BAR_BASE_HEIGHT = 30
const BAR_MAX_HEIGHT = 90

const LAST_HEART_LAND =
  (HEART_COUNT - 1) * HEART_STAGGER + HEART_TRAVEL
const BAR_GROW_START = LAST_HEART_LAND + PAUSE_AFTER_HEARTS
const BAR_GROW_END = BAR_GROW_START + BAR_GROW_DURATION

export const ClaudeCode: React.FC<Props> = () => {
  const frame = useCurrentFrame()

  const heartbeat = 1 + 0.06 * Math.max(0, Math.sin((frame / 10) * Math.PI))

  const hearts = Array.from({ length: HEART_COUNT }).flatMap((_, i) => {
    const start = i * HEART_STAGGER
    if (frame < start || frame >= start + HEART_TRAVEL) return []
    const t = (frame - start) / HEART_TRAVEL
    const x = interpolate(t, [0, 1], [12, 88])
    const y = -Math.sin(t * Math.PI) * 32
    const opacity = interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
    const scale = interpolate(t, [0, 0.15, 1], [0.5, 1, 0.85], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
    return [{ key: `heart-${i}`, x, y, opacity, scale }]
  })

  const orangeBarHeight = interpolate(
    frame,
    [BAR_GROW_START, BAR_GROW_START + BAR_GROW_DURATION * 0.65, BAR_GROW_END],
    [BAR_BASE_HEIGHT, BAR_MAX_HEIGHT * 1.08, BAR_MAX_HEIGHT],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  return (
    <AbsoluteFill
      name="Background"
      style={{
        backgroundColor: "#0b0d12",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 780,
        }}
      >
        {/* CLAUDE CODE LOGO */}
        <svg
          height="12em"
          viewBox="0 0 24 24"
          style={{
            transform: `scale(${heartbeat})`,
            transformOrigin: "center",
          }}
        >
          <title>Claude Code</title>
          <path
            clipRule="evenodd"
            d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
            fill="#D97757"
            fillRule="evenodd"
          ></path>
        </svg>

        {/* PIXELATED HEARTS FROM CLAUDE TO APPY.FYI */}
        {hearts.map((heart) => (
          <div
            key={heart.key}
            style={{
              position: "absolute",
              left: `${heart.x}%`,
              top: `calc(50% + ${heart.y}px)`,
              transform: `translate(-50%, -50%) scale(${heart.scale})`,
              opacity: heart.opacity,
            }}
          >
            <PixelHeart size={64} />
          </div>
        ))}

        {/* APPY.FYI LOGO */}
        <svg height="12em" viewBox="0 0 100 100">
          <title>appy.fyi</title>
          <g transform="translate(0, 100) scale(1, -1)">
            <rect x="6" y="5" width="16" height="50" rx="7" fill="#0F9D58" />
            <rect x="30" y="5" width="16" height="80" rx="7" fill="#4285F4" />
            <rect x="54" y="5" width="16" height={orangeBarHeight} rx="7" fill="#F4B400" />
            <rect x="78" y="5" width="16" height="65" rx="7" fill="#EA4335" />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  )
}
