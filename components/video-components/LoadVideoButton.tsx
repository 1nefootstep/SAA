import React, { useEffect, RefObject } from "react";
import { StyleSheet } from "react-native";
import { Platform, TouchableOpacity } from "react-native";
import { Text } from "../Themed";
import * as DocumentPicker from "react-native-document-picker";
import { Video } from "expo-av";

import { default as AKB } from "../../state_management/AnnotationKnowledgeBank";
import { default as VKB } from "../../state_management/VideoKnowledgeBank";
import { default as FileHandler } from "../../FileHandler/FileHandler";
import { isNotNullNotUndefined } from "../Util";

export interface LoadVideoProps {
  videoRef: RefObject<Video>;
  setIsNotLoaded: () => void;
  handleWhenVKBDone: (b: boolean, s: string) => void;
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

  const pickVideo = async (): Promise<PickVideoResult> => {
    try {
      const result = await DocumentPicker.pick({
        mode: "open",
        copyTo: "cachesDirectory",
      });
      return { isSuccessful: true, result };
    } catch (err) {
      return { isSuccessful: false, err };
    }
  };

  const readData = (targetUri: string) => {
    props.setIsNotLoaded();
    const promisedResponse = FileHandler.readTextWithVideoFile(targetUri);
    promisedResponse.then((r) => {
      let dataObject: FileHandler.DataObject;
      if (r.isAvailable) {
        try {
          dataObject = JSON.parse(r.response);
          console.log("successful parsing of file response");
        } catch (err) {
          console.log(`error: ${err}`);

          dataObject = {
            videoInformation: {
              frameInformation: [],
              avgFrameRate: 0,
              lastFrameNumber: 0,
            },
            annotationInfo: AKB.defaultAKB(),
          };
        }
        AKB.loadAnnotationInfo(dataObject["annotationInfo"]);
        if ((dataObject.videoInformation.frameInformation.length ?? 0) > 0) {
          VKB.loadCachedInformation(dataObject["videoInformation"]);
          props.handleWhenVKBDone(false, targetUri);
        } else {
          VKB.loadVideoInformation(targetUri, () =>
            props.handleWhenVKBDone(true, targetUri)
          );
        }
      } else {
        VKB.loadVideoInformation(targetUri, () =>
          props.handleWhenVKBDone(true, targetUri)
        );
      }
    });
  };

  const handleOnPress = () => {
    pickVideo()
      .then(async (value) => {
        if (value.isSuccessful) {
          const result = value.result[0];
          const targetUri =
            (result.fileCopyUri !== "" ? result.fileCopyUri : result.uri) ?? "";
          if (isNotNullNotUndefined(props.videoRef.current)) {
            const video = props.videoRef.current!;
            AKB.reset();
            // unload video if already loaded
            if ((await video.getStatusAsync()).isLoaded) {
              video
                .unloadAsync()
                .catch((err) => console.log(`Error at unloadAsync: ${err}`));
            }
            // start loading video
            video
              .loadAsync({ uri: targetUri })
              .catch((err) => console.log(`Error at loadAsync: ${err}`));

            readData(targetUri);
          }
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
