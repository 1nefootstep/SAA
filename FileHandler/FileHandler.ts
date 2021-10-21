import { Platform } from "react-native";
import * as RNFS from "react-native-fs";
import {APP_NAME} from "../constants/Strings";

module FileHandler {
  function getDirPath() {
    if (Platform.OS === "android") {
      return `${RNFS.ExternalStorageDirectoryPath}/${APP_NAME}`;
    } else {
      // need to figure out what's best for ios
      return `${RNFS.MainBundlePath}/${APP_NAME}`;
    }
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

  export type TextResponse = {
    isAvailable: true,
    response: string,
  } | { isAvailable: false, }

  export async function saveTextToAppFolder(filename:string, text:string){
    const dirPath = getDirPath();
    const destination = `${dirPath}/${filename}`;
    await RNFS.mkdir(dirPath);
    console.log(`trying to write to ${destination}`)
    RNFS.writeFile(destination, text).then(() => console.log(`wrote to ${destination}`)).catch((err) => console.log(err));
  }

  export async function readText(filepath:string):Promise<TextResponse> {
    const isAvailable = await RNFS.exists(filepath);
    if (!isAvailable) {
      return {isAvailable: isAvailable};
    }
    const response = await RNFS.readFile(filepath);
    return {isAvailable: isAvailable, response:response};
  }

  export async function readTextWithVideoFile(videopath:string):Promise<TextResponse> {
    const basename = getBaseName(videopath);
    const dirPath = getDirPath();
    const filepath = `${dirPath}/${basename}.txt`;
    console.log(filepath);
    
    const isAvailable = await RNFS.exists(filepath);
    if (!isAvailable) {
      return {isAvailable: isAvailable};
    }
    const response = await RNFS.readFile(filepath);
    return {isAvailable: isAvailable, response:response};
  }

  export async function moveVideoToAppFolder(source: string): Promise<void> {
    const dirPath = getDirPath();
    const destination = `${dirPath}/${getBaseNameWithFileExtension(source)}`;
    await RNFS.mkdir(dirPath);
    return RNFS.moveFile(source, destination);
  }
}

export default FileHandler;
