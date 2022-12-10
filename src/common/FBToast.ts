import {showMessage} from 'react-native-flash-message';

export const showToast = (message: string) => {
  return showMessage({message: message, type: 'success', duration: 3000});
};

export const showToastError = (message: string) => {
  return showMessage({message: message, type: 'danger', duration: 3000});
};
