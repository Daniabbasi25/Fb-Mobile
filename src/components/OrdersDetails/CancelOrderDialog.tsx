import React from 'react';
import {Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Utils} from '../../utils';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {COLORS} from '../../constants';

interface CancelOrderDialogProps {
  isShown: boolean,
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>,
  onConfirm: () => void
}

const CancelOrderDialog = (props: CancelOrderDialogProps) => {
  const {
    isShown,
    setIsShown,
    onConfirm,
  } = props;

  const styles = styleCreator();
  const intl = useIntl();

  return (
    <Modal
      visible={isShown}
      transparent={true}
      onRequestClose={() => setIsShown(false)}>
      <SafeAreaView style={styles.mainWrapper}>
        <View style={{
          backgroundColor: '#fff',
          width: Utils.width - 100,
          borderRadius: 30,
        }}>
          <TouchableOpacity onPress={() => setIsShown(false)}>
            <Image
              source={require('../../../assets/images/app_close_icon.png')}
              style={styles.closeIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View style={styles.contentWrapper}>
            <View style={styles.contentTextWrapper}>
              <Text style={styles.contentText}>
                {translateText(intl, 'order.cancel_alert')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cancelButtonWrapper}
              onPress={() => {
                setIsShown(false);
                onConfirm();
              }}>
              <View>
                <Text style={styles.cancelButtonText}>
                  {translateText(intl, 'order.cancel_offer')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CancelOrderDialog;

const styleCreator = () => StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeIcon: {width: 15, height: 15, marginLeft: 20, marginTop: 30},
  contentWrapper: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  contentTextWrapper: {marginTop: 25},
  contentText: {fontSize: 16, color: 'grey', fontWeight: '500'},
  cancelButtonWrapper: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 30,
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  cancelButtonText: {color: '#fff', fontWeight: '700'},
});
