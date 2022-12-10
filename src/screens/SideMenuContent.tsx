import React, {useEffect} from 'react';
import {Image, Linking, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  CONTACT_US_FACTORY,
  FAQ_FACTORY,
  REGISTER_BUSINESS_FACTOR,
  TERMS_AND_CONDITIONS_FACTORY,
} from '../network/Server';
import {useAuth} from '../providers/AuthProvider';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {FBUser} from '../models/User';
// @ts-ignore
import CloseIcon from '../../assets/icons/close-icon.svg';
import {analyticsLinkOpened, analyticsSignOut} from '../analytics';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {COLORS} from '../constants';
import {FBLocale} from '../redux/user/reducer';
import ENFLag from '../../assets/flags/us.svg';
import ROFLag from '../../assets/flags/ro.svg';
import BGFlag from '../../assets/flags/bg.svg';
import {userUpdateLocaleAction} from '../redux/user/actions';
import RNPickerSelect from 'react-native-picker-select';
import {UserRepository} from '../repositories/UserRepository';

const SideMenuContent = (props: any) => {
  const navigation = props.navigation;
  const {signOut} = useAuth();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const styles = stylesCreator();
  const intl = useIntl();
  const {authData} = useAuth();
  const dispatch = useDispatch();
  const userRepository = new UserRepository({authData: authData!});
  
  useEffect(() => {
    const unsubscriptions: any[] = [];
    
    const getUserNotificationsConsent = async (): Promise<boolean> => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    };

    const setUpNotifications = async (): Promise<any[]> => {
      let hasUserConsent = true;

      if (Platform.OS === 'ios') {
        hasUserConsent = await getUserNotificationsConsent();
      }
      
      if (hasUserConsent) {
        // const installationId = await firebase.installations().getId();
        let fcmToken = await messaging().getToken();
        await userRepository.setFcmToken({fcmToken: fcmToken});
        
        const onTokenUpdateUnsubscribe = messaging().onTokenRefresh(async (token)=> {
          fcmToken = token;
          await userRepository.setFcmToken({fcmToken: fcmToken});
        });
        
        const initialRemoteMessage = await messaging().getInitialNotification();
        if (initialRemoteMessage) {
          // Notification caused app to open from quit state
          // console.log('setUpNotifications initialRemoteMessage', JSON.stringify(initialRemoteMessage));
        }
        
        const onNotificationOpenAppUnsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
          // Notification caused app to open from background state
          // console.log('setUpNotifications onNotificationOpenedApp remoteMessage', JSON.stringify(remoteMessage));
        });

        const onMessageUnsubscribe = messaging().onMessage(async remoteMessage => {
          // notification received when app is focused
          // console.log('setUpNotifications onMessage', JSON.stringify(remoteMessage));
        });
        
        unsubscriptions.push(onNotificationOpenAppUnsubscribe);
        unsubscriptions.push(onMessageUnsubscribe);
        unsubscriptions.push(onTokenUpdateUnsubscribe);
      }
      
      return unsubscriptions;
    };
    
    setUpNotifications();
    
    return () => {
      unsubscriptions.forEach(unsubscription => unsubscription());
    };
  }, []);
  
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.avatarWrapper}>
        {/*<Avatar*/}
        {/*  rounded*/}
        {/*  size="large"*/}
        {/*  title={user?.firstName && user.firstName[0]}*/}
        {/*  titleStyle={{color: '#000'}}*/}
        {/*  activeOpacity={0.7}*/}
        {/*  overlayContainerStyle={{backgroundColor: '#fff'}}*/}
        {/*/>*/}
        <Text style={styles.avatarNameText}>
          {user?.firstName} {user?.lastName}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.closeDrawer()}
          style={styles.closeIcon}
        >
          <CloseIcon/>
        </TouchableOpacity>
      </View>

      <View style={styles.listItemsWrapper}>
        <RNPickerSelect
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 10,
              right: 12,
            },
          }}
          useNativeAndroidPickerStyle={false}
          // @ts-ignore
          Icon={() => {
            if (userLocale === FBLocale.EN) {
              return (<ENFLag/>);
            } else if (userLocale === FBLocale.RO) {
              return (<ROFLag/>);
            } else {
              return (<BGFlag/>);
            }
          }}
          value={userLocale}
          onValueChange={async (locale: FBLocale | null) => {
            if (locale) {
              dispatch(userUpdateLocaleAction({locale: locale}));
              const userRepository = new UserRepository({authData: authData!});
              await userRepository.updateLocale({locale});
            }
          }}
          items={[
            {label: 'English', value: FBLocale.EN},
            {label: 'Български', value: FBLocale.BG},
            {label: 'Română', value: FBLocale.RO},
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Profile');
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_profile_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.profile')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = REGISTER_BUSINESS_FACTOR[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_REGISTER_BUSINESS',
              loc: userLocation,
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_hero_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.business')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = TERMS_AND_CONDITIONS_FACTORY[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_TERMS_OF_SERVICE',
              loc: userLocation,
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_privacy_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.privacy')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = FAQ_FACTORY[userLocale];
            analyticsLinkOpened({userId: user.id, email: user.email, link: link, linkName: 'WEBSITE_FAQ', loc: userLocation,});
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_faq_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.faq')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            const link = CONTACT_US_FACTORY[userLocale];
            analyticsLinkOpened({
              userId: user.id,
              email: user.email,
              link: link,
              linkName: 'WEBSITE_CONTACT_US',
              loc: userLocation,
            });
            Linking.openURL(link);
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_contact_us_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.contact')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.closeDrawer();
            analyticsSignOut({userId: user.id, email: user.email, loc: userLocation});
            signOut();
          }}
          style={styles.listItemWrapper}
        >
          <View style={styles.listItemContentWrapper}>
            <Image
              source={require('../../assets/icons/app_logout_icon.png')}
              style={styles.listItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.listItemText}>
              {translateText(intl, 'drawer.logout')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SideMenuContent;

const pickerSelectStyles = StyleSheet.create({
  inputIOSContainer: {
    width: 200,
    alignSelf: 'center',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: COLORS.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroidContainer: {
    width: 200,
    alignSelf: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: COLORS.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const stylesCreator = () => StyleSheet.create({
  mainWrapper: {flex: 1, color: COLORS.black},
  avatarWrapper: {
    backgroundColor: '#2A4764',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },

  avatarNameText: {marginTop: 10, fontSize: 20, color: '#fff'},
  listItemsWrapper: {flex: 1, marginVertical: 20, marginHorizontal: 10},
  listItemWrapper: {flexDirection: 'row', borderRadius: 5},
  listItemContentWrapper: {flexDirection: 'row', padding: 10},
  listItemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  listItemText: {fontSize: 16, fontWeight: '400'},
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
