import React, { useEffect, RefObject } from "react";
import { StyleSheet } from "react-native";
import { Platform, TouchableOpacity } from "react-native";
import { Text } from "../Themed";
// import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "react-native-document-picker";
import { Video } from "expo-av";
import AnnotationKnowledgeBank from "../../state_management/AnnotationKnowledgeBank";
import VideoKnowledgeBank from "../../state_management/VideoKnowledgeBank";

export interface LoadVideoProps {
  videoRef: RefObject<Video>;
  // setVideoUri: (s: string) => void;
  setIsNotLoaded: () => void;
  handleWhenVKBDone: () => void;
}

type PickVideoResult =
  | {
      isSuccessful: false;
      err: any;
    }
  | {
      isSuccessful: true;
      result: DocumentPicker.DocumentPickerResponse[];
    };

export default function LoadVideoButton(props: LoadVideoProps) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        // const { status } =
          // await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== "granted") {
        //   alert("Sorry, we need camera roll permissions to make this work!");
        // }
      }
    })();
  }, []);

  const pickVideo = async ():Promise<PickVideoResult> => {
  // const pickVideo = () => {
    // let result = ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });
    try {
      const result = await DocumentPicker.pick({
        // type: "*/*",
        mode: 'open',
        copyTo: 'cachesDirectory',
      });
      result[0].fileCopyUri
      return {isSuccessful: true, result}
    } catch (err) {
      return {isSuccessful: false, err}
    }
    // return result;
  };

  const handleOnPress = () => {
    pickVideo()
      .then((value) => {
        // if (!value.cancelled) {
          if (value.isSuccessful) {
            let targetUri = value.result[0].fileCopyUri !== '' ? value.result[0].fileCopyUri : value.result[0].uri;
          // console.log('handle on press at load video');
          // console.log(value.result[0].uri);
          if (
            props.videoRef.current !== null &&
            props.videoRef.current !== undefined
          ) {
            props.videoRef.current
              .unloadAsync()
              .then(() => {
                props.videoRef
                  // .current!.loadAsync({ uri: value.uri })
                  .current!.loadAsync({ uri: targetUri })
                  .catch((err) => console.log(`Error at loadAsync: ${err}`));
                props.setIsNotLoaded();
                AnnotationKnowledgeBank.loadAnnotationInfoWithVideoFilePath(
                  // value.uri
                  targetUri
                );
                VideoKnowledgeBank.loadVideoInformation(
                  // value.uri,
                  targetUri,
                  props.handleWhenVKBDone
                );
              })
              .catch((err) => console.log(`Error at unloadAsync: ${err}`));
          }
          // props.setVideoUri(value.uri);
          // props.setIsNotLoaded();
        }
      })
      .catch((err) => console.log(`Error at pickVideo: ${err}`));
  };
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <Text>Load Video</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  colourText: {
    color: "blue",
  },
});
