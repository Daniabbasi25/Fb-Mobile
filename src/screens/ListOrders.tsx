import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Utils} from '../utils';
import {showToastError} from '../common/FBToast';
import {useDispatch, useSelector} from 'react-redux';
import {API_ENDPOINT_ENV} from '../network/Server';
import {COLORS} from './../constants';
import CancelOrderDialog from '../components/OrdersDetails/CancelOrderDialog';
import {OrderRepository} from '../repositories/OrderRepository';
import {orderCancelledAction, orderConfirmedAction, ordersFetchedAction} from '../redux/order/actions';
import {FBRootState} from '../redux/store';
import {FBOrder} from '../models/FBOrder';
import {useAuth} from '../providers/AuthProvider';
import {analyticsOrderStatusChange, analyticsPageOpen} from '../analytics';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {isNull, orderBy} from 'lodash';
import {formatPrice} from '../utils/formatPrice';
import {RestaurantService} from '../services/RestaurantService';
import {showOnMap} from '../utils/showOnMap';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import {useFbLoading} from '../providers/FBLoaderProvider';
import FbModal from '../components/common/fbModal';
import InAppReview from 'react-native-in-app-review';
import roundToDecimal from '../utils/roundToDecimal';

interface ListOrdersProps {
  navigation: any;
}

interface OrdersListItem extends FBOrder {
  boxSavedAmount: number;
}

