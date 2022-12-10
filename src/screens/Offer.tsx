import React, {useEffect} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, icons} from './../constants';
import {Utils} from '../utils';
import {API_ENDPOINT_PRODUCT_PHOTOS} from '../network/Server';
import CountDown from 'react-native-countdown-component';
import {RestaurantHomeListItem} from '../models/Restaurant';
import BackButton from '../components/common/BackButton';
import FoodBoxCheckoutControl from '../components/RestaurantDetails/FoodBoxCheckoutControl';
import {RestaurantService} from '../services/RestaurantService';
import {analyticsPageOpen} from '../analytics';
import {useSelector} from 'react-redux';
import {FBRootState} from '../redux/store';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {showOnMap} from '../utils/showOnMap';
import {useIsFocused} from '@react-navigation/native';
import {FBBox} from '../models/FBBox';

// TODO: make proper ts type
export interface OfferProps {
  route: any,
  navigation: any
}

const Offer = ({route, navigation}: OfferProps) => {
  // TODO: make it react if the pick-up time starts or ends
  const intl = useIntl();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const restaurant: RestaurantHomeListItem = route.params.restaurant;
  const box: FBBox = route.params.box;
  const dietTypeText = RestaurantService.getDietTypeText(box, intl);
  const foodTypeText = RestaurantService.getFoodTypeText(box, intl);

  const now = new Date().getTime();
  const isOpen = RestaurantService.isOpen(box);
  const canCheckout = RestaurantService.canCheckout(box);
  const availableBoxes = box.quantity;
  const hasAvailableBoxes = RestaurantService.hasAvailability(box);
  const isFinished = RestaurantService.isFinished(box);
  const isStarted = RestaurantService.isStarted(box);
  

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({
        userId: user.id,
        email: user.email,
        pageName: 'OfferDetails',
        data: {boxId: box.id, isStarted: isStarted, isFinished: isFinished, isOpen: isOpen},
        loc: userLocation
      });
    });
  }, [navigation]);

  const isOnFocus = useIsFocused();

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.mainContentWrapper}>
        <View style={{flexDirection: 'row'}}>
          <BackButton/>
          <View style={{
            flex: 1,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{fontSize: 18}}>
              {restaurant.name}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{}}>
            <Image
              style={{
                aspectRatio: 2,
                width: '100%',
                marginBottom: 10
              }}
              resizeMode={'contain'}
              blurRadius={canCheckout ? 0 : 3}
              source={{uri: API_ENDPOINT_PRODUCT_PHOTOS + box.photo}}
            />
          </View>

          <View style={styles.wrapBoxMeta}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={{flex: 1, width: 1, color: '#29455f'}}>
              <Text style={styles.boxTitleText}>{box.name}</Text>
              <Text>{` ${translateText(intl, 'order.from')} `}</Text>
              <Text style={styles.boxTitleText}>{restaurant.name}</Text>
            </Text>

            {!isOpen &&
              <View
                style={{
                  ...styles.availableBoxesIndicatorWrapper,
                  backgroundColor: COLORS.red,
                  borderColor: '#000', borderWidth: 2,
                }}
              >
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.availableBoxesIndicatorText}>
                  {translateText(intl, 'restaurant.status.closed')}
                </Text>
              </View>
            }

            {isOpen && !isFinished &&
              <View
                style={{
                  ...styles.availableBoxesIndicatorWrapper,
                  backgroundColor: COLORS.primary,
                  borderColor: '#000', borderWidth: 2,
                }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.availableBoxesIndicatorText}>
                  {availableBoxes}{' '}{availableBoxes === 1 ? translateText(intl, 'box') : translateText(intl, 'boxes')}
                </Text>
              </View>
            }

            {isOpen && isFinished &&
              <View
                style={{
                  ...styles.availableBoxesIndicatorWrapper,
                  backgroundColor: COLORS.red,
                  borderColor: '#000', borderWidth: 2,
                }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.availableBoxesIndicatorText}>
                  {translateText(intl, 'offer.expired')}
                </Text>
              </View>
            }

          </View>

          {canCheckout &&
            <View style={styles.pickUpTimeWrapper}>
              <Image
                source={require('../../assets/icons/offer_clock_icon.png')}
                style={styles.pickUpTimeIcon}
                resizeMode="contain"
              />
              <Text style={styles.pickUpTimeText}>
                {`${translateText(intl, 'offer.pick_up_window')} ${translateText(intl, 'offer.from')} ${RestaurantService.formatPickUpWindowDate(box.pickUpFrom)} ${translateText(intl, 'offer.to')} ${RestaurantService.formatPickUpWindowDate(box.pickUpTo)}!`}
              </Text>
            </View>
          }

          {!isOpen &&
            <View style={{
              ...styles.countdownWrapper,
              backgroundColor: COLORS.red,
            }}>
              <Text style={styles.countdownText}>
                {translateText(intl, 'offer.restaurant_not_open')}
              </Text>
            </View>
          }

          {isOpen && !hasAvailableBoxes &&
            <View style={{
              ...styles.countdownWrapper,
              backgroundColor: COLORS.primary,
            }}>
              <Text style={styles.countdownText}>
                {translateText(intl, 'offer.no_availability')}
              </Text>
            </View>
          }

          {isOpen && isFinished &&
            <View style={{
              ...styles.countdownWrapper,
              backgroundColor: COLORS.red,
            }}>
              <Text style={styles.countdownText}>
                {translateText(intl, 'offer.message_end')}
              </Text>
            </View>
          }

          {canCheckout && (
            <View style={{
              ...styles.countdownWrapper,
              backgroundColor: isStarted ? COLORS.red : COLORS.primary,
            }}>
              <Image
                source={require('../../assets/icons/stopwatch_icon.png')}
                style={styles.countdownIcon}
                resizeMode="contain"
              />

              <Text style={styles.countdownText}>
                {isStarted ? translateText(intl, 'offer.sale_end') : translateText(intl, 'offer.sale_start')}
              </Text>

              <CountDown
                until={(isStarted ? box.pickUpTo - now : box.pickUpFrom - now) / 1000}
                size={11}
                digitStyle={{backgroundColor: isStarted ? COLORS.red : COLORS.primary}}
                style={{marginTop: 3, marginLeft: 2}}
                digitTxtStyle={{color: '#FFF'}}
                separatorStyle={{color: '#FFF', margin: 0}}
                timeToShow={['H', 'M', 'S']}
                timeLabels={{m: '', s: ''}}
                showSeparator
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.addressWrapper}
            onPress={() => showOnMap({location: {latitude: restaurant.latitude, longitude: restaurant.longitude}})}
          >
            <Image
              style={styles.addressIcon}
              source={icons.location}
              resizeMode="contain"
            />

            <Text style={styles.addressText}>
              {restaurant.address}
            </Text>
          </TouchableOpacity>

          <Text style={styles.description}>
            {`${translateText(intl, 'offer.description_start')} ${box.summary} ${translateText(intl, 'offer.description_end')}`}
          </Text>

          <Text style={styles.allergens}>
            {`${translateText(intl, 'offer.allergens')}: `}
            {box.allergenes.map((item: string, key: number) => {
              let dot = box.allergenes.length - 1 === key ? '' : ', ';
              return <Text key={key}>{translateText(intl, `allergens.${item}`)}{dot}</Text>;
            })}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.h3}>
              {translateText(intl, 'offer.diet_type')}
            </Text>
            <Text>{dietTypeText}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.h3}>
              {translateText(intl, 'offer.food_type')}
            </Text>
            <Text>{foodTypeText}</Text>
          </View>
          

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.h3}>
              {translateText(intl, 'offer.price_in_store')}
            </Text>
            <Text>{` ${box.price}${translateText(intl, `currency.${box.currency}`)}`}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.h3}>
              {translateText(intl, 'offer.price_in_foodobox')}
            </Text>
            <Text>{` ${box.discountedPrice}${translateText(intl, `currency.${box.currency}`)} (-${box.discount}%)`}</Text>
          </View>

          {canCheckout &&
            <Text>
              <Text style={{color: COLORS.red, fontWeight: '700'}} >{translateText(intl, 'warning')}</Text>
              <Text>{translateText(intl, 'warning.check_address')}</Text>
            </Text>
          }

          {canCheckout &&
            <FoodBoxCheckoutControl
              restaurant={restaurant}
              foodbox={box}
              isOnFocus={isOnFocus}
            />
          }

          {canCheckout &&
            <View style={styles.howToPickUpDetailsWrapper}>
              <Text style={styles.howToPickUpTitle}>
                {translateText(intl, 'offer.pick_up_info_header')}
              </Text>
              <Text style={styles.howToPickUpDetails}>
                {translateText(intl, 'offer.pick_up_info_description')}
              </Text>
              <Text style={styles.howToPickUpTitle}>
                {translateText(intl, 'offer.pick_up_info_windows_header')}
              </Text>
              <Text style={styles.howToPickUpDetails}>
                {`${translateText(intl, 'offer.from')} `}
                {RestaurantService.formatPickUpWindowDate(box.pickUpFrom)}
                {` ${translateText(intl, 'offer.to')} `}
                {RestaurantService.formatPickUpWindowDate(box.pickUpTo)}
              </Text>
              <Text style={styles.howToPickUpTitle}>
                {translateText(intl, 'offer.adress_dailog')}
              </Text>
              <Text style={styles.descriptionAddressDialog}>
                <TouchableOpacity
                  style={styles.addressWrapper}
                  onPress={() => showOnMap({
                    location: {
                      latitude: restaurant.latitude,
                      longitude: restaurant.longitude,
                    },
                  })}
                >
                  <Image
                    style={styles.addressIcon}
                    source={icons.location}
                    resizeMode="contain"
                  />

                  <Text style={styles.howToPickUpDetails}>
                    {restaurant.address}
                  </Text>

                  <Image
                    style={styles.addressIcon}
                    source={icons.location}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Text>
            </View>
          }


        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContentWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
    color: COLORS.black
  },
  mainWrapper: {},
  wrapBoxMeta: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    height: 50,
  },
  boxTitleText: {
    fontWeight: '700',
    // fontSize: 18,
    flexWrap: 'wrap',
  },
  availableBoxesIndicatorWrapper: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
    width: 80,
    marginLeft: 10,
  },
  availableBoxesIndicatorText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  pickUpTimeWrapper: {flexDirection: 'row', marginTop: 5},
  pickUpTimeIcon: {width: 16, height: 16},
  pickUpTimeText: {marginHorizontal: 5, fontSize: 12, fontWeight: '500'},
  addressWrapper: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20,
  },
  addressText: {
    flexGrow: 1,
    fontSize: 12,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  addressIcon: {
    width: 16, height: 16,
  },
  wrapCategoryName: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  categoryName: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },

  allergens: {
    marginTop: 15,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
  },

  h3: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
  },

  categoryTitle: {
    fontSize: 12,
  },
  WrapCategoryTitle: {
    flexDirection: 'row',
    marginTop: 15,
  },
  wrapQuantity: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promoCode: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  wrapPrice: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  wrapBtnOrder: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  textOrder: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
  },
  minus: {
    height: 35,
    width: 35,
  },
  plus: {
    height: 35,
    width: 35,
  },
  wrapIconFastTime: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconFastTime: {
    height: 70,
  },
  howToPickUpDetailsWrapper: {
    marginTop: 10,
  },
  howToPickUpHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  howToPickUpDescription: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
  },
  howToPickUpTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    color: '#707070',
    marginBottom: 10,
  },
  howToPickUpDetails: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 30,
  },
  addressDialog: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#707070',
  },
  descriptionAddressDialog: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 80,
    fontSize: 16,
    marginTop: 7,
    marginLeft: 30,
    marginRight: 30,
  },
  countdownWrapper: {
    marginTop: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  countdownIcon: {
    width: 15,
    height: 15,
    tintColor: '#fff',
    marginRight: 10,
  },
  countdownText: {fontSize: 13, color: '#fff', fontWeight: '700'},
  buttonNewpassword: {
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
  codeInput: {
    borderRadius: 10,
    borderColor: '#9B9B9B',
    borderWidth: 1,
    padding: 2,
    width: Utils.width / 2 + 30,
    height: 38,
    fontSize: 12,
  },
  buttonPromoCode: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginLeft: 20,
    alignSelf: 'center',
    height: 38,
    width: Utils.width / 5,
  },
});
export default Offer;
