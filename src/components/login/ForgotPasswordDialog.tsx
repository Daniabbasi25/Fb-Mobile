import React from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {Utils} from "../../utils";
import FBButton from "../common/button";
import {images} from '../../constants';
import {useForm} from "react-hook-form";
import FBFormInput from "../common/FBFormInput";
import {FormattedMessage, useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

interface ForgotPasswordDialogProps {
  isShown: boolean,
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirm: (email: string) => void
}

interface ForgotPasswordFormData {
  email: string;
}

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const ForgotPasswordDialog = ({isShown, setIsShown, onConfirm}: ForgotPasswordDialogProps) => {
  const styles = styleCreator({});
  const intl = useIntl();

  const closeDialog = () => setIsShown(false);
  const doOnConfirm = (data: ForgotPasswordFormData) => {
    setIsShown(false);
    onConfirm(data.email);
  };

  const {control, handleSubmit} = useForm<ForgotPasswordFormData>();

  return (
    <Modal
      visible={isShown}
      transparent={true}
      onRequestClose={closeDialog}
    >
      <TouchableWithoutFeedback onPress={closeDialog}>
        <SafeAreaView style={styles.mainWrapper}>
            <View style={styles.contentWrapper}>
              
              <TouchableOpacity
                onPress={closeDialog}
                style={styles.closeButton}>
                <Image
                  source={require('../../../assets/images/app_close_icon.png')}
                />
              </TouchableOpacity>

              <View style={styles.inputFormWrapper}>

                <Text>
                  <FormattedMessage id={'login.forgotten_email_hint'}/>
                </Text>

                <FBFormInput
                  keyboardType={'email-address'}
                  control={control}
                  name={'email'}
                  placeholder={translateText(intl,'login.email')}
                  secureTextEntry={false}
                  image={images.mail}
                  theme={'dark'}
                  rules={{
                    required: translateText(intl, 'formErrors.required'),
                    pattern: {
                      value: EMAIL_REGEX,
                      message: translateText(intl, 'formErrors.email'),
                    },
                  }}
                />

                <FBButton
                  onClick={handleSubmit(doOnConfirm)}
                  title={translateText(intl,'login.new_password')}
                />
              </View>
              
            </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ForgotPasswordDialog;

const styleCreator = ({}: {}) => StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    backgroundColor: '#fff',
    width: Utils.width - 50,
    borderRadius: 30,
    overflow: 'hidden'
  },
  closeButton: {
    width: 15,
    height: 15,
    marginLeft: 20,
    marginTop: 10,
  },
  inputFormWrapper: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 20,
    padding: 15
  }
});