const ListOrders = ({navigation}: ListOrdersProps) => {
  const {showLoading, hideLoading} = useFbLoading();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmErrorDialog, setShowConfirmErrorDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdersListItem | null>(null);
  const {authData} = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const orders = useSelector<FBRootState, OrdersListItem[]>((state: FBRootState) => state.ordersState.orders.map((o => {
    
    let boxSavedAmount = roundToDecimal(o.numberOfCheckoutBoxes * o.boxOriginalPrice * o.boxDiscount / 100);
    
    if (o.promoAmount !== null) {
      boxSavedAmount = roundToDecimal(o.boxOriginalPrice - o.promoAmount);
    }
    
    return {
      ...o,
      boxSavedAmount: boxSavedAmount,
    };
  })));

  const intl = useIntl();

  const statusDisplays = {
    0: {
      text: translateText(intl, 'order.status.request'),
      style: {color: '#D55C10', fontWeight: '700'},
    },
    2: {
      text: translateText(intl, 'order.status.cancelled'),
      style: {color: '#f86c6c', fontWeight: '700'},
    },
    1: {
      text: translateText(intl, 'order.status.confirmed'),
      style: {color: '#00FF00', fontWeight: '700'},
    },
  };

  const fetchOrders = async () => {
    showLoading('orders');

    try {
      const orderRepository: OrderRepository = new OrderRepository({authData: authData!, user: user});
      let fetchedOrders = await orderRepository.getAll({});
      fetchedOrders = orderBy(fetchedOrders, ['createdAt'], 'desc');
      dispatch(ordersFetchedAction({orders: fetchedOrders}));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('orders');
  };

  const cancelOrder = async (order: OrdersListItem) => {
    showLoading('orders');

    const orderId = order.id;

    try {
      const orderRepository: OrderRepository = new OrderRepository({authData: authData!, user: user});

      await orderRepository.cancelOrder({orderId});

      dispatch(orderCancelledAction({orderId}));
      analyticsOrderStatusChange({userId: user.id, email: user.email, orderId: orderId, status: 'cancelled', loc: userLocation});
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('orders');
  };

  const goToMap = (order: OrdersListItem) => {
    showOnMap({location: {latitude: order.restaurantLatitude, longitude: order.restaurantLongitude}});
  };

  const confirmOrder = async (order: OrdersListItem) => {
    if (order.boxPickUpFrom > new Date().getTime()) {
      setShowConfirmErrorDialog(true);
      return;
    }
    
    showLoading('orders');

    try {
      const orderRepository: OrderRepository = new OrderRepository({authData: authData!, user: user});

      await orderRepository.confirmOrder({orderId: order.id});

      dispatch(orderConfirmedAction({orderId: order.id}));
      analyticsOrderStatusChange({userId: user.id, email: user.email, orderId: order.id, status: 'confirmed', loc: userLocation});
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }

    hideLoading('orders');

    try {
      // when return true in android it means user finished or close review flow
      // when return true in ios it means review flow lanuched to user.
      await InAppReview.RequestInAppReview();
    } catch (e) {}
    
  };

  const renderItem = (item: ListRenderItemInfo<OrdersListItem>) => {
    const order = item.item;
    const isRequested = order.status === 0;

    // @ts-ignore
    const statusDisplay = statusDisplays[order.status];
    const isExpired = order.boxPickUpTo < new Date().getTime();

    return (
      <View style={styles.listItemWrapper}>
        <View style={styles.items}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', flexGrow: 1}}>
              <Image
                source={{uri: API_ENDPOINT_ENV + 'products/' + order.boxPhoto}}
                style={styles.boxImage}
              />
              <View style={{flexGrow: 1}}>
                <View style={{flexGrow: 1, flexDirection: 'row'}}>
                  <Text style={{flex: 1, width: 1, color: '#29455f'}}>
                    <Text style={styles.boxRestaurantNameText}>{order.boxName}</Text>
                    <Text style={styles.boxRestaurantNameText2}>{` ${translateText(intl, 'order.from')} `}</Text>
                    <Text style={styles.boxRestaurantNameText}>{order.restaurantName}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.boxRestaurantAddressWrapper}
                  onPress={() => goToMap(order)}>
                  <Text style={styles.boxRestaurantAddress}>
                    {order.restaurantAddress}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>

            <View>

              {!isExpired &&
                <Text style={{color: '#29455f', fontWeight: '700'}}>
                  {translateText(intl, 'order.pick_up_window')}
                  {`${translateText(intl, 'offer.from')} `}
                  {`${RestaurantService.formatPickUpWindowDate(order.boxPickUpFrom)}`}
                  {` ${translateText(intl, 'offer.to')} `}
                  {RestaurantService.formatPickUpWindowDate(order.boxPickUpTo)}
                </Text>
              }

              {isExpired &&
                <Text style={{color: '#29455f'}}>
                  {translateText(intl, 'order.pick_up_window')}
                  {` ${translateText(intl, 'order.pick_up_expired')} `}
                </Text>
              }

              <Text style={{color: '#29455f'}}>
                {translateText(intl, 'order.created_at')}{moment(order.createdAt).format('DD/MM/YYYY')}
              </Text>

              <Text style={{marginTop: 5, fontSize: 12, color: '#29455f'}}>
                {translateText(intl, 'order.pin')}{order.pin}
              </Text>

              <Text style={{marginTop: 5, fontSize: 12, color: '#29455f'}}>
                {translateText(intl, 'payment.promo_code')}{order.promoCode}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${order.restaurantPhoneNumber}`);
                }}
              >
                <Text style={{marginTop: 5, fontSize: 12, color: '#29455f'}}>
                  {translateText(intl, 'order.phone')}{order.restaurantPhoneNumber}
                </Text>

              </TouchableOpacity>


            </View>

            <View>
              <Text style={statusDisplay.style}>
                {statusDisplay.text}
              </Text>
              <Text style={{color: '#29455f', fontWeight: '700'}}>
                {`${translateText(intl, 'order.boxes')} ${order.numberOfCheckoutBoxes} ${order.numberOfCheckoutBoxes > 1 ? translateText(intl, 'boxes') : translateText(intl, 'box')}`}
              </Text>
              <Text style={{color: '#29455f', fontWeight: '700'}}>
                {`${translateText(intl, 'order.total')} ${order.promoAmount !== null ? order.promoAmount : order.totalAmount}${translateText(intl, `currency.${order.currency}`)}`}
              </Text>
              {order.boxSavedAmount !== 0 &&
                <Text style={{color: '#29455f', fontWeight: '700'}}>
                  {`${translateText(intl, 'order.saved')} ${formatPrice(order.boxSavedAmount)}${translateText(intl, `currency.${order.currency}`)}`}
                </Text>
              }
            </View>
          </View>
          {isRequested &&
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexGrow: 1,
              marginTop: 20,
              alignItems: 'center',
            }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedOrder(order);
                  setShowCancelDialog(true);
                }}
                style={{
                  ...styles.controlButtonWrapper,
                  backgroundColor: COLORS.red,
                  // width: Utils.width / 3 + 6,
                  // height: Utils.android ? Utils.height / 21 : Utils.height / 22,
                }}>
                <Text style={{color: '#fff', fontSize: Utils.android ? 12 : 14}}>
                  {translateText(intl, 'order.cancel_offer')}
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => confirmOrder(order)}
                style={{
                  ...styles.controlButtonWrapper,
                  backgroundColor: COLORS.primary,
                }}>
                <Text style={{color: '#fff', fontSize: Utils.android ? 12 : 14}}>
                  {translateText(intl, 'order.confirm_order')}
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: user.id, email: user.email, pageName: 'MyOrders', loc: userLocation});
    });
  }, [navigation]);

  if (orders.length) {
    return (
      <SafeAreaView style={styles.mainWrapper}>

        <TouchableOpacity
          style={{
            marginHorizontal: 2,
            marginVertical: 10,
            shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: {height: 1, width: 1}, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            elevation: 2, // Android
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 20,
            backgroundColor: COLORS.secondary,
          }}
          onPress={() => fetchOrders()}
        >
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}
          >
            {translateText(intl, 'home.refresh')}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={orders}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => fetchOrders()}
            />
          }
        />


        <CancelOrderDialog
          isShown={showCancelDialog}
          setIsShown={setShowCancelDialog}
          onConfirm={() => cancelOrder(selectedOrder!)}
        />

        <FbModal
          contentContainerStyles={{alignItems: 'flex-start'}}
          modalVisible={showConfirmErrorDialog}
          confirm={() => setShowConfirmErrorDialog(false)}
        >
          <Text>{translateText(intl, 'order.confirm_error_1')}</Text>
          <Text>{translateText(intl, 'order.confirm_error_2')}</Text>

        </FbModal>

      </SafeAreaView>
    );
  }

  // EMPTY LIST
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => fetchOrders()}
          />
        }
      >
        <View style={styles.emptyListWrapper}>
          <Text style={styles.emptyListTitleText}>
            {translateText(intl, 'order.empty_title')}
          </Text>
          <Text style={styles.emptyListContentText}>
            {translateText(intl, 'order.empty_content')}
          </Text>
          <TouchableOpacity
            style={[styles.empty_button]}
            onPress={() => navigation.navigate('HOME')}>
            <Text style={styles.emptyListButtonText}>
              {translateText(intl, 'order.empty_button')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {flex: 1, marginHorizontal: 10, marginVertical: 10},
  emptyListWrapper: {flex: 1, alignItems: 'center'},
  emptyListTitleText: {
    marginTop: 50,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyListContentText: {
    marginTop: 20,
    marginHorizontal: 70,
    textAlign: 'center',
    color: 'grey',
  },
  emptyListButtonText: {color: '#fff', fontWeight: '700'},
  listItemWrapper: {
    flex: 1,
    shadowOpacity: 0.1,
  },
  boxImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
    marginTop: 8,
  },
  boxRestaurantNameWrapper: {
    flex: 1,
    width: 1,
  },
  boxRestaurantNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29455f',
  },
  boxRestaurantNameText2: {
    fontSize: 12,
    color: '#29455f',
  },
  boxRestaurantAddressWrapper: {marginTop: 2, marginBottom: 10},
  boxRestaurantAddress: {
    fontSize: 12,
    color: 'grey',
    fontWeight: '500',
    width: Utils.width / 2 + 6,
  },
  buttonNewpassword: {
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
  controlsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  controlButtonWrapper: {
    backgroundColor: '#04e444',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // marginRight: 20,
    shadowOpacity: 0.1,
    // flexDirection: 'row',
    alignItems: 'center',
  },
  pin_code: {
    backgroundColor: '#04e444',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    // marginRight: 20,
    shadowOpacity: 0.1,
    // flexDirection: 'row',
    alignItems: 'center',
  },
  cancel: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'grey',
    marginBottom: 20,
    marginHorizontal: 30,
  },
  items: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  empty_button: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#10D53A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'stretch',
  },
});

export default ListOrders;
