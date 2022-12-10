/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren, useEffect, useRef} from 'react';
import {
  Button, Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CodePush from 'react-native-code-push';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {AppEventsLogger, Settings as FBSettings} from 'react-native-fbsdk-next';
import {isEnabled} from 'appcenter';
import {useAppState} from '@react-native-community/hooks';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Map, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapView from 'react-native-map-clustering';

const Section: React.FC<PropsWithChildren<{
  title: string;
}>> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const checkAppCenter = async () => {
    const enabled = await isEnabled();
    console.log('checkAppCenter', enabled);
  };

  useEffect(() => {
    checkAppCenter();
  }, []);

  
  
  const state = useAppState();
  useEffect(() => {
    const checkAttPermissions = async () => {
      console.log('checkAttPermissions');
      const att_check = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      console.log('att_check ', att_check);
      if (att_check === 'granted' || att_check === 'unavailable') {
        await setupFB(true);
      } else {
        const att_request = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        console.log('att_request ', att_request);

        if (att_request === 'granted') {
          await setupFB(true);
        }
      }

    };

    const setupFB = async (attEnabled: boolean) => {
      console.log('setupFB ', attEnabled);
      if (attEnabled) {
        FBSettings.setAppID('1532703837120978');
        FBSettings.initializeSDK();
        await FBSettings.setAdvertiserTrackingEnabled(attEnabled);
      }
    };
    
    
    if (state === 'active' && Platform.OS === 'ios') {
      checkAttPermissions();
    }
    return () => {
    };
  }, [state]);

  GoogleSignin.configure();

  const googleLogin = async () => {
    try {
      const result = await GoogleSignin.signIn();
      console.log('googleLogin result', result);
      let tt = await GoogleSignin.getTokens();
      console.log('googleLogin tt', tt);
      const isAuthorized = !!tt.accessToken;
      console.log('googleLogin isAuthorized', isAuthorized);
    } catch (error) {
      console.log('googleLogin error', error);
    }
  };

  const mapRef = useRef<Map>();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header/>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

          <Button
            title="Test Android"
            onPress={async () => {
              await analytics().logEvent('android_test', {
                id: 'aisdj',
                item: 'mens grey t-shirt',
                size: 'L',
              });
              console.log('event logged');
            }}
          />

          <Button
            title="Cash test"
            onPress={() => {
              crashlytics().crash();

              throw 'OMG';
              console.log('crashed');
            }}
          />


          <Button
            title="FB Event "
            onPress={() => {
              AppEventsLogger.logEvent('test_google', {blqt: 1});
              console.log('FB event send');
            }}
          />

          <Button
            title="Google login "
            onPress={async () => {
              await googleLogin();
            }}
          />


          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="Map">
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
            </MapView>
          </Section>
          <LearnMoreLinks/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 300,
    width: 300
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

let CodePushOptions = {
  checkFrequency: __DEV__
    ? CodePush.CheckFrequency.MANUAL
    : CodePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: 'a new update is available!',
  },
};

export default CodePush(CodePushOptions)(App);
