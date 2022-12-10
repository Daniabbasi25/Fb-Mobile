import {Dimensions, Platform} from 'react-native';

export const Utils = {
  android: Platform.OS === 'android',
  ios: Platform.OS === 'ios',
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  ASPECT_RATIO: Dimensions.get('window').width / Dimensions.get('window').height
};
