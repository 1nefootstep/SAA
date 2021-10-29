# Swim Analysis App

## Setup and debugging
1. Make sure that node is installed. Then install yarn (`npm i -g yarn`)
2. At the root of the folder, run `yarn install`
3. To debug, connect device and run `yarn android`
4. If device is iOS, go to iOS folder (`cd ios`) and run `pod install`. Then, go back to the root folder and run `yarn ios`.

## Potential issues

### 1. JSI_LIB
If you encounter some issue with cmake or JSI_LIB,
Refer to [this](https://github.com/mrousavy/react-native-vision-camera/issues/513#issuecomment-940857627) for a fix.

Essentially, go to `node_modules/react-native-vision-camera/android/CMakeList.txt` and delete the lines to do with JSI_LIB.
