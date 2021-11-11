import { LogLevel, RNFFprobe, RNFFmpegConfig } from "react-native-ffmpeg";

import { binarySearch } from "../components/Util";

module VideoKnowledgeBank {
  export interface VideoInformation {
    frameInformation: Frame[];
    avgFrameRate: number;
    lastFrameNumber: number;
  }

  let frameInformation: Frame[] = [];
  let avgFrameRate: number = 0;
  let lastFrameNumber = 0;

  interface Frame {
    timeInMillis: number;
  }

  // private functions
  function removeAdditionalTextBeforeFrames(s: string): string {
    const removedWhitespace = s.replace(/\s/g, "");
    if (removedWhitespace.startsWith('{"frames"')) {
      return removedWhitespace;
    }
    const removeExtraInfoAtFront = removedWhitespace.substring(
      removedWhitespace.indexOf('"frames"')
    );
    return "{" + removeExtraInfoAtFront;
  }

  function frameToString(frame: Frame): string {
    return `timestamp: ${frame["timeInMillis"]}`;
  }

  function parseFrameRate(frameRateInString: string): number {
    if (frameRateInString.includes("/")) {
      const splitted = frameRateInString.split("/");
      const first = parseFloat(splitted[0]);
      const second = parseFloat(splitted[1]);
      return first / second;
    }
    return parseFloat(frameRateInString);
  }

  // public functions
  export function timeToFrameNumber(positionInMillis: number): number {
    if (positionInMillis < 0) {
      return 0;
    }
    const frameNumber = binarySearch(
      frameInformation,
      (frame: Frame) => positionInMillis <= frame["timeInMillis"]
    );

    return frameNumber > lastFrameNumber ? lastFrameNumber : frameNumber;
  }

  export function getAvgFrameRate(): number {
    return avgFrameRate;
  }

  export function getVideoInformation(): VideoInformation {
    return {
      frameInformation: frameInformation,
      avgFrameRate: avgFrameRate,
      lastFrameNumber: lastFrameNumber,
    };
  }

  export function frameNumberToTime(frameNumber: number): number {
    if (frameNumber <= lastFrameNumber && frameNumber >= 0) {
      return frameInformation[frameNumber].timeInMillis;
    }
    return 0;
  }

  export function nextFrameTimeInMillis(currentFrameNumber: number): number {
    const nextFrameNumber = currentFrameNumber + 1;
    if (nextFrameNumber <= lastFrameNumber) {
      return frameInformation[nextFrameNumber].timeInMillis;
    }
    return frameInformation[currentFrameNumber].timeInMillis;
  }

  export function previousFrameTimeInMillis(
    currentFrameNumber: number
  ): number {
    const prevFrameNumber = currentFrameNumber - 1;
    if (prevFrameNumber >= 0) {
      return frameInformation[prevFrameNumber].timeInMillis;
    }
    return frameInformation[currentFrameNumber].timeInMillis;
  }

  export function loadCachedInformation(cached: VideoInformation) {
    frameInformation = cached.frameInformation;
    avgFrameRate = cached.avgFrameRate;
    lastFrameNumber = cached.lastFrameNumber;
  }

  export async function loadVideoInformation(
    sourceFile: string,
    callbackWhenDone: any
  ): Promise<void> {
    RNFFmpegConfig.enableLogCallback((log: any) => {});
    const executionResult = await RNFFprobe.executeWithArguments([
      "-hide_banner",
      "-v",
      LogLevel.logLevelToString(LogLevel.AV_LOG_QUIET),
      "-select_streams",
      "v:0",
      "-show_entries",
      // "stream=avg_frame_rate, nb_read_frames",
      "frame=pkt_pts_time",
      "-show_entries",
      "stream=avg_frame_rate",
      "-of",
      "json",
      sourceFile,
    ])
      .then((result) => console.log(`result: ${result}`))
      .catch((err) =>
        console.log(
          `failed to ffprobe video: ${sourceFile}\n error was: ${err}`
        )
      );
    RNFFmpegConfig.getLastCommandOutput().then((output) => {
      let outputMap;
      try {
        outputMap = JSON.parse(removeAdditionalTextBeforeFrames(output));
      } catch (err) {
        console.log(err);
        console.log(`output was: ${output}`);
        return;
      }

      frameInformation = outputMap["frames"].map(
        (element: { pkt_pts_time: string }) => {
          return {
            timeInMillis: Math.floor(
              parseFloat(element["pkt_pts_time"]) * 1000
            ),
          };
        }
      );

      frameInformation.sort(
        (a: Frame, b: Frame) => a["timeInMillis"] - b["timeInMillis"]
      );
      avgFrameRate = parseFrameRate(outputMap["streams"][0]["avg_frame_rate"]);
      console.log(avgFrameRate);
      lastFrameNumber = outputMap["frames"].length - 1;
      callbackWhenDone();
    });
  }

  export function printInfo() {
    console.log(`Last frame number: ${lastFrameNumber}`);
    console.log(`Average frame rate: ${avgFrameRate}`);
    console.log(`fifth frame: ${frameToString(frameInformation[4])}`);
  }
}
export default VideoKnowledgeBank;
