import * as React from "react";
import { useRef, useState } from "react";
import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";

import { Video, AVPlaybackStatus } from "expo-av";
import Constants from "expo-constants";

import { Text, View } from "../components/Themed";
import PlayPauseButton from "../components/video-components/PlayPauseButton";
import VideoProgressBar from "../components/video-components/VideoProgressBar";
import TimeDisplay from "../components/video-components/TimeDisplay";
import LoadVideoButton from "../components/video-components/LoadVideoButton";
import FrameDisplay from "../components/video-components/FrameDisplay";
import { default as VKB } from "../state_management/VideoKnowledgeBank";
import { default as AKB } from "../state_management/AnnotationKnowledgeBank";
import { formatTimeFromPosition } from "../components/TimeFormattingUtil";

import LineTool from "../components/video-side-menu/LineTool";
import MenuButton from "../components/MenuButton";
import SideMenu from "../components/video-side-menu/SideMenu";
import TimerTool from "../components/video-side-menu/TimerTool";
import FineControlBar from "../components/video-components/FineControlBar";
import ModeOverlay from "../components/video-components/ModeOverlay";

export default function VideoScreen({ navigation }) {
  const video = useRef<Video>(null);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [frameRate, setFrameRate] = useState<number>(0);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [durationMillis, setDurationMillis] = useState<number>(0);
  const [durationFrameNumber, setDurationFrameNumber] = useState<number>(0);

  const [currentPositionMillis, setCurrentPositionMillis] = useState<number>(0);
  const [currentFrameNumber, setCurrentFrameNumber] = useState<number>(0);

  const [trackTimestamp, setTrackTimestamp] = useState<Array<number>>([-1]);

  const [isLineToolActive, setIsLineToolActive] = useState<boolean>(false);
  const [timerToolTime, setTimerToolTime] = useState<number>(0);
  const [isTimerToolActive, setIsTimerToolActive] = useState<boolean>(false);

  const [timers, setTimers] = useState<Array<number>>([]);

  let annotation = AKB.getCurrentAnnotation(currentPositionMillis);

  const setTrackTimestampCorrected = (a: Array<number>) => {
    setTrackTimestamp([-1, ...a]);
  };

  const handleWhenVKBDone = async () => {
    if (video.current !== null) {
      const status: AVPlaybackStatus = await video.current!.getStatusAsync();
      if (status.isLoaded) {
        setDurationFrameNumber(
          VKB.timeToFrameNumber(status?.durationMillis ?? 0)
        );
        setFrameRate(VKB.getAvgFrameRate());
        setIsLoaded(true);
        setTrackTimestampCorrected(AKB.getEarlyCheckpointsTimestampArray());
      } else {
        console.log("VKB loaded but video did not load");
      }
    }
  };

  const onPauseAlignFrame = () => {
    video.current!.getStatusAsync().then((status: AVPlaybackStatus) => {
      handleUpdateStatus(status);
      if (status.isLoaded) {
        const frameNumber = VKB.timeToFrameNumber(status.positionMillis);
        const correctTime = VKB.frameNumberToTime(frameNumber);
        video.current!.setPositionAsync(correctTime, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      }
    });
  };

  const handleOnLoad = (data: AVPlaybackStatus) => {
    if (data.isLoaded && data.durationMillis !== null) {
      // console.log(data.uri);
      setDurationMillis(data.durationMillis!);
      // VideoKnowledgeBank.loadVideoInformation(data.uri, handleWhenVKBDone);
    }
  };

  const handleUpdateStatus = (status: AVPlaybackStatus) => {
    if (status?.isLoaded) {
      setCurrentPositionMillis(status?.positionMillis ?? 0);
      setCurrentFrameNumber(VKB.timeToFrameNumber(currentPositionMillis));
      setIsPlaying(status.isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation} />
      <View style={styles.mainRow}>
        <LineTool isActive={isLineToolActive} />
        {timers.map((e, i) => (
          <TimerTool
            key={e}
            timers={timers}
            setTimers={setTimers}
            isActive={true}
            startPositionMillis={e}
            currentPositionMillis={currentPositionMillis}
          />
        ))}

        <View style={styles.videoSpace}>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: "" }}
            useNativeControls={false}
            isLooping={false}
            onLoad={handleOnLoad}
            resizeMode="contain"
            onPlaybackStatusUpdate={handleUpdateStatus}
          />
        </View>
        <SideMenu
          isLoaded={isLoaded}
          setSnackbarVisible={setSnackbarVisible}
          currentPositionMillis={currentPositionMillis}
          annotation={annotation}
          toggleIsLineToolActive={() => {
            setIsLineToolActive(!isLineToolActive);
          }}
          toggleIsTimerToolActive={() => {
            setIsTimerToolActive(!isTimerToolActive);
            setTimerToolTime(isLoaded ? currentPositionMillis : 0);
          }}
          timers={timers}
          setTimers={setTimers}
          videoRef={video}
          setTrackTimestamp={setTrackTimestampCorrected}
        />
      </View>
      <View style={styles.controlRow}>
        <VideoProgressBar
          positionMillis={currentPositionMillis}
          durationMillis={durationMillis}
          videoRef={video}
          trackMarks={trackTimestamp}
        />
        <View style={styles.innerRow}>
          <View style={styles.innerRowLeftSection}>
            <View style={styles.playPauseButton}>
              <PlayPauseButton
                videoRef={video}
                isPlaying={isPlaying}
                isLoaded={isLoaded}
                onPauseAlignFrame={onPauseAlignFrame}
              />
            </View>
          </View>
          <FineControlBar
            isLoaded={isLoaded}
            currentFrameNumber={currentFrameNumber}
            totalFrames={durationFrameNumber}
            videoRef={video}
            tickWidth={20}
          />
        </View>
        <View style={[styles.innerRow, { justifyContent: "center" }]}>
          <View style={styles.timeDisplay}>
            <TimeDisplay
              positionMillis={currentPositionMillis}
              durationMillis={durationMillis}
            />
          </View>
          <View style={styles.timeDisplay}>
            <FrameDisplay
              positionFrameNumber={currentFrameNumber}
              durationFrameNumber={durationFrameNumber}
            />
          </View>
          <View style={styles.timeDisplay}>
            <Text> FPS: {frameRate.toFixed(3)}</Text>
          </View>
          <LoadVideoButton
            videoRef={video}
            handleWhenVKBDone={handleWhenVKBDone}
            // setVideoUri={setVideoUri}
            setIsNotLoaded={() => {
              setIsLoaded(false);
              setDurationFrameNumber(0);
            }}
          />
          <ModeOverlay />
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={300}
        >
          {annotation.name}: {formatTimeFromPosition(currentPositionMillis)}
        </Snackbar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    // backgroundColor: '#ecf0f1',
    padding: 8,
  },
  menuIcon: {
    zIndex: 2,
    flex: 1,
    position: "absolute",
    margin: 20,
  },
  mainRow: {
    // height: "65%",
    // width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  videoSpace: {
    flex: 9,
    justifyContent: "center",
    flexDirection: "row",
  },
  video: {
    // width: "20%",
    height: "100%",
    aspectRatio: 3 / 2,
    // backgroundColor: 'blue',
  },
  controlRow: {
    // flex: 1,
    height: 130,
    // backgroundColor: "black",
  },
  timeDisplay: {
    height: 20,
    // backgroundColor: 'red',
    marginHorizontal: 5,
  },

  innerRow: {
    // height: 100,
    flex: 1,
    flexDirection: "row",
    // backgroundColor: 'black',
    margin: 5,
    alignItems: "center",
  },
  innerRowLeftSection: {
    // backgroundColor: 'black',
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  innerRowSection: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor: 'black',
    marginHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  playPauseButton: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    // backgroundColor: 'green',
  },
  frameStepButton: {
    height: 30,
    width: 50,
    marginHorizontal: 5,
    // backgroundColor: 'blue',
  },
});
