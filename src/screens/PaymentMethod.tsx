import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {icons} from '../constants';
import {useSelector} from 'react-redux';
import {showToastError} from '../common/FBToast';
import BackButton from '../components/common/BackButton';
import {RestaurantHomeListItem} from '../models/Restaurant';
import {FBUserVoucher} from '../models/FBUserVoucher';
import {FBBox} from '../models/FBBox';
import FBButton from '../components/common/button';
import {OrderRepository} from '../repositories/OrderRepository';
import {useAuth} from '../providers/AuthProvider';
import {analyticsCheckoutStepChange} from '../analytics';
import {FBRootState} from '../redux/store';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import {useFbLoading} from '../providers/FBLoaderProvider';

export interface PaymentMethodProps {
  route: any;
  navigation: any;
}

const PaymentMethod = ({route, navigation}: PaymentMethodProps) => {
  

  const restaurant: RestaurantHomeListItem = route.params.restaurant;
  const foodBox: FBBox = route.params.product;
  const numberOfBoxesToCheckout: number = route.params.count;
  const userVoucher: FBUserVoucher = route.params.userVoucher;
  const {authData} = useAuth();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const {showLoading, hideLoading} = useFbLoading();
  const intl = useIntl();

  const createOrder = async () => {
    showLoading('create_order');
    try {
      const orderRepository: OrderRepository = new OrderRepository({authData: authData!, user: user});

      analyticsCheckoutStepChange({
        userId: user.id,
        email: user.email,
        productId: foodBox.id,
        quantity: numberOfBoxesToCheckout,
        voucher: userVoucher,
        step: 'paymentConfirm',
        loc: userLocation,
      });

      const createResult = await orderRepository.createOrder({
        restaurantId: restaurant.id,
        numberOfBoxesInBasket: numberOfBoxesToCheckout,
        boxId: foodBox.id,
        userVoucher: userVoucher,
      });

      analyticsCheckoutStepChange({
        userId: user.id,
        email: user.email,
        productId: foodBox.id,
        quantity: numberOfBoxesToCheckout,
        voucher: userVoucher,
        step: 'completed',
        loc: userLocation,
      });

      navigation.navigate('OrderFinalized', {
        orderPin: createResult.pin,
        foodBox: foodBox,
        promoCode: userVoucher,
      });
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
      
      navigation.navigate('OrderError');
    }

    hideLoading('create_order');
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>

      <View style={styles.navigationWrapper}>
        <BackButton/>
        <View style={styles.navigationRestaurantNameWrapper}>

          <Text style={{flex: 1, width: 1, color: '#29455f'}}>
            <Text style={styles.navigationRestaurantNameText}>{foodBox.name}</Text>
            <Text>{` ${translateText(intl, 'order.from')} `}</Text>
            <Text style={styles.navigationRestaurantNameText}>{restaurant.name}</Text>
          </Text>

          {/*<Text style={styles.navigationRestaurantNameText}>*/}
          {/*  {foodBox.name}*/}
          {/*</Text>*/}
        </View>
      </View>

      <View style={styles.paymentMethodOptionsWrapper}>
        <View style={styles.paymentMethodOptionWrapper}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Image
              source={icons.cash}
              resizeMode={'contain'}
              style={styles.paymentMethodOptionIcon}
            />

            <Text style={styles.paymentMethodOptionText}>{translateText(intl, 'payment.cash')}</Text>
          </View>

          <Image
            source={require('../../assets/icons/active-icon.png')}
            style={{width: 30, height: 30}}
            resizeMode={'contain'}
          />
        </View>

        {!!userVoucher &&
          <View
            style={[styles.paymentMethodOptionWrapper, {borderWidth: 1, borderColor: '#000'}]}
          >
            <Text style={styles.paymentMethodOptionText}>
              {translateText(intl, 'payment.promo_code')}
            </Text>
            <Text style={styles.paymentMethodOptionText}>
              {userVoucher}
            </Text>
          </View>
        }

      </View>

      <FBButton
        title={translateText(intl, 'payment.complete_order')}
        onClick={() => createOrder()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    paddingHorizontal: 20,
    flex: 1,
  },
  navigationWrapper: {
    flexDirection: 'row',
    position: 'relative',
  },
  navigationRestaurantNameWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 50,
  },
  navigationRestaurantNameText: {
    // fontSize: 18,
    fontWeight: '700',
    flexWrap: 'wrap',
  },
  paymentMethodOptionsWrapper: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  text: {
    fontWeight: '500',
    color: '#29455f',
    fontSize: 20,
  },
  paymentMethodOptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowOpacity: 0.1,
    marginTop: 10,
  },
  paymentMethodOptionIcon: {height: 25, width: 30, marginRight: 10},
  paymentMethodOptionText: {
    fontWeight: '500',
    color: '#29455f',
    fontSize: 20,
  },
  order: {
    backgroundColor: '#04e444',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    marginRight: 30,
  },
  textCode: {
    fontWeight: '500',
    color: '#29455f',
    fontSize: 20,
    justifyContent: 'flex-end',
  },
});

export default PaymentMethod;
