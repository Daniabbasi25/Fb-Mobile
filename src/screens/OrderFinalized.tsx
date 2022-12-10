import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FBBox} from '../models/FBBox';
import {RestaurantService} from '../services/RestaurantService';
import {FBUserVoucher} from '../models/FBUserVoucher';
import {useAuth} from '../providers/AuthProvider';
import {translateText} from '../lang/translate';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {RestaurantRepository} from '../repositories/RestaurantRepository';
import {restaurantResetAction, restaurantsFetchedAction} from '../redux/restaurant/actions';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import {showToastError} from '../common/FBToast';
import {useFbLoading} from '../providers/FBLoaderProvider';

interface OrderFinalizedProps {
  route: any;
  navigation: any;
}

const OrderFinalized = ({route, navigation}: OrderFinalizedProps) => {
  const orderPin = route.params.orderPin;
  const foodBox: FBBox = route.params.foodBox;
  const userVoucher: FBUserVoucher = route.params.userVoucher;
  const {authData} = useAuth();
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const intl = useIntl();
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useFbLoading();
  
  useEffect(() => {
    const fetchRestaurantList = async () => {
      showLoading('fetchRestaurants');

      try {
        const restaurantRepository = new RestaurantRepository({authData: authData!});
        const restaurantService = new RestaurantService({restaurantRepository});
        const restaurantsListItems = await restaurantService.getRestaurantsForHome({userLocation});

        dispatch(restaurantsFetchedAction({restaurants: restaurantsListItems}));
      } catch (error) {
        if (isFBAppError(error) || isFBGenericError(error)) {
          showToastError(translateText(intl, error.key));
        } else if (isFBBackendError(error)) {
          showToastError(error.message);
        } else {
          showToastError(translateText(intl, 'genericerror'));
        }
        dispatch(restaurantResetAction());
      }

      hideLoading('fetchRestaurants');
    };

    fetchRestaurantList();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#10D53A'}}>
        <View style={{marginHorizontal: 20, marginVertical: 20}}>
          <View
            style={{
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>{translateText(intl, 'order.congratulation')}</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>{translateText(intl, 'order.confirm_from_app')}</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.text}>
              {translateText(intl, 'order.confirm_pin')} {orderPin}
            </Text>
          </View>
          <View style={{marginTop: 30, marginHorizontal: 20}}>
            <Text style={styles.text}>
              {`${translateText(intl, 'order.time')} ${translateText(intl, 'offer.from')} ${RestaurantService.formatPickUpWindowDate(foodBox.pickUpFrom)} ${translateText(intl, 'offer.to')} ${RestaurantService.formatPickUpWindowDate(foodBox.pickUpTo)}`}
            </Text>
          </View>

          {!!userVoucher && (
            <View style={{marginTop: 30, marginHorizontal: 20}}>
              <Text style={styles.text}>
                {translateText(intl, 'offer.promo_code')} {userVoucher}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.back}
            onPress={() => {
              navigation.navigate('HomeTabs', {refreshRestaurants: true});
            }}>
            <Text style={{color: '#fff', fontWeight: '500'}}>
              {translateText(intl, 'back')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
  },
  back: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'grey',
    padding: 10,
    marginHorizontal: 20,
    shadowOpacity: 0.1,
  },
});

export default OrderFinalized;
