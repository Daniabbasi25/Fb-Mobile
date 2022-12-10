/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import React, {useEffect, useState} from 'react';
import allReducer, {FBRootState} from './src/redux/store';
import {persistReducer, persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {restaurantInitialState} from './src/redux/restaurant/reducer';
import {ordersInitialState} from './src/redux/order/reducer';
import {userInitialState} from './src/redux/user/reducer';
import {PersistedState} from 'redux-persist/es/types';
import {AuthData} from './src/models/AuthData';
import {AUTH_DATA_KEY} from './src/providers/AuthProvider';
import {UserRepository} from './src/repositories/UserRepository';
import {createStore} from 'redux';
import {name as appName} from './app.json';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

// catches DATA-ONLY notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {});

interface StateV0 {
  auth: any;
  user: any;
  restaurant: any;
}

const migrations = {
  1: async (_oldState: StateV0): Promise<FBRootState> => {
    const state: FBRootState = {
      restaurantState: restaurantInitialState,
      ordersState: ordersInitialState,
      userState: userInitialState,
    };

    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
        const authData: AuthData = {userToken: userToken};
        const userRepo = new UserRepository({authData});
        const user = await userRepo.checkMe({});

        state.userState.user = user;

        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.setItem(AUTH_DATA_KEY, JSON.stringify(authData));
      }
    } catch (e) {
      // problem reading token -> sign out user
      await AsyncStorage.removeItem('userToken');
    }

    return state;
  },
};

const currentStoreVersion = 1;
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: currentStoreVersion,
  whitelist: ['userState'],
  migrate: async (state: PersistedState, currentVersion: number) => {
    if (!state) {
      return Promise.resolve(undefined);
    }

    let inboundVersion: number = state._persist?.version;

    if (inboundVersion === currentVersion) {
      return Promise.resolve(state);
    }

    let migrationKeys = Object.keys(migrations)
      .map(ver => parseInt(ver))
      .filter(key => currentVersion >= key && key > inboundVersion)
      .sort((a, b) => a - b);

    try {
      let migratedState = {...state};

      for (let versionKey of migrationKeys) {
        // @ts-ignore
        migratedState = await migrations[versionKey](migratedState);
      }

      return Promise.resolve(migratedState);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

const persistedReducer = persistReducer(persistConfig, allReducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);

// ignore stupid warning from Geolocation library
LogBox.ignoreLogs([
  'Warning: Called stopObserving with existing subscriptions',
  '`new NativeEventEmitter()` was called with a non-null argument without',
]);

const ReduxApp = () => {
  const [isHeadless, setIsHeadless] = useState(true);

  useEffect(() => {
    const verifyIsHeadless = async () => {
      try {
        const isHeadlessResult = await messaging().getIsHeadless();
        setIsHeadless(isHeadlessResult);
      } catch (e) {
        setIsHeadless(false);
      }
    };

    verifyIsHeadless();
  }, []);

  if (isHeadless) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => ReduxApp);
