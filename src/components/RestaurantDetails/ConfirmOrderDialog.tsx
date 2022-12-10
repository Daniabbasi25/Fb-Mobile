import React from 'react';
import {Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Utils} from "../../utils";

import {useNavigation} from "@react-navigation/core";
import {useIntl} from "react-intl";
import {translateText} from "../../lang/translate";
import {COLORS} from '../../constants';

interface ConfirmOrderDialogProps {
  isShown : boolean,
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirm: () => void
}

const ConfirmOrderDialog = ( props: ConfirmOrderDialogProps ) => {
  const {
    isShown, 
    setIsShown, 
    onConfirm
  } = props;
  
  const styles = stylesCreator({});
  const intl = useIntl();
  const closeDialog = () => setIsShown(false);
  
  return (
    <Modal
      visible={isShown}
      transparent={true}
      onRequestClose={closeDialog}
    >
      <SafeAreaView style={styles.mainWrapper}>
        <View style={styles.mainWrapper2}>
          
          <TouchableOpacity onPress={closeDialog}>
            <Image
              source={require('../../../assets/images/app_close_icon.png')}
              style={styles.closeButtonIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          
          <View style={styles.explanationWrapper}>
            <View style={styles.maskotWrapper}>
              <Image
                source={require('../../../assets/images/app_foodoman.png')}
                style={styles.maskotImage}
                resizeMode={'contain'}
              />
            </View>
            
            <View style={styles.explanationTextWrapper}>
              <Text style={styles.explanationText}>
                {translateText(intl,'offer_confirm.text')}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.confirmButtonWrapper}
              onPress={() => {
                closeDialog();
                onConfirm();
              }}>
              <View>
                <Text style={styles.confirmButtonText}>
                  {translateText(intl,'continue')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default ConfirmOrderDialog;

const stylesCreator = ({}:{}) => StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainWrapper2: {
    backgroundColor: '#fff',
    // height: Utils.height,
    width: Utils.width - 100,
    borderRadius: 30,
  },
  closeButtonIcon: {
    width: 15, 
    height: 15, 
    marginLeft: 20, 
    marginTop: 30
  },
  explanationWrapper: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  maskotWrapper: {marginTop: 20},
  maskotImage: {width: 150, height: 200},
  explanationTextWrapper: {marginTop: 25},
  explanationText: {fontSize: 16, color: '#29455f', fontWeight: '500'},
  confirmButtonWrapper: {
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
    //paddingVertical: 12,
  },
  confirmButtonText : {color: '#fff', fontWeight: '700'}
});
