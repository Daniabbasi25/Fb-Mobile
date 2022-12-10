import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Utils} from '../../utils';
import {FBUserVoucher} from '../../models/FBUserVoucher';
import {UserVoucherRepository} from '../../repositories/UserVoucherRepository';
import {showToastError} from '../../common/FBToast';
import {COLORS} from '../../constants';
import {useAuth} from '../../providers/AuthProvider';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../../network/axiosClient';
import {useFbLoading} from '../../providers/FBLoaderProvider';


export interface VoucherCodeInputProps {
  numberOfBoxesInBasket: number;
  foodBoxId: number;
  onAddVoucher: (voucher: FBUserVoucher, discountedPricePerBox: number) => Promise<void>,
  isOnFocus: boolean
}

const VoucherInput = (props: VoucherCodeInputProps) => {
  // TODO: make border change on error
  // TODO: disable input and button if hasAlreadyAddedPromoCode is true
  // TODO: handle discounted price

  const {
    numberOfBoxesInBasket,
    foodBoxId,
    onAddVoucher,
    isOnFocus,
  } = props;
  
  const intl = useIntl();
  const styles = stylesCreator({});
  const [hasAlreadyAddedVoucher, setHasAlreadyAddedVoucher] = useState(false);
  const [isVoucherValid, setIsVoucherValid] = useState(true);
  const [voucherInvalidMessage, setVoucherInvalidMessage] = useState(translateText(intl, 'offer.invalid_promo_code'));
  const [voucher, setVoucher] = useState<FBUserVoucher | null>();
  const [canAddVoucher, setCanAddVoucher] = useState(numberOfBoxesInBasket > 0 && !hasAlreadyAddedVoucher);
  const {authData} = useAuth();
  const {showLoading, hideLoading} = useFbLoading();
  
  

  const voucherChangeHandler = (v: FBUserVoucher) => {
    v = v.trim();
    setVoucher(v);
    setIsVoucherValid(true);
    setCanAddVoucher(!!v && numberOfBoxesInBasket > 0);
  };

  const addVoucher = async () => {
    if (!canAddVoucher || !voucher) {
      return;
    }

    showLoading('add_voucher');

    const promoCodeRepository = new UserVoucherRepository({authData: authData!});

    try {
      const isPromoCodeValidResult = await promoCodeRepository.apply({
        voucher: voucher,
        numberOfBoxesInBasket: numberOfBoxesInBasket,
        boxId: foodBoxId,
      });

      setIsVoucherValid(isPromoCodeValidResult.isValid);
      
      setHasAlreadyAddedVoucher(true);
      await onAddVoucher(voucher, isPromoCodeValidResult.discountedPrice / numberOfBoxesInBasket);
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        setVoucherInvalidMessage(translateText(intl, error.key));
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        setVoucherInvalidMessage(error.message);
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
        setVoucherInvalidMessage(translateText(intl, 'offer.invalid_promo_code'));
      }

      setIsVoucherValid(false);
      setVoucher('');
      setCanAddVoucher(false);
    }

    hideLoading('add_voucher');
  };

  const getTextInputStyles = () => {
    return {
      ...styles.promoCodeInput,
      borderColor: isVoucherValid ? COLORS.green : COLORS.red,
      backgroundColor: hasAlreadyAddedVoucher ? COLORS.darkgray : COLORS.white,
    };
  };

  useEffect(() => {
    setCanAddVoucher(!!voucher && numberOfBoxesInBasket > 0);
    addVoucher();
  }, [numberOfBoxesInBasket]);

  useEffect(() => {
    if (isOnFocus) {
      setHasAlreadyAddedVoucher(false);
      setIsVoucherValid(true);
      setVoucher(null);
      setCanAddVoucher(numberOfBoxesInBasket > 0 && !hasAlreadyAddedVoucher);
    }
  }, [isOnFocus]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.promoCodeControlsWrapper}>
        <TextInput
          editable={!hasAlreadyAddedVoucher}
          style={[ styles.promoCodeInput, {
            borderColor: isVoucherValid ? COLORS.green : COLORS.red,
            backgroundColor: hasAlreadyAddedVoucher ? COLORS.darkgray : COLORS.white,
          }]}
          placeholder={translateText(intl, 'offer.promo_code_hint')}
          placeholderTextColor={"grey"}
          onChangeText={(text) => voucherChangeHandler(text)}
          value={voucher || undefined}
        />
        <TouchableOpacity
          disabled={!canAddVoucher || hasAlreadyAddedVoucher}
          style={{
            ...styles.addButtonWrapper,
            backgroundColor: !canAddVoucher || hasAlreadyAddedVoucher ? COLORS.darkgray : COLORS.green,
          }}
          onPress={() => addVoucher()}>
          <View>
            <Text style={styles.addButtonText}>
              {translateText(intl, 'offer.add_promo_code')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {numberOfBoxesInBasket === 0 &&
        <View style={styles.userVoucherHintTextWrapper}>
          <Text style={styles.userVoucherHintText}>
            {translateText(intl, 'offer.user_promo_add_hint')}
          </Text>
        </View>
      }

      {!isVoucherValid &&
        <View style={styles.errorTextWrapper}>
          <Text style={styles.errorText}>
            {voucherInvalidMessage}
          </Text>
        </View>
      }

      {hasAlreadyAddedVoucher && (
        <View style={styles.codeSuccessfullyAddedWrapper}>
          <Text style={styles.codeSuccessfullyAddedText}>
            {translateText(intl, 'offer.promo_code_added')}
          </Text>
        </View>
      )}
    </View>
  );
  // TODO: add error
};

export default VoucherInput;

const stylesCreator = ({}: {}) => {

  return StyleSheet.create({
    mainWrapper: {flex: 1},
    promoCodeControlsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    promoCodeInput: {
      borderRadius: 10,
      borderWidth: 1,
      padding: 2,
      width: Utils.width / 2 + 30,
      height: 38,
      fontSize: 12,
    },
    addButtonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 45,
      marginLeft: 20,
      alignSelf: 'center',
      height: 38,
      width: Utils.width / 5,
    },
    addButtonText: {color: '#fff', fontSize: 12},
    errorTextWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    errorText: {fontSize: 14, fontWeight: '500', color: '#cc0000'},
    userVoucherHintTextWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    userVoucherHintText: {fontSize: 14, fontWeight: '500'},
    codeSuccessfullyAddedWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    codeSuccessfullyAddedText: {fontSize: 14, fontWeight: '500'},
  });
};
