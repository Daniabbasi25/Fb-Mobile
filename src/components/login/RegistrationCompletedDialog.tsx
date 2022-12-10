import React from 'react';
import {Modal, SafeAreaView, Text, View} from "react-native";
import {Utils} from "../../utils";
import FBButton from "../common/button";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";

interface RegistrationCompletedDialogProps {
  isShown : boolean,
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirm: () => void
}

const RegistrationCompletedDialog = (props: RegistrationCompletedDialogProps) => {
  const {
    isShown, setIsShown, onConfirm
  } = props
  const closeDialog = () => setIsShown(false);
  const doOnConfirm = () => {
    setIsShown(false);
    onConfirm();
  }
  
  const intl = useIntl()
  
  return (
    <Modal
      visible={isShown}
      transparent={true}
      onRequestClose={closeDialog}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            width: Utils.width - 100,
            borderRadius: 30,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <View style={{marginTop: 25}}>
              <Text
                style={{fontSize: 16, color: '#29455f', fontWeight: '500'}}>
                {translateText(intl,'signup.email_confirm')}
              </Text>
            </View>
            
            <FBButton 
              onClick={doOnConfirm} 
              title={translateText(intl,'ok')} 
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default RegistrationCompletedDialog;
