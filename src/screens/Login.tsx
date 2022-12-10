import React, {useState,useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import AppleIcon from './../../assets/images/apple.svg';
import FacebookIcon from './../../assets/images/facebook.svg';
import GoogleIcon from './../../assets/images/google.svg';
import CloseIcon from './../../assets/images/close.svg';
import MailIcon from './../../assets/images/mail.svg';
import {images} from '../constants';
import Login from './Authorization/Login';
import { NotAuthenticatedUserRepository } from '../repositories/UserRepository';
import { useSelector } from 'react-redux';
import { FBRootState } from '../redux/store';
import { useAuth } from '../providers/AuthProvider';
import { isFBAppError, isFBBackendError, isFBGenericError } from '../network/axiosClient';
import { translateText } from '../lang/translate';
import { showToast, showToastError } from '../common/FBToast';
import { useIntl } from 'react-intl';
import { useFbLoading } from '../providers/FBLoaderProvider';
import { analyticsSocialLogin } from '../analytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FLagIcon from './../../assets/flags/ro.svg';
import SFlagIcon from './../../assets/flags/bg.svg';
import TFlagIcon from './../../assets/flags/us.svg';
interface LoginProps {
  route: any;
  navigation: any;
}

console.log('Login', Login);

const LoginScreen = ({route, navigation}: LoginProps) => {
  // const {value} = route.params;

  // console.log("my route",route.params)
  const {signIn} = useAuth();
  const intl = useIntl();
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@Language');
        if (value !== null) {
          //  setShowLanguageScreen(false)
          setLanguage(value);
          setLanguageLoading(false);
        }
      } catch (e) {
        console.log('error occure', e);
      }
    };
    if (route.params == undefined) {
      getData();
    }
  }, []);
  const [languageLoading, setLanguageLoading] = useState(true);
  const [language, setLanguage] = useState(
    route.params != undefined ? route.params : '',
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const userLocale = useSelector(
    (state: FBRootState) => state.userState.locale,
  );
  const [email, setEmail] = useState('accounts@sftdx.com');
  const [password, setPassword] = useState('Qwerty12!');
  const [forgotPwdEmail, setForgotPwdEmail] = useState(null);
  const {showLoading, hideLoading} = useFbLoading();

  const handleLogin = async () => {
    console.log('Inside', email, password);

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      const res = await userRepo.login({
        email: email,
        password: password,
        locale: userLocale,
      });
      console.log('res', res);
      await signIn(res);
      navigation.navigate('Objects');
    } catch (error: any) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }
  };

  const handleForgotPassword = async () => {
    console.log(forgotPwdEmail);
    if (!forgotPwdEmail) {
      return;
    }

    showLoading('login');

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      await userRepo.resetPassword({email: forgotPwdEmail, locale: userLocale});
      console.log('success', userRepo);

      showToast(translateText(intl, 'resetpassword.success'));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('login');
  };
  const handleGuestLogin = async () => {
    console.log('inside guest login');
  };
  const googleLogin = async () => {
    showLoading('login');
    analyticsSocialLogin({type: 'google', step: 'initiated'});
    try {
      const result = await GoogleSignin.signIn();
      let tt = await GoogleSignin.getTokens();

      const isAuthorized = !!tt.accessToken;
      analyticsSocialLogin({
        type: 'google',
        step: 'external_completed',
        data: {isAuthorized, isCancelled: false},
      });

      if (tt.accessToken) {
        let email = result.user.email;
        let googleToken = tt.accessToken;
        let lastName = result.user.familyName;
        let firstName = result.user.givenName;

        const userRepo = new NotAuthenticatedUserRepository();
        const res = await userRepo.loginSocial({
          email,
          googleToken,
          lastName,
          firstName,
          locale: userLocale,
        });
        await signIn(res);
        navigation.navigate('Objects');
      } else {
        showToastError(translateText(intl, 'login.social_refused'));
        analyticsSocialLogin({type: 'google', step: 'refused'});
      }
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        analyticsSocialLogin({type: 'google', step: 'failed'});
        showToastError(
          translateText(intl, 'backenderror.user_login_social_error'),
        );
      }
    }
    hideLoading('login');
  };
  const onFacebookLogin = async () => {
    showLoading('login');
    analyticsSocialLogin({type: 'fb', step: 'initiated'});
    try {
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('native_with_fallback');
      }

      LoginManager.logOut();
      const loginResult = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);

      if (loginResult.isCancelled) {
        analyticsSocialLogin({
          type: 'fb',
          step: 'completed',
          data: {isAuthorized: false, isCancelled: true},
        });
        showToastError(translateText(intl, 'login.social_refused'));
      } else {
        const fbAccessToken = await AccessToken.getCurrentAccessToken();
        const isAuthorized = !!fbAccessToken;
        analyticsSocialLogin({
          type: 'fb',
          step: 'external_completed',
          data: {isAuthorized, isCancelled: false},
        });

        if (fbAccessToken) {
          const response = await fetch(
            `https://graph.facebook.com/${fbAccessToken.userID}?fields=id,first_name,last_name,email,name&access_token=` +
              fbAccessToken.accessToken,
          );
          const accountInfo: {
            first_name: string;
            last_name: string;
            name: string;
            email: string;
          } = await response.json();
          let email = accountInfo.email;
          let firstName = accountInfo.first_name;
          let lastName = accountInfo.last_name;
          let fbToken = fbAccessToken.accessToken;

          const userRepo = new NotAuthenticatedUserRepository();
          const res = await userRepo.loginSocial({
            email,
            firstName,
            lastName,
            fbToken,
            locale: userLocale,
          });
          await signIn(res);
        } else {
          showToastError(translateText(intl, 'login.social_refused'));
          analyticsSocialLogin({type: 'fb', step: 'refused'});
        }
      }
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        analyticsSocialLogin({type: 'fb', step: 'failed'});
        showToastError(
          translateText(intl, 'backenderror.user_login_social_error'),
        );
      }
    }

    hideLoading('login');
  };

  const onAppleLogin = async () => {
    showLoading('login');

    analyticsSocialLogin({type: 'apple', step: 'initiated'});
    try {
      // performs login request

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      const isAuthorized = credentialState === appleAuth.State.AUTHORIZED;
      analyticsSocialLogin({
        type: 'apple',
        step: 'external_completed',
        data: {isAuthorized: isAuthorized, isCancelled: false},
      });

      if (isAuthorized) {
        const appleUid = appleAuthRequestResponse.user;
        const appleAuthCode = appleAuthRequestResponse.authorizationCode!;
        const lastName = appleAuthRequestResponse.fullName?.givenName;
        const firstName = appleAuthRequestResponse.fullName?.familyName;
        const name = firstName + ' ' + lastName;

        const userRepo = new NotAuthenticatedUserRepository();
        const res = await userRepo.loginApple({
          appleUid,
          appleAuthCode,
          name,
          locale: userLocale,
        });
        await signIn(res);
      } else {
        showToastError(translateText(intl, 'login.social_refused'));
        analyticsSocialLogin({type: 'apple', step: 'refused'});
      }

    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        analyticsSocialLogin({type: 'apple', step: 'failed'});
        showToastError(
          translateText(intl, 'backenderror.user_login_social_error'),
        );
      }

    }
    hideLoading('login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.app_logo} style={styles.logo} />
      {!languageLoading && (
        <TouchableOpacity
          style={styles.languageBtn}
          onPress={() => navigation.navigate('SelectLanguageScreen')}>
          <Text style={styles.languageBtnTxt}>{language}</Text>
          <>
            {language === 'English' ? (
              <TFlagIcon />
            ) : language === 'Română' ? (
              <SFlagIcon />
            ) : (
              <FLagIcon />
            )}
          </>
        </TouchableOpacity>
      )}
      <View style={styles.loginMain}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: 40}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Имейл</Text>
            <TextInput
              placeholder="alexandra.j@gmail.com"
              style={styles.input}
              placeholderTextColor="#182550"
              onChange={email => setEmail(email.nativeEvent.text)}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Парола</Text>
            <TextInput
              placeholder="*************"
              style={styles.input}
              placeholderTextColor="#182550"
              secureTextEntry={true}
              onChange={password => setPassword(password.nativeEvent.text)}
            />
          </View>
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.forgotBtnTxt}>Забравена парола?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              // doLogin({name:'', password:''});
              // navigation.navigate('Objects');
              handleLogin();
            }}>
            <Text style={styles.loginBtnTxt}>Login</Text>
          </TouchableOpacity>
          <View style={styles.registerSec}>
            <Text style={styles.registerSecTxt}>Нямаш акаунт?</Text>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.registerBtnTxt}>Регистрирай се</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.continueTxt}>или продължи с</Text>
          <TouchableOpacity
            onPress={onFacebookLogin}
            style={[styles.facebookBtn, {backgroundColor: '#2C4698'}]}>
            <FacebookIcon />
            <Text style={styles.fbTxt}>Вход с Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={googleLogin}
            style={[styles.facebookBtn, {backgroundColor: '#882525'}]}>
            <GoogleIcon />
            <Text style={styles.fbTxt}>Вход с Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAppleLogin}
            style={[styles.facebookBtn, {backgroundColor: '#000000'}]}>
            <AppleIcon />
            <Text style={styles.fbTxt}>Вход с Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn} onPress={handleGuestLogin}>
            <Text style={styles.registerTxt}>Продължи без регистрация</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL */}

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
            <Text style={styles.modalHeading}>Забравена парола</Text>
            <Text style={styles.emailSendTxt}>
              Ще изпратим линк за промяна на паролата на посочения от теб имейл.
            </Text>
            <View style={styles.modalInputView}>
              <Text style={styles.inputLabel}>имейл</Text>
              <TextInput
                placeholder=""
                style={styles.modalInput}
                placeholderTextColor="#182550"
                onChange={email => setForgotPwdEmail(email.nativeEvent.text)}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleForgotPassword();
                setModalVisible(false);
                setSecondModalVisible(true);
              }}>
              <Text style={styles.buttonTxt}>Нова парола</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => {
          setSecondModalVisible(!secondModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSecondModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Нова парола</Text>
            <View style={{marginTop: 30, marginBottom: 10}}>
              <MailIcon />
            </View>
            <Text style={styles.emailSendTxt}>
              Изпратихме ти съобщение с линк за промяна на паролата.
            </Text>
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
  logo: {
    width: 146,
    height: 52,
    marginTop: 40,
    alignSelf: 'center',
  },
  languageBtn: {
    borderWidth: 1,
    width: 116,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#FFFFFF80',
    padding: 5,
    borderRadius: 4,
    marginTop: 30,
    alignSelf: 'center',
  },

  languageBtnTxt: {
    color: '#fff',
  },
  loginMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
    // paddingHorizontal: '5%',
  },
  inputView: {
    marginTop: 30,
  },
  inputLabel: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginTop: 5,
    borderColor: '#CCCCCC',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  forgotBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loginBtn: {
    height: 48,
    backgroundColor: '#79C54A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 25,
  },
  loginBtnTxt: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  registerSec: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  registerSecTxt: {
    color: '#182550',
    fontSize: 16,
  },
  registerBtn: {
    marginLeft: 5,
  },
  registerBtnTxt: {
    color: '#79C54A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueTxt: {
    textAlign: 'center',
    marginTop: 30,
    color: '#182550',
  },
  facebookBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 15,
  },
  fbTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomBtn: {
    alignSelf: 'center',
    marginTop: 10,
  },
  registerTxt: {
    color: '#CF4F4F',
    fontSize: 16,
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
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default LoginScreen;
