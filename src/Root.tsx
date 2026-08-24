import { Composition } from "remotion"
import {
  ClaudeCode,
  calculateMetadata as terminalMetadata,
} from "./compositions/ClaudeCode"
import { GooglePlay } from "./compositions/GooglePlay"
import { Outro } from "./compositions/Outro"
import "./index.css"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCode-4-5"
        component={ClaudeCode}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1350}
        calculateMetadata={terminalMetadata}
      />
      <Composition
        id="ClaudeCode-191-100"
        component={ClaudeCode}
        durationInFrames={240}
        fps={30}
        width={1910}
        height={1000}
        calculateMetadata={terminalMetadata}
      />
      <Composition
        id="GooglePlay-4-5"
        component={GooglePlay}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="GooglePlay-191-100"
        component={GooglePlay}
        durationInFrames={240}
        fps={30}
        width={1910}
        height={1000}
      />
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1350}
      />
    </>
  )
}
