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

const HEART_PERIOD = 55
const HEART_TRAVEL = 34
const BAR_BASE_HEIGHT = 30
const BAR_GROWTH_PER_HEART = 15
const BAR_MAX_HEIGHT = 90

export const ClaudeCode: React.FC<Props> = () => {
  const frame = useCurrentFrame()

  const heartbeat = 1 + 0.06 * Math.max(0, Math.sin((frame / 10) * Math.PI))

  const hearts = Array.from({ length: 6 }).flatMap((_, i) => {
    const start = i * HEART_PERIOD
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

  const heartsLanded =
    frame < HEART_TRAVEL
      ? 0
      : Math.floor((frame - HEART_TRAVEL) / HEART_PERIOD) + 1
  const orangeBarHeight = Math.min(
    BAR_MAX_HEIGHT,
    BAR_BASE_HEIGHT + heartsLanded * BAR_GROWTH_PER_HEART
  )

  const lastLandingFrame =
    heartsLanded > 0 ? (heartsLanded - 1) * HEART_PERIOD + HEART_TRAVEL : 0
  const framesSinceLanding = frame - lastLandingFrame
  const barBounce =
    heartsLanded > 0 && orangeBarHeight < BAR_MAX_HEIGHT
      ? interpolate(framesSinceLanding, [0, 4, 14], [1, 1.12, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1

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
        <svg
          height="12em"
          viewBox="0 0 100 100"
          style={{
            transform: `scale(${barBounce})`,
            transformOrigin: "center bottom",
          }}
        >
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
