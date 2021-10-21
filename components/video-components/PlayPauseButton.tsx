import * as React from "react";
import { RefObject } from "react";
import { Video, AVPlaybackStatus } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";


export interface PlayPauseButtonProps {
  isPlaying: boolean;
  isLoaded: boolean;
  videoRef: RefObject<Video>;
  onPauseAlignFrame: ()=>void;
}

export default function PlayPauseButton(props: PlayPauseButtonProps) {
  const handleOnPress = () => {
    if (props.isLoaded) {
      if (props.isPlaying) {
         props.videoRef.current!.pauseAsync().then((_result: any) =>
          props.onPauseAlignFrame()
         );
      } else {
        props.videoRef.current!.playAsync();
      }
    }
  };

  if (props.isLoaded && props.videoRef.current !== null) {
    if (props.isPlaying) {
      return <FontAwesome onPress={handleOnPress} name="pause" size={30} color="red" />;
    }
    return <FontAwesome onPress={handleOnPress} name="play" size={30} color="green" />;
  }
  return <FontAwesome onPress={()=>{}} name="play" size={24} color="green" />;
}