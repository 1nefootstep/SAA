import { PermissionsAndroid, Platform } from "react-native";
import * as RNFS from "react-native-fs";

import CameraRoll from "@react-native-community/cameraroll";

import { APP_NAME } from "../constants/Strings";
import { default as AKB } from "../state_management/AnnotationKnowledgeBank";
import { default as VKB } from "../state_management/VideoKnowledgeBank";

module FileHandler {
  export interface DataObject {
    annotationInfo: AKB.AnnotationInformation;
    videoInformation: VKB.VideoInformation;
  }

  function getDestinationFolder() {
    return RNFS.ExternalDirectoryPath;
  }

  export async function readWritePermission() {
    if (Platform.OS === "android") {
      const readPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      const writePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      let finalReadPermission = readPermission;
      let finalWritePermission = writePermission;
      console.log(
        `readPermission: ${readPermission} writePermission: ${writePermission}`
      );
      if (!readPermission) {
        const newReadPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        finalReadPermission = newReadPermission === "granted";
      }
      if (!writePermission) {
        const newWritePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        finalWritePermission = newWritePermission === "granted";
      }
      return finalReadPermission && finalWritePermission;
    }
    return true;
  }

  export function getBaseName(path: string): string {
    let base = new String(path).substring(path.lastIndexOf("/") + 1);
    if (base.lastIndexOf(".") != -1) {
      base = base.substring(0, base.lastIndexOf("."));
    }
    return base;
  }

  export function getBaseNameWithFileExtension(path: string): string {
    return new String(path).substring(path.lastIndexOf("/") + 1);
  }

  export type TextResponse =
    | {
        isAvailable: true;
        response: string;
      }
    | { isAvailable: false };

  export async function saveTextToAppFolder(filename: string, text: string) {
    // const dirPath = await getDirPath();
    const destination = `${getDestinationFolder()}/${filename}`;
    // await RNFS.mkdir(dirPath);
    console.log(`trying to write to ${destination}`);
    RNFS.writeFile(destination, text)
      .then(() => console.log(`wrote to ${destination}`))
      .catch((err) => console.log(err));
  }

  export async function saveVideoAndAnnotations(videoFilePath: string) {
    const filename = `${FileHandler.getBaseName(videoFilePath)}.txt`;
    const destination = `${getDestinationFolder()}/${filename}`;
    const videoInformation = VKB.getVideoInformation();
    const annotationInfo = AKB.getAnnotationInfo();
    const data: DataObject = {
      annotationInfo: annotationInfo,
      videoInformation: videoInformation,      
    };

    console.log(`trying to write to ${destination}`);
    RNFS.writeFile(destination, JSON.stringify(data))
      .then(() => console.log(`wrote to ${destination}`))
      .catch((err) => console.log(err));
  }

  // export function loadAnnotationInfo(
  //   infoInJson: string,
  //   callbackIfFailParse: (e: any) => void
  // ) {
  //   try {
  //     annotationInfo = JSON.parse(infoInJson);
  //     console.log(annotationInfo);
  //   } catch (e: any) {
  //     callbackIfFailParse(e);
  //   }
  // }

  export async function readText(filepath: string): Promise<TextResponse> {
    const isAvailable = await RNFS.exists(filepath);
    if (!isAvailable) {
      return { isAvailable: isAvailable };
    }
    const response = await RNFS.readFile(filepath);
    return { isAvailable: isAvailable, response: response };
  }

  export async function readTextWithVideoFile(
    videopath: string
  ): Promise<TextResponse> {
    const basename = getBaseName(videopath);
    // const dirPath = getDirPath();
    const filepath = `${getDestinationFolder()}/${basename}.txt`;
    console.log(filepath);

    const isAvailable = await RNFS.exists(filepath);
    if (!isAvailable) {
      return { isAvailable: isAvailable };
    }
    const response = await RNFS.readFile(filepath);
    return { isAvailable: isAvailable, response: response };
  }

  export async function saveVideoToCameraRoll(filePath: string) {
    if (Platform.OS === "android" && !(await readWritePermission())) {
      return;
    }

    CameraRoll.save(filePath, { type: "video", album: "SwimAnalysis" });
  }
}

export default FileHandler;
