import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, images} from '../../constants';
import {Utils} from '../../utils';
import {showToastError} from '../../common/FBToast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CONTACT_US_FACTORY} from '../../network/Server';
import FBButton from '../../components/common/button';
import {NotAuthenticatedUserRepository} from '../../repositories/UserRepository';
import RegistrationCompletedDialog from '../../components/login/RegistrationCompletedDialog';
import {analyticsPageOpen} from '../../analytics';
import {useForm} from 'react-hook-form';
import FBFormInput from '../../components/common/FBFormInput';
import FBFormCheckbox from '../../components/common/FBFormCheckbox';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../../network/axiosClient';
import {useFbLoading} from '../../providers/FBLoaderProvider';
import {useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
import BackButton from '../../components/common/BackButton';

interface SignUpProps {
  navigation: any;
}

interface SignUpFormData {
  firstName: string;
  email: string;
  password: string;
  repeatPassword: string;
  terms_and_conditions: boolean;
}

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SignUp = ({navigation}: SignUpProps) => {

  const [isRegistrationCompleteDialogVisible, setIsRegistrationCompleteDialogVisible] = useState(false);

  const intl = useIntl();
  const {showLoading, hideLoading} = useFbLoading();
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);

  const {control, handleSubmit, watch} = useForm<SignUpFormData>({
    defaultValues: {
      terms_and_conditions: false,
    },
  });
  const password = watch('password');

  const doSignUp = async (data: SignUpFormData) => {
    showLoading('sign_up');

    try {
      const userRepo = new NotAuthenticatedUserRepository();
      await userRepo.register({
        email: data.email,
        firstName: data.firstName,
        lastName: '',
        password: data.password,
        locale: userLocale,
      });

      setIsRegistrationCompleteDialogVisible(true);
    } catch (error: any) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('sign_up');
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: 0, email: '', pageName: 'Registration'});
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ImageBackground source={images.app_background} style={styles.backgroundImage}>
        <KeyboardAwareScrollView style={{paddingHorizontal: 24, flex: 1}}>

          <View style={{flex: 1}}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                {translateText(intl, 'signup.title')}
              </Text>
            </View>

            <View style={styles.logoWrapper}>
              <Image
                source={images.app_logo}
                style={styles.logoImage}
                resizeMode={'contain'}
              />
            </View>

            <FBFormInput
              name={'firstName'}
              control={control}
              rules={{required: translateText(intl, 'formErrors.required')}}
              placeholder={translateText(intl, 'signup.firstName')}
              secureTextEntry={false}
              image={images.app_user}
            />

            <FBFormInput
              keyboardType={'email-address'}
              name={'email'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                pattern: {
                  value: EMAIL_REGEX,
                  message: translateText(intl, 'formErrors.email'),
                },
              }}
              placeholder={translateText(intl, 'signup.email')}
              secureTextEntry={false}
              image={images.mail}
            />

            <FBFormInput
              name={'password'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                minLength: {
                  value: 8,
                  message: translateText(intl, 'formErrors.password'),
                },
              }}
              placeholder={translateText(intl, 'signup.password')}
              secureTextEntry={true}
              image={images.lock}
            />

            <FBFormInput
              name={'repeatPassword'}
              control={control}
              rules={{
                required: translateText(intl, 'formErrors.required'),
                validate: (value: string) => password === value || translateText(intl, 'signup.error_password'),
              }}
              placeholder={translateText(intl, 'signup.repeat_password')}
              secureTextEntry={true}
              image={images.lock}
            />

            <FBFormCheckbox
              name={'terms_and_conditions'}
              control={control}
              rules={{required: translateText(intl, 'formErrors.required')}}
            />

            <View style={{marginTop: 20}}>
              <FBButton
                onClick={handleSubmit(doSignUp)}
                title={translateText(intl, 'signup.sign_up')}
              />
            </View>

            <TouchableOpacity
              style={{paddingVertical: 10}}
              onPress={() => Linking.openURL(CONTACT_US_FACTORY[userLocale])}
            >
              <Text style={{color: COLORS.white}}>
                <Text>{translateText(intl, 'signup.help')}</Text>
                <Text>{' '}</Text>
                <Text style={{color: COLORS.green}}>
                  info@foodobox.com
                </Text>
              </Text>
            </TouchableOpacity>

            <FBButton
              onClick={() => navigation.navigate('SignInScreen')}
              title={translateText(intl, 'back')}
              backgroundColor={COLORS.red}
            />

          </View>
        </KeyboardAwareScrollView>

        <RegistrationCompletedDialog
          isShown={isRegistrationCompleteDialogVisible}
          setIsShown={setIsRegistrationCompleteDialogVisible}
          onConfirm={() => navigation.navigate('SignInScreen')}
        />

      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Utils.height,
    backgroundColor: '#0f2b49',
  },
  backgroundImage: {
    flex: 1,
    height: Utils.height,
    width: Utils.width,
  },
  titleWrapper: {alignItems: 'center', marginTop: 30},
  titleText: {color: '#fff', fontSize: 20},
  logoWrapper: {alignItems: 'center', marginTop: 30},
  logoImage: {
    width: Utils.width / 2,
    height: Utils.ios ? Utils.height / 12 : Utils.height / 11,
  },
  formFieldWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  formFieldIconWrapper: {width: 20, alignItems: 'center'},
  formFieldIcon: {tintColor: '#fff'},
  buttonLogin: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 40,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
  },
  buttonLoginEmail: {
    backgroundColor: '#b13221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  buttonLoginFace: {
    backgroundColor: '#3a5897',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 22,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  formFieldInput: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: '#fff',
    flex: 1,
  },
  tcWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonNewpassword: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 30,
    marginBottom: 30,
    width: Utils.width - 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});
