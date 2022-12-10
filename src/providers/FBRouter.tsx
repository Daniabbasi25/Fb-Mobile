import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthProvider';
import {ImageBackground, Text, View, Image} from 'react-native';
import {Utils} from '../utils';
import {images} from '../constants';
// import {SvgXml, WithLocalSvg} from 'react-native-svg';

import {NavigationContainer} from '@react-navigation/native';
import SignInScreen from '../screens/Authorization/Login';
// import SignUpScreen from '../screens/Authorization/SignUp';
import HomeTabs from '../navigation/homeTabs';
import OrderFinalized from '../screens/OrderFinalized';
import OrderError from '../screens/OrderError';
import SideMenuContent from '../screens/SideMenuContent';
import Profile from '../screens/Profile';
import Offer from '../screens/Offer';
import PaymentMethod from '../screens/PaymentMethod';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import ErrorBoundary from 'react-native-error-boundary';
import {showToastError} from '../common/FBToast';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';
import {
  SelectLanguageScreen,
  LoginScreen,
  SignUpScreen,
  GeneralTerms,
  ChooseCity,
  Objects,
  Orders,
  LovedOnes,
  ProfileScreen,
  ProductDetail,
  OrderDetailScreen,
  StartScreen,
  LatestLOcation,
  Setting,
  FAQ,
  FilterScreen,
  SaveOrderScreen,
  Home,
} from '../screens';
import ListOrders from '../screens/ListOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();
// 
const FBRouter = () => {
  const {authData, authLoading, signOut} = useAuth();
  const intl = useIntl();
  const [showSPlashScreen, setShowSPlashScreen] = useState(true);
  const [showLanguageScreen,setShowLanguageScreen]=useState(true);
  const [language,setLanguage]=useState('')
  useEffect(() => {
    setTimeout(() => {
      setShowSPlashScreen(false);
    }, 3000);

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@Language');
        if (value !== null) {
         setShowLanguageScreen(false)
        }
      } catch (e) {
        console.log('error occure',e)
      }
    };
getData()
  }, []);

  if (showSPlashScreen) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#182550',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <WithLocalSvg
          asset={require('./../../assets/images/logo.svg')}
          width={210}
          height={210}
          fill={'#fff'}
        /> */}
        <Image source={images.app_logo} style={{width: 224, height: 80}} />
      </View>
    );
  }

  if (!showSPlashScreen) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
          }}
          initialRouteName={
            showLanguageScreen ? 'SelectLanguageScreen' : 'LoginScreen'
          }>
          {/* <AuthStack.Screen name="SignInScreen" component={SignInScreen} />
          <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} /> */}
          
              <AuthStack.Screen
                name="SelectLanguageScreen"
                component={SelectLanguageScreen}
              />
           
          <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
          <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
          <AuthStack.Screen name="GeneralTerms" component={GeneralTerms} />
          <AuthStack.Screen name="ChooseCity" component={ChooseCity} />
          <AuthStack.Screen name="Objects" component={Objects} />
          <AuthStack.Screen name="LovedOnes" component={LovedOnes} />
          <AuthStack.Screen name="ProfileScreen" component={ProfileScreen} />
          <AuthStack.Screen name="Orders" component={Orders} />
          <AuthStack.Screen name="ListOrders" component={ListOrders} />
          <AuthStack.Screen name="ProductDetail" component={ProductDetail} />
          <AuthStack.Screen name="Offer" component={Offer} />
          <AuthStack.Screen name="PaymentMethod" component={PaymentMethod} />
          <AuthStack.Screen name="OrderError" component={OrderError} />
          <AuthStack.Screen name="OrderFinalized" component={OrderFinalized} />

          <AuthStack.Screen
            name="OrderDetailScreen"
            component={OrderDetailScreen}
          />
          <AuthStack.Screen name="StartScreen" component={StartScreen} />
          <AuthStack.Screen name="LatestLOcation" component={LatestLOcation} />
          <AuthStack.Screen name="Setting" component={Setting} />
          <AuthStack.Screen name="FAQ" component={FAQ} />
          <AuthStack.Screen name="FilterScreen" component={FilterScreen} />
          <AuthStack.Screen
            name="SaveOrderScreen"
            component={SaveOrderScreen}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <ErrorBoundary
      onError={(_e: Error) => {
        showToastError(translateText(intl, 'genericerror'));
        signOut();
      }}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={'HomeTabs'}
          drawerContent={props => <SideMenuContent {...props} />}>
          <Drawer.Screen name="HomeTabs" component={HomeTabs} />
          <Drawer.Screen name="Offer" component={Offer} />
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="PaymentMethod" component={PaymentMethod} />
          <Drawer.Screen name="OrderFinalized" component={OrderFinalized} />
          <Drawer.Screen name="OrderError" component={OrderError} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default FBRouter;
