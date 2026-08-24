import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig
} from "remotion"

type Props = {}

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {}
}

export const MyComposition = () => {
  return (
    <Composition
      id="Terminal"
      component={Terminal}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1350}
      calculateMetadata={calculateMetadata}
    />
  )
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

export const Terminal: React.FC<Props> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cursorVisible = Math.floor(frame / (fps / 2)) % 2 === 0

  const command = "/appy.fyi"
  const framesPerChar = 4
  const charsTyped = Math.min(
    command.length,
    Math.max(0, Math.floor(frame / framesPerChar))
  )
  const typedText = command.slice(0, charsTyped)

  const suggestions = [
    { name: "/appy.fyi", desc: "Build something amazing" },
    { name: "/appy.fyi:draft", desc: "Draft something amazing" },
    { name: "/appy.fyi:publish", desc: "Publish something amazing" },
  ]

  const popupAppearFrame = framesPerChar
  const typeEndFrame = command.length * framesPerChar
  const popupDisappearFrame = typeEndFrame + 10
  const popupProgress = interpolate(
    frame,
    [
      popupAppearFrame,
      popupAppearFrame + 10,
      popupDisappearFrame,
      popupDisappearFrame + 10,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  const selectFrame = popupDisappearFrame + 10

  const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  const spinnerSpeed = 3
  const spinnerIndex =
    Math.floor(Math.max(0, frame - selectFrame) / spinnerSpeed) %
    spinnerFrames.length
  const appyfyOpacity = interpolate(
    frame,
    [selectFrame, selectFrame + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  const loveFrame = Math.max(0, frame - selectFrame)
  const heartbeat =
    frame >= selectFrame
      ? 1 + 0.06 * Math.max(0, Math.sin((loveFrame / 10) * Math.PI))
      : 1

  const heartCount = 3
  const heartPeriod = 60
  const heartTravel = 42
  const hearts = Array.from({ length: heartCount }).flatMap((_, i) => {
    const start = selectFrame + i * (heartPeriod / heartCount)
    if (frame < start) return []
    const loopFrame = (frame - start) % heartPeriod
    if (loopFrame >= heartTravel) return []
    const t = loopFrame / heartTravel
    const x = interpolate(t, [0, 1], [20, 78])
    const y = -Math.sin(t * Math.PI) * 24
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

  return (
    <AbsoluteFill
      name="Background"
      style={{
        backgroundColor: "#0b0d12",
        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      }}
    >
      <Interactive.Div
        name="Terminal window"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            backgroundColor: "#20222b",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: "#27c93f",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#15171e",
            padding: "48px 40px",
            color: "#e6e6e6",
            fontSize: 26,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* CLAUDE CODE LOGO */}
            <svg
              height="7em"
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
                <PixelHeart size={52} />
              </div>
            ))}

            {/* APPY.FYI LOGO */}
            <svg height="7em" viewBox="0 0 100 100">
              <title>appy.fyi</title>
              <g transform="translate(0, 100) scale(1, -1)">
                <rect x="6" y="5" width="16" height="50" rx="7" fill="#0F9D58" />
                <rect x="30" y="5" width="16" height="80" rx="7" fill="#4285F4" />
                <rect x="54" y="5" width="16" height="90" rx="7" fill="#F4B400" />
                <rect x="78" y="5" width="16" height="65" rx="7" fill="#EA4335" />
              </g>
            </svg>
          </div>

          <div
            style={{
              height: 2,
              backgroundColor: "#CB7E5B",
              margin: "40px 0",
            }}
          />

          <div
            style={{
              opacity: appyfyOpacity,
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
            }}
          >
            <span style={{ color: "#e5a663" }}>
              {spinnerFrames[spinnerIndex]}
            </span>
            <span style={{ marginLeft: 12, color: "#9aa0ab" }}>
              {"appyfying..."}
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                opacity: popupProgress,
                transform: `translateY(${(1 - popupProgress) * 12}px)`,
                marginBottom: 8,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    borderRadius: 8,
                    backgroundColor:
                      index === 0 ? "#2a2d38" : "transparent",
                  }}
                >
                  <span
                    style={{
                      color: index === 0 ? "#e5a663" : "#9aa0ab",
                    }}
                  >
                    {suggestion.name}
                  </span>
                  <span style={{ color: "#5c6270", fontSize: 20 }}>
                    {suggestion.desc}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 2, backgroundColor: "#ffffff" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 0",
              }}
            >
              <span style={{ color: "#27c93f" }}>{"❯"}</span>
              <span style={{ marginLeft: 16 }}>{typedText}</span>
              {cursorVisible && <span>{"█"}</span>}
            </div>
            <div style={{ height: 2, backgroundColor: "#ffffff" }} />
            <div
              style={{
                marginTop: 16,
                color: "#e6e6e6",
              }}
            >
              <span>{"Sonnet 6.7"}</span>
              <span style={{ color: "#7a7f8c" }}>{" | ctx "}</span>
              <span style={{ color: "#e5a663" }}>{"0%"}</span>
              <span style={{ color: "#7a7f8c" }}>{" | tok "}</span>
              <span>{"0k"}</span>
              <span style={{ color: "#7a7f8c" }}>{" | "}</span>
              <span>{"$0.00"}</span>
              <span style={{ color: "#7a7f8c" }}>{" | 5h "}</span>
              <span style={{ color: "#27c93f" }}>{"7%"}</span>
              <span style={{ color: "#7a7f8c" }}>{" | "}</span>
              <span>{"main"}</span>
            </div>
            <div
              style={{
                marginTop: 6,
                color: "#7a7f8c",
              }}
            >
              {"▸▸ auto mode on (shift+tab to cycle) · ← for agents"}
            </div>
          </div>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  )
}
