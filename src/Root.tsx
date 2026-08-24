import "./index.css";
import { Composition } from "remotion";
import {
  Terminal,
  calculateMetadata as terminalMetadata,
} from "./compositions/Terminal";
import { GooglePlay } from "./compositions/GooglePlay";

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
    </>
  );
};
