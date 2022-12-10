import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {API_ENDPOINT_RESTAURANT_PHOTOS} from '../../network/Server';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {RestaurantService} from '../../services/RestaurantService';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {COLORS} from '../../constants';
import {DIET_TYPE, FOOD_TYPE} from '../../models';

export type RestaurantListItemProps = {
  restaurant: RestaurantHomeListItem;
  isFullscreen: boolean;
  userLocation: FBGeoLocation
}

const RestaurantListItem = (componentProps: RestaurantListItemProps) => {
  const {
    restaurant,
    isFullscreen,
    userLocation,
  } = componentProps;

  const intl = useIntl();
  const navigation = useNavigation();
  const box = restaurant.products[0];

  const canCheckout = RestaurantService.canCheckout(box);
  const isFinished = RestaurantService.isFinished(box);
  const isOpen = RestaurantService.isOpen(box);
  const borderColor = canCheckout ? COLORS.green : COLORS.red;
  const boxQuantityBackgroundColor = canCheckout ? COLORS.green : COLORS.red;
  const discountedPrice = box.price - (box.price * (box.discount / 100));

  let statusText = `${box.quantity} ${box.quantity === 1 ? translateText(intl, 'box') : translateText(intl, 'boxes')}`;
  if (!isOpen) {
    statusText = translateText(intl, 'restaurant.status.closed');
  }
  if (isOpen && isFinished) {
    statusText = translateText(intl, 'offer.expired');
  }

  const dietTypeText = RestaurantService.getDietTypeText(box, intl);
  const foodTypeText = RestaurantService.getFoodTypeText(box, intl);


  const onClickHandler = () => {
    navigation.navigate('Offer', {restaurant: restaurant, userLocation: userLocation, box: box});
  };

  return (
    <TouchableOpacity
      style={{
        shadowColor: 'rgba(0,0,0, .3)', // IOS
        shadowOffset: {height: 5, width: 5}, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 2, // Android
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: borderColor,
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        paddingTop: isFullscreen ? 0 : 10,
      }}
      key={restaurant.id}
      onPress={onClickHandler}
    >
      {isFullscreen &&
        <View>
          <Image
            source={{uri: API_ENDPOINT_RESTAURANT_PHOTOS + restaurant.coverImage}}
            resizeMode={'contain'}
            style={{
              width: '100%',
              aspectRatio: 2,
            }}
            blurRadius={canCheckout ? 0 : 3}
          />
        </View>
      }

      <View style={{
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {/*AvatarImg*/}
        <View style={{width: 70}}>
          <Image
            source={{uri: API_ENDPOINT_RESTAURANT_PHOTOS + restaurant.thumbnailAvatarImage}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 200,
              marginRight: 10,
              borderColor: COLORS.black,
              borderWidth: 1,
            }}
          />
        </View>

        {/*RestaurantInfo*/}
        <View style={{flex: 1}}>
          <View style={{flexGrow: 1, flexDirection: 'row'}}>
            <Text style={{flex: 1, width: 1, color: '#29455f'}}>
              <Text style={{fontSize: 13, fontWeight: '700', color: '#29455f'}}>{box.name}</Text>
              <Text>{` ${translateText(intl, 'order.from')} `}</Text>
              <Text style={{fontSize: 13, fontWeight: '700', color: '#29455f'}}>{restaurant.name}</Text>
            </Text>
          </View>

          <Text adjustsFontSizeToFit numberOfLines={1} style={{
            fontSize: 12,
            fontWeight: '500',
          }}>
            {restaurant.businessType}
          </Text>

          <Text adjustsFontSizeToFit numberOfLines={2} style={{
            fontSize: 12,
            fontWeight: '500',
          }}>
            {foodTypeText} - {dietTypeText}
          </Text>

          {canCheckout &&
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
            }}>
              {RestaurantService.formatPickUpWindowDate(box.pickUpFrom)}{' '}-{' '}{RestaurantService.formatPickUpWindowDate(box.pickUpTo)}
            </Text>
          }

          <Text style={{
            fontSize: 12,
            fontWeight: '500',
          }}>
            {restaurant.distance}
            {translateText(intl, 'distance_unit')}
          </Text>
        </View>

        {/*BoxInfo*/}
        <View style={{width: 70}}>
          <View style={{
            borderRadius: 5,
            backgroundColor: boxQuantityBackgroundColor,
            paddingHorizontal: 10,
            paddingVertical: 5,
            justifyContent: 'center',
          }}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{
              alignSelf: 'center',
              color: '#fff',
              fontSize: 12,
            }}>
              {statusText}
            </Text>
          </View>

          <Text style={{
            fontSize: 10,
            color: '#afbbc4',
            fontWeight: '700',
            textDecorationLine: 'line-through',
            marginTop: 5,
            alignSelf: 'flex-end',
          }}>
            {box.price.toFixed(2)}{translateText(intl, `currency.${box.currency}`)}
          </Text>
          <Text style={{
            fontSize: 13,
            color: 'red',
            fontWeight: '700',
            marginTop: 5,
            alignSelf: 'flex-end',
          }}>
            {discountedPrice.toFixed(2)}{translateText(intl, `currency.${box.currency}`)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantListItem;
