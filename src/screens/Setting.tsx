import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import LeftIcon from './../../assets/images/chevron-left.svg';
import EditIcon from './../../assets/images/edit.svg';
import RightIcon from './../../assets/images/Chevron-right.svg';
import ShareIcon from './../../assets/images/external-link.svg';
import CloseIcon from './../../assets/images/close.svg';
import { useDispatch, useSelector } from 'react-redux';
import { FBRootState } from '../redux/store';
import { FBUser } from '../models/User';
import { CONTACT_US_FACTORY, REGISTER_BUSINESS_FACTOR } from '../network/Server';
import { translateText } from '../lang/translate';
import QueryString from 'query-string';
import { showToastError } from '../common/FBToast';
import { useIntl } from 'react-intl';
import { useFbLoading } from '../providers/FBLoaderProvider';
import { UserRepository } from '../repositories/UserRepository';
import { userUpdateProfileAction } from '../redux/user/actions';
import { isFBAppError, isFBBackendError, isFBGenericError } from '../network/axiosClient';
import { useAuth } from '../providers/AuthProvider';
import messaging from '@react-native-firebase/messaging';


interface SettingProps {
  route: any;
  navigation: any;
}
const Setting = ({navigation}: SettingProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);
  const intl = useIntl();
  const {authData} = useAuth();
  const [newPassword, setNewPassword] = useState(null)
  const {showLoading, hideLoading} = useFbLoading();
  const dispatch = useDispatch();

  // const navigation = props.navigation;
  const {signOut} = useAuth();
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  // const styles = stylesCreator();
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
  const userData = [
    {
      value: user.firstName,
      editAble: false,
    },
    {
      value: user.phoneNumber,
      editAble: false,
    },
    {
      value: user.email,
      editAble: false,
    },
  ];
  const handleAccountDeletion = () => {
    Alert.alert(
      translateText(intl, 'profile.delete_title'),
      translateText(intl, 'profile.delete_account_process'),
      [
        {
          text: translateText(intl, 'back'),
        },
        {
        text: translateText(intl, 'continue'),
        onPress: async () => {
          
          let url = 'mailto:support-customer@foodobox.com';
          const query = QueryString.stringify({
            subject: translateText(intl, 'profile.delete_email_subject'),
            body: `${translateText(intl, 'profile.delete_email_text')} ${user.email}`
          });
          
          if (query.length) {
            url += `?${query}`;
          }

          const canOpen = await Linking.canOpenURL(url);

          if (!canOpen) {
            showToastError(translateText(intl, 'profile.delete_email_error'));
          } else {
            Linking.openURL(url);
          }
        },
      }],
      {cancelable: true}
    );
  };
  const updatePassword = async (newPassword: string) => {
    showLoading('update_password');

    try {
      const userRepository = new UserRepository({authData: authData!});
      await userRepository.updatePassword({newPassword});
      
      dispatch(userUpdateProfileAction({user}));
      setModalVisible(false);
      setNewPassword(null);

    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('update_password');
  };

  const handleChangePassword = () => {
    console.log("Inside handle Psws", newPassword);
    if(newPassword){
      updatePassword(newPassword)
    }else{
      Alert.alert("Error", "Password can not be empty")
    }
    
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <LeftIcon width={18} height={18} />
        <Text style={styles.backBtnTxt}>Настройки</Text>
      </TouchableOpacity>
      <View style={styles.settingMain}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>лични данни</Text>
          <View style={{marginTop: 20}}>
            {userData.map((val, i) => {
              return (
                <View key={i} style={styles.profileNameSec}>
                  <Text style={styles.profileName}>{val.value}</Text>
                  <EditIcon />
                </View>
              );
            })}
            {/* Change Password */}
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.profileName}>Промени парола</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            {/* Delete Account */}
            <TouchableOpacity style={styles.profileNameSec} onPress={handleAccountDeletion} >
              <Text style={styles.profileName}>Изтрий профила си</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
          </View>
            {/* Apllication Setting */}
          <Text style={[styles.heading, {marginTop: 25}]}>
            настройки на апликацията
          </Text>
          <View style={{marginTop: 10}}>
            {/* Notifications */}
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>Нотификации</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            {/* Recieves Email Notifications */}
            <TouchableOpacity style={styles.profileNameSec}>
              <Text style={styles.profileName}>
                Получаване на имейл известия
              </Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
          </View>

        {/* Information */}
          <Text style={[styles.heading, {marginTop: 25}]}>Информация</Text>
          <View style={{marginTop: 10}}>
            {/* FAQ */}
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => navigation.navigate('FAQ')}>
              <Text style={styles.profileName}>Често задавани въпроси</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileNameSec}
              onPress={() => navigation.navigate('GeneralTerms')}>
              <Text style={styles.profileName}>Общи условия</Text>
              <RightIcon width={10} height={10} />
            </TouchableOpacity>
            {/* Register your business */}
            <TouchableOpacity style={styles.profileNameSec} onPress={()=>{
                          const link = REGISTER_BUSINESS_FACTOR[userLocale];
                          Linking.openURL(link);              
            }} >
              <Text style={styles.profileName}>Регистрирай бизнеса си</Text>
              <ShareIcon />
            </TouchableOpacity>
            {/* Contact Us */}
            <TouchableOpacity style={styles.profileNameSec} onPress={()=>{
                                        const link = CONTACT_US_FACTORY[userLocale];
                                        Linking.openURL(link);                            
            }} >
              <Text style={styles.profileName}>Свържи се с нас</Text>
              <ShareIcon />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Смяна на парола</Text>
            {/* <View style={styles.modalInputView}>
              <Text style={styles.inputLabel}>текуща парола</Text>
              <TextInput
                placeholder=""
                style={styles.modalInput}
                placeholderTextColor="#182550"
                secureTextEntry={true}
              />
            </View> */}
            <View style={styles.modalInputView}>
              <Text style={styles.inputLabel}>нова парола</Text>
              <TextInput
                placeholder=""
                style={styles.modalInput}
                placeholderTextColor="#182550"
                secureTextEntry={true}
                onChange={(input) => setNewPassword(input.nativeEvent.text)}
              />
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text style={styles.cancelBtnTxt}>Отмени</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}>
                <Text style={styles.buttonTxt}>Запази</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
  },
  settingMain: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flex: 1,
    paddingTop: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  backBtnTxt: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
  heading: {
    fontSize: 12,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  profileNameSec: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
    borderRadius: 8,
    marginTop: 6,
    paddingHorizontal: 10,
  },
  profileName: {
    color: '#182550',
    fontSize: 12,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },

  modalHeading: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  emailSendTxt: {
    textAlign: 'center',
    color: '#000000',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    height: 30,
    borderColor: '#CCCCCC',
  },
  modalInputView: {
    marginTop: 15,
    width: '90%',
    alignSelf: 'center',
  },
  inputLabel: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
  },
  cancelBtnTxt: {
    color: '#CF4F4F',
    fontSize: 16,
  },
});

export default Setting;
