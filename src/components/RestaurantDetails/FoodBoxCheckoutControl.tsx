import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, icons} from '../../constants';
import VoucherInput from './VoucherInput';
import ConfirmOrderDialog from './ConfirmOrderDialog';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {useNavigation} from '@react-navigation/core';
import {FBBox} from '../../models/FBBox';
import {FBUserVoucher} from '../../models/FBUserVoucher';
import {analyticsBasketUpdated, analyticsCheckoutStepChange} from '../../analytics';
import {useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
import {FBUser} from '../../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {formatPrice} from '../../utils/formatPrice';
import {RestaurantService} from '../../services/RestaurantService';

export interface FoodBoxCheckoutControlProps {
  restaurant: RestaurantHomeListItem,
  foodbox: FBBox,
  isOnFocus: boolean
}

const FoodBoxCheckoutControl = (params: FoodBoxCheckoutControlProps) => {
  // TODO: reduce availableBoxes when user adds to checkout

  const {
    restaurant,
    foodbox,
    isOnFocus,
  } = params;

  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const styles = stylesCreator({});
  const navigation = useNavigation();
  const intl = useIntl();
  
  const isFinished = RestaurantService.isFinished(foodbox);
  const availableBoxes = foodbox.quantity;
  const originalPrice = foodbox.discountedPrice;

  // everything is disabled if the PickUpWindow has ended
  const [priceAfterPromo, setPriceAfterPromo] = useState<null | number>(null);
  const [numberOfBoxesToCheckout, setNumberOfBoxesToCheckout] = useState(0);
  const [isDiscounted, setIsDiscounted] = useState(priceAfterPromo !== null);
  const [canAddToCheckout, setCanAddToCheckout] = useState(numberOfBoxesToCheckout < availableBoxes);
  const [canRemoveFromCheckout, setCanRemoveFromCheckout] = useState(numberOfBoxesToCheckout > 0);
  // only if user has added 1+ boxes in the basket
  const [canCheckout, setCanCheckout] = useState(false);
  const [toShowConfirmDialog, setToShowConfirmDialog] = useState(false);
  const [userVoucher, setUserVoucher] = useState<FBUserVoucher | null>(null);

  const getPrice = () => {
    return isDiscounted && priceAfterPromo ? formatPrice(priceAfterPromo) : formatPrice(originalPrice);
  };

  useEffect(() => {
    if (isOnFocus) {
      setNumberOfBoxesToCheckout(0);
      setPriceAfterPromo(null);
      setCanAddToCheckout(numberOfBoxesToCheckout < availableBoxes);
      setCanRemoveFromCheckout(numberOfBoxesToCheckout > 0);
      setCanCheckout(false);
      setToShowConfirmDialog(false);
      setUserVoucher(null);
    }
  }, [isOnFocus]);

  const onConfirmCheckout = () => {
    analyticsCheckoutStepChange({
      userId: user.id,
      email: user.email,
      productId: foodbox.id,
      quantity: numberOfBoxesToCheckout,
      voucher: userVoucher,
      step: 'confirmed',
      loc: userLocation,
    });
    
    navigation.navigate('PaymentMethod', {
      restaurant,
      product: foodbox,
      count: numberOfBoxesToCheckout,
      userVoucher: userVoucher,
    });
  };

  useEffect(() => {
    setCanAddToCheckout(numberOfBoxesToCheckout < availableBoxes && !isFinished);
    setCanRemoveFromCheckout(numberOfBoxesToCheckout > 0 && !isFinished);
    setCanCheckout(!isFinished && numberOfBoxesToCheckout > 0);
  }, [numberOfBoxesToCheckout]);

  useEffect(() => {
    setIsDiscounted(priceAfterPromo != null);
  }, [priceAfterPromo]);

  if (isFinished || availableBoxes === 0) {

    let msg = translateText(intl, 'offer.message_end');
    
    if (availableBoxes === 0) {
      msg = translateText(intl, 'offer.increase_error');
    }

    return (
      <View style={styles.mainWrapper}>
        <View style={styles.isDisabledTextWrapper}>
          <Text style={styles.isDisabledText}>
            {msg}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.numberOfBoxesInCheckoutControlWrapper}>
        <TouchableOpacity
          disabled={!canRemoveFromCheckout}
          onPress={() => {
            const newNumberOfBoxesToCheckout = numberOfBoxesToCheckout - 1;
            setNumberOfBoxesToCheckout(newNumberOfBoxesToCheckout);
            analyticsBasketUpdated({
              userId: user.id,
              email: user.email,
              productId: foodbox.id,
              quantity: newNumberOfBoxesToCheckout,
              voucher: userVoucher,
              value: foodbox.discountedPrice * newNumberOfBoxesToCheckout,
              loc: userLocation,
            });
          }}
        >
          <Image
            source={!canRemoveFromCheckout ? icons.minus : icons.minus_active}
            style={styles.controlIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.priceWrapper}>
          <Text style={styles.priceText}>
            {numberOfBoxesToCheckout}{' x '}{getPrice()}
          </Text>
          {isDiscounted &&
            <Text style={styles.oldPriceText}>
              {` (${formatPrice(originalPrice)}) `}
            </Text>
          }
          <Text>{translateText(intl, `currency.${foodbox.currency}`)}</Text>
        </View>
        <TouchableOpacity
          disabled={!canAddToCheckout}
          onPress={() => {
            const newNumberOfBoxesToCheckout = numberOfBoxesToCheckout + 1;
            setNumberOfBoxesToCheckout(newNumberOfBoxesToCheckout);
            analyticsBasketUpdated({
              userId: user.id,
              email: user.email,
              productId: foodbox.id,
              quantity: newNumberOfBoxesToCheckout,
              voucher: userVoucher,
              value: foodbox.discountedPrice * newNumberOfBoxesToCheckout,
              loc: userLocation,
            });
          }}
        >
          <Image
            source={!canAddToCheckout ? icons.plus : icons.plus_active}
            style={styles.controlIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <VoucherInput
        numberOfBoxesInBasket={numberOfBoxesToCheckout}
        foodBoxId={foodbox.id}
        isOnFocus={isOnFocus}
        onAddVoucher={async (promoCode, discountedPricePerBox) => {
          setUserVoucher(promoCode);
          setPriceAfterPromo(discountedPricePerBox);
          setCanAddToCheckout(false);
          setCanRemoveFromCheckout(false);
          analyticsBasketUpdated({
            userId: user.id,
            email: user.email,
            productId: foodbox.id,
            quantity: numberOfBoxesToCheckout,
            voucher: promoCode,
            value: discountedPricePerBox * numberOfBoxesToCheckout,
            loc: userLocation,
          });
        }}
      />

      <TouchableOpacity
        disabled={!canCheckout}
        style={{
          ...styles.initiateOrderButtonWrapper,
          backgroundColor: canCheckout ? COLORS.primary : COLORS.darkgray,
        }}
        onPress={() => {
          if (canCheckout) {
            setToShowConfirmDialog(true);
            analyticsCheckoutStepChange({
              userId: user.id,
              email: user.email,
              productId: foodbox.id,
              quantity: numberOfBoxesToCheckout,
              voucher: userVoucher,
              step: 'initiated',
              loc: userLocation,
            });
          }
        }}
      >
        <Text style={styles.initiateOrderButtonText}>
          {translateText(intl, 'offer.order')}
        </Text>
      </TouchableOpacity>

      <ConfirmOrderDialog
        isShown={toShowConfirmDialog}
        setIsShown={setToShowConfirmDialog}
        onConfirm={onConfirmCheckout}
      />

    </View>
  );
};

export default FoodBoxCheckoutControl;

const stylesCreator = ({}: {}) => StyleSheet.create({
  mainWrapper: {},
  numberOfBoxesInCheckoutControlWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlIcon: {
    height: 35,
    width: 35,
  },
  priceWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  priceText: {fontWeight: 'bold', fontSize: 15},
  oldPriceText: {
    fontWeight: 'bold',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  isDisabledTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  isDisabledText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.red,
  },
  initiateOrderButtonWrapper: {
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  initiateOrderButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
  },
});
