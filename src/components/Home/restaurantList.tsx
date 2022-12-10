import React from 'react';
import {FlatList, ListRenderItemInfo, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import RestaurantListItem from './restaurantListItem';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {FBRootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
import {COLORS} from '../../constants';
import {RESTAURANT_SORT_OPTION} from '../../redux/restaurant/reducer';
import {updateRestaurantSortOrderAction} from '../../redux/restaurant/actions';
import {UserPermissionAnswer} from '../../redux/user/reducer';

export interface RestaurantListProps {
  isFullScreen: boolean,
  onRefreshTriggered: () => any
}

const RestaurantList = ({
                          isFullScreen,
                          onRefreshTriggered,
                        }: RestaurantListProps) => {
  
  const intl = useIntl();
  const dispatch = useDispatch();
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const sortOrder = useSelector((state: FBRootState) => state.restaurantState.sortOrder);
  const restaurants = useSelector((state: FBRootState) => state.restaurantState.forList);
  const userLocationPermissions = useSelector((state: FBRootState) => state.userState.locationPermission);

  console.log("restaurants", restaurants);
  
  const renderRestaurantItem = (item: ListRenderItemInfo<RestaurantHomeListItem>) => {
    return <RestaurantListItem
      restaurant={item.item}
      isFullscreen={isFullScreen}
      userLocation={userLocation}
    />;
  };

  const renderSortOptionListItem = (item: ListRenderItemInfo<RESTAURANT_SORT_OPTION>) => {
    const sortOption = item.item;
    const isSelected = sortOption === sortOrder;
    return (
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
          backgroundColor: isSelected ? COLORS.green : COLORS.white,
        }}
        onPress={() => {
          dispatch(updateRestaurantSortOrderAction({sortOrder: sortOption}));
        }}
      >
        <Text style={{
          fontSize: 10,
          color: isSelected ? '#fff' : '#000',
        }}>
          {translateText(intl, `sort.${sortOption}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRestaurantListRefresh = () => {
    onRefreshTriggered();
  };

  // check if empty
  if (restaurants.length === 0) {
    return (
      <View style={{flex: 1}}>
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
            backgroundColor: COLORS.primary,
          }}
          onPress={() => onRestaurantListRefresh()}
        >
          <Text style={{
            color: 'white',
            fontSize: 12,
          }}
          >
            {translateText(intl, 'home.refresh')}
          </Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 12,
          color: 'grey',
          fontWeight: '700'
        }}>
          {translateText(intl,'restaurantslist.empty')}
        </Text>
      </View>
    );
  } else {
    return (
      <View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
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
              backgroundColor: COLORS.red,
            }}
            onPress={() => onRestaurantListRefresh()}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
            }}
            >
              {translateText(intl, 'home.refresh')}
            </Text>
          </TouchableOpacity>

          <View>
            <FlatList
              data={Object.values(RESTAURANT_SORT_OPTION)}
              horizontal
              keyExtractor={(item) => item}
              renderItem={renderSortOptionListItem}
            />
          </View>
        </View>

        {sortOrder !== RESTAURANT_SORT_OPTION.CLOSEST_DISTANCE_FIRST &&
          <Text>
            <Text style={{color: COLORS.red, fontWeight: '700'}} >{translateText(intl, 'warning')}</Text>
            <Text>{translateText(intl, 'warning.problematic_ordering')}</Text>
          </Text>
          
        }

        {userLocationPermissions.userAnswer === UserPermissionAnswer.NO &&
          <Text>
            <Text style={{color: COLORS.red, fontWeight: '700'}} >{translateText(intl, 'warning')}</Text>
            <Text>{translateText(intl, 'warning.no_location_permissions')}</Text>
          </Text>
          
        }
        
        <Text>
          <Text style={{color: COLORS.red, fontWeight: '700'}} >{translateText(intl, 'warning')}</Text>
          <Text>{translateText(intl, 'warning.check_address')}</Text>
        </Text>
        
        
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.listIndex.toString()}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onRestaurantListRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
};

export default RestaurantList;


