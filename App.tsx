import React, {useEffect} from 'react';

import {
  Alert,
  AlertButton,
  BackHandler,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import CodePush from 'react-native-code-push';
import {useSelector} from 'react-redux';
import {FBAuthProvider} from './src/providers/AuthProvider';
import FBRouter from './src/providers/FBRouter';
import {IntlProvider} from 'react-intl';
import MessagesInEnglish from './src/lang/en';
import MessagesInBulgarian from './src/lang/bg';
import MessagesInRomanian from './src/lang/ro';
import {FBLocale} from './src/redux/user/reducer';
import {FBRootState} from './src/redux/store';
import {useAppState} from '@react-native-community/hooks';
import {
  check as checkPermission,
  PERMISSIONS,
  request as requestPermission,
} from 'react-native-permissions';
import {Settings as FBSettings} from 'react-native-fbsdk-next';
import {FBLoadingProvider} from './src/providers/FBLoaderProvider';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-community/async-storage';

const messages: {[p in FBLocale]: any} = {
  [FBLocale.BG]: MessagesInBulgarian,
  [FBLocale.EN]: MessagesInEnglish,
  [FBLocale.RO]: MessagesInRomanian,
};

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};

const isDebug = __DEV__;

// initialize the FB sdk
FBSettings.initializeSDK();

// configure google
GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '378104807990-kf7eh44l746m88am2mcjl3mt13ouiiuq.apps.googleusercontent.com',
  // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] specifies an account name on the device that should be used
  iosClientId:
    '378104807990-n6n7c6m3eal3c3sd5ja1thum91kljinv.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

let FBApp = () => {
  const selectedLocale = useSelector(
    (state: FBRootState) => state.userState.locale,
  );

  const appState = useAppState();
  useEffect(() => {
    const setupFB = async (params: {attEnabled: boolean}) => {
      await FBSettings.setAdvertiserTrackingEnabled(params.attEnabled);
    };

    const checkAttPermission = async () => {
      const attCheck = await checkPermission(
        PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
      );
      if (attCheck === 'granted' || attCheck === 'unavailable') {
        await setupFB({attEnabled: true});
      } else if (attCheck === 'blocked') {
        await setupFB({attEnabled: true});
      } else {
        const attRequest = await requestPermission(
          PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
        );
        if (attRequest === 'granted' || attRequest === 'unavailable') {
          await setupFB({attEnabled: true});
        } else {
          await setupFB({attEnabled: true});
        }
      }
    };

    const checkVersion = async () => {
      let versionCheck = await VersionCheck.needUpdate();

      // TODO: get latest version info from BACKEND and decide what to do
      // TODO: surround with try-catch and ensure proper handling

      if (versionCheck.isNeeded) {
        const buttons: AlertButton[] = [
          {
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(versionCheck.storeUrl);
            },
          },
        ];

        if (isDebug) {
          buttons.unshift({
            text: 'Cancel',
          });
        }

        Alert.alert(
          'Update available',
          'Please update to newest version.',
          buttons,
          {cancelable: isDebug},
        );
      }
    };

    if (appState === 'active' && Platform.OS === 'ios') {
      checkAttPermission();
    }

    checkVersion();
  }, [appState]);

  return (
    <IntlProvider
      messages={messages[selectedLocale]}
      locale={selectedLocale}
      defaultLocale={FBLocale.BG}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar
          barStyle={'light-content'}
          animated={true}
          backgroundColor={'#182550'}
        />

        <FBLoadingProvider>
          <FBAuthProvider>
            <FBRouter />
          </FBAuthProvider>
        </FBLoadingProvider>
      </SafeAreaProvider>
    </IntlProvider>
  );
};

if (!isDebug) {
  FBApp = CodePush(CODE_PUSH_OPTIONS)(FBApp);
} else {
  console.log('skipping CodePush since this is debug');
}

export default FBApp;
