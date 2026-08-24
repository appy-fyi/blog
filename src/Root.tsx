import "./index.css";
import { Composition } from "remotion";
import {
  Terminal,
  calculateMetadata as terminalMetadata,
} from "./compositions/Terminal";
import { GooglePlay } from "./compositions/GooglePlay";
import { Outro } from "./compositions/Outro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Terminal"
        component={Terminal}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1350}
        calculateMetadata={terminalMetadata}
      />
      <Composition
        id="GooglePlay"
        component={GooglePlay}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="GooglePlay-16-9"
        component={GooglePlay}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GooglePlay-21-9"
        component={GooglePlay}
        durationInFrames={240}
        fps={30}
        width={2100}
        height={900}
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
        id="Outro"
        component={Outro}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1350}
      />
    </>
  );
};
