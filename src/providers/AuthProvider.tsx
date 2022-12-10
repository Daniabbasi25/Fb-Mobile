import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FBUser} from '../models/User';
import {AuthData} from '../models/AuthData';
import {useDispatch} from 'react-redux';
import {userSetUserAction, userUnsetUserAction} from '../redux/user/actions';
import {restaurantResetAction} from '../redux/restaurant/actions';
import {orderResetAction} from '../redux/order/actions';

interface AuthContextData {
  authData?: AuthData;
  authLoading: boolean;

  signIn(params: { user: FBUser, authData: AuthData }): Promise<void>;

  signOut(): void;
}

export const AUTH_DATA_KEY = 'AUTH_DATA';

const FBAuthContext = createContext<AuthContextData>({} as AuthContextData);

const useAuth = (): AuthContextData => {
  const context = useContext(FBAuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const FBAuthProvider = ({children}: {children?: ReactNode}) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de loadStorageData function.
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await AsyncStorage.getItem(AUTH_DATA_KEY);
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  const signIn = async (params: { user: FBUser, authData: AuthData }) => {
    dispatch(userSetUserAction({user: params.user}));
    await AsyncStorage.setItem(AUTH_DATA_KEY, JSON.stringify(params.authData));
    setAuthData(params.authData);
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem(AUTH_DATA_KEY);
    dispatch(userUnsetUserAction());
    dispatch(restaurantResetAction());
    dispatch(orderResetAction());
  };

  return (
    <FBAuthContext.Provider value={{authData, authLoading: loading, signIn, signOut}}>
      {children}
    </FBAuthContext.Provider>
  );
};

export {
  useAuth,
  FBAuthProvider,
};
