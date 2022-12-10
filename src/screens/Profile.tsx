import React, {useState} from 'react';
import {
  Alert,
  Image,
  Keyboard, Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Utils} from '../utils';

import {showToastError} from '../common/FBToast';
import {UserRepository} from '../repositories/UserRepository';
import {useDispatch, useSelector} from 'react-redux';
import {userUpdateProfileAction} from '../redux/user/actions';
import {FBRootState} from '../redux/store';
import {FBUser, FBUserEditableFields} from '../models/User';
import {useAuth} from '../providers/AuthProvider';
import BackButton from '../components/common/BackButton';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {useForm} from 'react-hook-form';
import FBFormInput from '../components/common/FBFormInput';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import {useFbLoading} from '../providers/FBLoaderProvider';
import {COLORS} from '../constants';
import FBButton from '../components/common/button';
import QueryString from 'query-string';

interface ModalProps {
  toShow: boolean;
  inputValue: string;
  inputPlaceholder: string;
  key: FBUserEditableFields;
  keyName: string;
  onSubmit: (updatedValue: string) => Promise<void>;
}

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const {authData} = useAuth();
  const intl = useIntl();
  const {showLoading, hideLoading} = useFbLoading();

  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;

  const [modalProps, setModalProps] = useState<ModalProps>({
    toShow: false, inputPlaceholder: '', inputValue: '', onSubmit: async () => {
    }, key: 'firstName', keyName: 'fake',
  });

  const dispatch = useDispatch();

  const updatePassword = async (newPassword: string) => {
    showLoading('update_password');

    try {
      const userRepository = new UserRepository({authData: authData!});
      await userRepository.updatePassword({newPassword});
      
      dispatch(userUpdateProfileAction({user}));
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

  const updateUser = async (userProperty: FBUserEditableFields, userPropertyValue: string) => {
    if (userProperty === 'password') {
      return updatePassword(userPropertyValue);
    }

    user[userProperty] = userPropertyValue;

    showLoading('update_user');

    try {
      const userRepository = new UserRepository({authData: authData!});
      await userRepository.updateUser(user);
      
      dispatch(userUpdateProfileAction({user}));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('update_user');
  };

  const renderProfileSetting = (props: {
    label: string;
    text: string;
    placeholder: string;
    isEditable: boolean;
    propertyKey: FBUserEditableFields;
  }) => {
    const {
      label, text, placeholder, isEditable, propertyKey,
    } = props;

    const openModal = () => {
      setModalProps({
        toShow: true,
        inputValue: text,
        inputPlaceholder: placeholder,
        key: propertyKey,
        keyName: label,
        onSubmit: async (updatedValue: string) => {
          await updateUser(propertyKey, updatedValue);
        },
      });
    };

    return (
      <TouchableOpacity
        onPress={isEditable ? openModal : () => {
        }}
        style={styles.settingWrapper}>
        <Text style={styles.settingLabelText}>
          {label}
        </Text>

        <View style={styles.settingValueWrapper}>
          <Text style={styles.settingValueText}>
            {text}
          </Text>
          {isEditable &&
            <Image
              source={require('../../assets/icons/app_arrow_forward.png')}
              style={styles.settingEditIcon}
              resizeMode={'contain'}
            />
          }
        </View>
      </TouchableOpacity>
    );
  };

  const renderModal = () => {
    const closeModal = () => setModalProps({...modalProps, toShow: false});

    const {control, handleSubmit} = useForm({
      defaultValues: {
        [modalProps.key]: modalProps.inputValue,
      },
    });

    const doOnSubmit = (data: any) => {
      closeModal();
      modalProps.onSubmit(data[modalProps.key]);
    };

    return (
      <Modal
        visible={modalProps.toShow}
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.modalMainWrapper}>
            <View style={styles.modalInnerWrapper}>
              <TouchableOpacity onPress={closeModal}>
                <Image
                  source={require('../../assets/images/app_close_icon.png')}
                  style={styles.modalCloseIcon}
                />
              </TouchableOpacity>
              <View style={styles.modalContentWrapper}>

                <Text>
                  {`${translateText(intl, 'profile.update_hint')} ${modalProps.keyName}`}
                </Text>


                <FBFormInput
                  control={control}
                  name={modalProps.key}
                  placeholder={modalProps.inputPlaceholder}
                  secureTextEntry={modalProps.key === 'password'}
                  theme={'dark'}
                />

                <TouchableOpacity
                  style={styles.modalApplyButtonWrapper}
                  onPress={handleSubmit(doOnSubmit)}
                >
                  <View>
                    <Text style={{color: '#fff', fontSize: 12}}>
                      {translateText(intl, 'profile.apply')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
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

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <BackButton/>
      <View style={styles.avatarWrapper}>
        {/*<Avatar*/}
        {/*  rounded*/}
        {/*  size="large"*/}
        {/*  title={avatar}*/}
        {/*  titleStyle={{color: '#000'}}*/}
        {/*  activeOpacity={0.7}*/}
        {/*  overlayContainerStyle={{backgroundColor: '#fff'}}*/}
        {/*/>*/}
        <Text style={styles.avatarText}>
          {firstName} {lastName}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        {renderProfileSetting({
          isEditable: true,
          label: translateText(intl, 'profile.first_name'),
          text: `${user.firstName}`,
          placeholder: translateText(intl, 'profile.first_name_hint'),
          propertyKey: 'firstName',
        })}
        {renderProfileSetting({
          isEditable: true,
          label: translateText(intl, 'profile.last_name'),
          text: `${user.lastName}`,
          placeholder: translateText(intl, 'profile.last_name_hint'),
          propertyKey: 'lastName',
        })}
        {renderProfileSetting({
          isEditable: false,
          label: translateText(intl, 'profile.email'),
          text: `${user.email}`,
          placeholder: translateText(intl, 'profile.email_hint'),
          propertyKey: 'email',
        })}
        {renderProfileSetting({
          isEditable: true,
          label: translateText(intl, 'profile.phone'),
          text: `${user.phoneNumber}`,
          placeholder: translateText(intl, 'profile.phone_hint'),
          propertyKey: 'phoneNumber',
        })}
        {renderProfileSetting({
          isEditable: true,
          label: translateText(intl, 'profile.password'),
          text: `**********`,
          placeholder: translateText(intl, 'profile.new_password_hint'),
          propertyKey: 'password',
        })}
        
        <FBButton onClick={() => handleAccountDeletion()} title={translateText(intl, 'profile.delete_account_btn')} backgroundColor={COLORS.red}></FBButton>
        
      </View>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {flex: 1},
  avatarWrapper: {
    backgroundColor: '#2A4764',
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
  },
  avatarText: {marginTop: 10, fontSize: 20, color: '#fff'},
  contentWrapper: {flex: 1, margin: 30},
  settingWrapper: {
    borderBottomWidth: 0.2,
    paddingBottom: 20,
    borderColor: 'grey',
  },
  settingLabelText: {color: 'grey', fontWeight: '500'},
  settingValueWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  settingValueText: {color: '#29455f', fontWeight: '700', fontSize: 16},
  settingEditIcon: {width: 20, height: 20},
  modalMainWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerWrapper: {
    backgroundColor: '#fff',
    width: Utils.width - 100,
    borderRadius: 30,
  },
  modalCloseIcon: {width: 15, height: 15, marginLeft: 20, marginTop: 30},
  modalContentWrapper: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  modalApplyButtonWrapper: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    width: Utils.width / 2,
  },
  textAswer: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 5,
    height: Utils.android ? 40 : undefined,
    color: '#000',
  },

  buttonNewpassword: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    paddingVertical: 12,
    width: Utils.width / 2,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    width: Utils.width / 2,
    borderColor: '#9B9B9B',
  },
  userInput: {
    borderRadius: 20,
    borderColor: '#9B9B9B',
    borderWidth: 1,
    padding: 12,
    width: Utils.width / 2,
    fontSize: 12,
  },
  image: {
    width: 12,
    height: 12,
    tintColor: 'grey',
    marginRight: 10,
  },
});

export default Profile;
