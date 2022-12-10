import MapView from 'react-native-map-clustering';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {API_ENDPOINT_RESTAURANT_PHOTOS} from '../../network/Server';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';
import {FBRootState} from '../../redux/store';
import Geolocation, {GeolocationError} from '@react-native-community/geolocation';
import {RestaurantService} from '../../services/RestaurantService';
import {restaurantDistanceUpdateAction} from '../../redux/restaurant/actions';
import {userUpdateLocationAction, userUpdateLocPermissionAction} from '../../redux/user/actions';
import {translateText} from '../../lang/translate';
import {useIntl} from 'react-intl';
// @ts-ignore
import RNSettings from 'react-native-settings';
import {check as checkPermission, PERMISSIONS, request as requestPermission} from 'react-native-permissions';
import {FBGeoLocation} from '../../models/FBGeoLocation';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {COLORS} from '../../constants';
import {UserPermissionAnswer} from '../../redux/user/reducer';
import {FBBox} from '../../models/FBBox';


enum ZoomLevel {
  CLOSE = 15,
  MEDIUM = 12,
  HIGH = 9
}

const zoomToDelta = {
  [ZoomLevel.CLOSE]: {latitudeDelta: 0.01, longitudeDelta: 0.01},
  [ZoomLevel.MEDIUM]: {latitudeDelta: 0.1, longitudeDelta: 0.1},
  [ZoomLevel.HIGH]: {latitudeDelta: 1, longitudeDelta: 1},
};


