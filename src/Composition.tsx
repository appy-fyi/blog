import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Interactive,
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
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1350}
      calculateMetadata={calculateMetadata}
    />
  )
}

// TODO: remove any animation, just show to claude code logo at the top left and the appy.fyi at the top right, the terminal prompt ($) should be under them. Add a horizontal line (#CB7E5B) between the logos and the terminal prompt. The only animation is the blinked cursor at the end of the prompt. 
export const Terminal: React.FC<Props> = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const command = "claude"
  const typedChars = Math.min(
    command.length,
    Math.floor(
      interpolate(frame, [0.5 * fps, 1.5 * fps], [0, command.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  )
  const typedCommand = command.slice(0, typedChars)
  const commandDone = typedChars === command.length
  const cursorVisible = Math.floor(frame / (fps / 2)) % 2 === 0

  return (
    <AbsoluteFill
      name="Background"
      style={{
        backgroundColor: "#0b0d12",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      }}
    >
      <Interactive.Div
        name="Terminal window"
        style={{
          width: 760,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.5)",
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 0.5 * fps], [0.96, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
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
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#27c93f",
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#15171e",
            padding: "28px 24px 40px",
            minHeight: 220,
            color: "#e6e6e6",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#27c93f" }}>{"$ "}</span>
            <span>{typedCommand}</span>
            {!commandDone && cursorVisible && <span>{"█"}</span>}
          </div>
          {commandDone && (
            <Interactive.Div
              name="Claude Code logo"
              style={{
                marginTop: 32,
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
                scale: interpolate(frame, [1.5 * fps, 2 * fps], [0.8, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 200 }),
                  output: "perceptual-scale",
                }),
              }}
            >
              {/* CLAUDE CODE LOGO */}
              <svg
                height="4em"
                viewBox="0 0 24 24" >
                <title>Claude Code</title>
                <path clipRule="evenodd"
                  d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
                  fill="#D97757" fillRule="evenodd"></path>
              </svg>

              {/* APPY.FYI LOGO */}
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0, 100) scale(1, -1)">
                  <rect x="6" y="5" width="16" height="50" rx="7" fill="#0F9D58" />
                  <rect x="30" y="5" width="16" height="80" rx="7" fill="#4285F4" />
                  <rect x="54" y="5" width="16" height="90" rx="7" fill="#F4B400" />
                  <rect x="78" y="5" width="16" height="65" rx="7" fill="#EA4335" />
                </g>
              </svg>

              <span style={{ fontSize: 22, color: "#a8a8a8" }}>
                Claude Code
              </span>
            </Interactive.Div>
          )}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  )
}
