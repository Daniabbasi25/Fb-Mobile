import React, {ReactNode} from 'react';
import {Modal, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {COLORS} from '../../constants';

type FbModalProps = {
  modalVisible: boolean;
  children: ReactNode;
  confirm: () => void;
  decline?: () => void;
  contentContainerStyles?: StyleProp<ViewStyle>
}

const FbModal = ({modalVisible, children, confirm, contentContainerStyles, decline}: FbModalProps) => {
  const intl = useIntl();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, contentContainerStyles]}>
          {children}
          <View style={styles.buttonContainer}>

            {!!decline &&
              <TouchableOpacity
                style={[styles.buttonDecline, styles.button]}
                onPress={decline}>
                <View>
                  <Text style={{color: '#fff'}}>
                    {translateText(intl, 'decline')}
                  </Text>
                </View>
              </TouchableOpacity>
            }

            <TouchableOpacity
              style={[styles.buttonAccept, styles.button]}
              onPress={confirm}>
              <View>
                <Text style={{color: '#fff'}}>
                  {translateText(intl, 'accept')}
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    maxWidth: '80%',
    maxHeight: '70%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 12,
    height: 50,
    width: '100%',
    maxWidth: 120,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  buttonAccept: {
    backgroundColor: COLORS.green,
  },
  buttonDecline: {
    backgroundColor: '#ff0000',
  },
  buttonConfirm: {
    backgroundColor: '#21f332',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default FbModal;