const ClusteredMapView = ({zoomOnRestaurant}:{zoomOnRestaurant?: RestaurantHomeListItem}) => {
  const {navigate} = useNavigation();
  const dispatch = useDispatch();
  const intl = useIntl();

  const map = useRef<MapView>();

  // used to determine if the user has interacted with the map
  const [systemHasMapControl, setSystemHasMapControl] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(false);

  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const restaurants = useSelector((state: FBRootState) => state.restaurantState.forMap);
  console.log('restaurants', zoomOnRestaurant);
  
  const zoomToLocation = useCallback((params: { location: FBGeoLocation, zoomLevel: ZoomLevel }) => {
    if (map.current) {
      // @ts-ignore
      map.current.animateCamera(
        {
          center: params.location,
          zoom: params.zoomLevel,
        },
        {duration: 1000},
      );
    }
  }, []);

  useEffect(()=>{
    if (zoomOnRestaurant) {
      zoomToLocation({location: {latitude: zoomOnRestaurant.latitude, longitude: zoomOnRestaurant.longitude}, zoomLevel: ZoomLevel.CLOSE});
    }
  },[zoomOnRestaurant, zoomToLocation]);

  useEffect(() => {
    const isLocationServiceEnabled = async () => {
      const locationSettingStatus = await RNSettings.getSetting(RNSettings.LOCATION_SETTING);
      const locationPermissionRequestStatus = await checkPermission(
        Platform.select({ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION})!
      );
      return locationSettingStatus === 'ENABLED' && locationPermissionRequestStatus !== 'unavailable';
    };

    const getUserLocation = async () => {
      const isLocationEnabled = await isLocationServiceEnabled();
      
      dispatch(userUpdateLocPermissionAction({userAnswer: UserPermissionAnswer.NO}));

      if (isLocationEnabled) {
        if (Platform.OS === 'ios') {
          await getIOSLocation();
        } else if (Platform.OS === 'android') {
          await getAndroidLocation();
        }
      } else {
        // TODO: show dialog explaining the issue and prompt for enabling
      }
    };

    const isAndroidLocationPermissionGranted = async () => {
      const locationPermissionStatus = await checkPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (locationPermissionStatus === 'granted') {
        // user has granted it
        return true;
      } else if (locationPermissionStatus === 'denied') {
        // must ask user
        const locationPermissionRequest = await requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (locationPermissionRequest === 'granted') {
          // user has granted it
          return true;
        }
      }

      return false;
    };

    const getAndroidLocation = async () => {
      if (await isAndroidLocationPermissionGranted()) {
        Geolocation.watchPosition(
          (position) => {
            handleUserLocationUpdate({currentUserLocation: position.coords});
          },
          (error) => {
            handleUserLocationError(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 100,
          },
        );
      }
    };

    const getIOSLocation = async () => {

      Geolocation.requestAuthorization();
      Geolocation.watchPosition(
        (position) => {
          handleUserLocationUpdate({currentUserLocation: position.coords});
        },
        (error) => {
          handleUserLocationError(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100,
        },
      );
    };

    const handleUserLocationError = (error: GeolocationError) => {
      setShowUserLocation(false);
      if (error.code === error.PERMISSION_DENIED) {
        dispatch(userUpdateLocPermissionAction({userAnswer: UserPermissionAnswer.NO}));
      }
    };

    const handleUserLocationUpdate = (params: { currentUserLocation: FBGeoLocation }) => {
      const {currentUserLocation} = params;
      // ensure restaurants are shown closest to last known location on first load until we have real location
      dispatch(userUpdateLocationAction({userLocation: currentUserLocation}));

      // update restaurants distance to user
      dispatch(restaurantDistanceUpdateAction({userLocation: currentUserLocation}));

      // since we have access to the location show it on the map
      setShowUserLocation(true);
      
      // we have access
      dispatch(userUpdateLocPermissionAction({userAnswer: UserPermissionAnswer.YES}));
    };

    getUserLocation();

    return () => {
      Geolocation.stopObserving();
    };
  }, [dispatch, zoomToLocation]);
  
  useEffect(()=>{
    if (systemHasMapControl) {
      zoomToLocation({location: userLocation, zoomLevel: ZoomLevel.CLOSE});
    }
  }, [systemHasMapControl, userLocation, zoomToLocation]);
  
  return (
    <>
      <MapView
        onRegionChangeComplete={(_region, details) => {
          if (details.isGesture) {
            setSystemHasMapControl(false);
          }
        }}
        
        provider={PROVIDER_GOOGLE}
        // @ts-ignore
        ref={map}
        loadingEnabled={true}
        moveOnMarkerPress={true}
        initialRegion={{
          ...userLocation,
          ...zoomToDelta[ZoomLevel.MEDIUM],
        }}
        showsUserLocation={showUserLocation}
        style={{
          ...StyleSheet.absoluteFillObject,
          width: '100%',
        }}
      >
        {
          zoomOnRestaurant.map(restaurant => {
            const box: FBBox = restaurant.boxes[0];
            const canCheckout = RestaurantService.canCheckout(box);

            return (
              <Marker
                key={restaurant.listIndex}
                identifier={`${restaurant.listIndex}`}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}>
                <Image
                  source={{
                    uri: API_ENDPOINT_RESTAURANT_PHOTOS + restaurant.thumbnailAvatarImage,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    borderColor: canCheckout ? COLORS.green : COLORS.red,
                    overflow: 'hidden',
                    borderWidth: 2,
                  }}
                />
                <Callout
                  onPress={() => navigate('Offer', {
                    restaurant: restaurant,
                    box: box,
                  })}
                  style={{width: 100}}
                >
                  <View style={{flexGrow: 1}}>
                    <View style={{flexGrow: 1, flexDirection: 'row'}}>
                      <Text style={{flex: 1, width: 1, color: '#29455f'}}>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '700',
                          color: '#29455f',
                        }}>{box.name}</Text>
                        <Text>{` ${translateText(intl, 'order.from')} `}</Text>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '700',
                          color: '#29455f',
                        }}>{restaurant.name}</Text>
                      </Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                      <Text style={{alignSelf: 'flex-end'}} >{translateText(intl, 'maps.marker.details')} {'=>'}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>
      <MyLocationButton onPress={() => {
        zoomToLocation({location: userLocation, zoomLevel: ZoomLevel.CLOSE});
        setSystemHasMapControl(true);
      }}/>
    </>
  );
};

export default ClusteredMapView;


const MyLocationButton = ({onPress}: { onPress: () => void }) => {

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10
      }}>
      <Image
        source={require('../../../assets/icons/user_location_icon.png')}
        style={{width: 30, height: 30}}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};
