import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import 'react-native-gesture-handler';
import {showToastError} from '../common/FBToast';
import {restaurantResetAction, restaurantsFetchedAction} from '../redux/restaurant/actions';
import {RestaurantService} from '../services/RestaurantService';
import {RestaurantRepository} from '../repositories/RestaurantRepository';
import RestaurantList from '../components/Home/restaurantList';
import {FBRootState} from '../redux/store';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {userSetUserAction} from '../redux/user/actions';
import {useAuth} from '../providers/AuthProvider';
import FbModal from '../components/common/fbModal';
import {WebView} from 'react-native-webview';
import {TERMS_AND_CONDITIONS_FACTORY} from '../network/Server';
import {analyticsPageOpen, analyticsSetTC} from '../analytics';
import {FBUser} from '../models/User';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import {UserRepository} from '../repositories/UserRepository';
import {useFbLoading} from '../providers/FBLoaderProvider';
import {isFBAppError, isFBBackendError, isFBGenericError} from '../network/axiosClient';
import RestaurantSearch from '../components/Home/restaurantSearch';
import {COLORS, icons} from '../constants';
import {RestaurantHomeListItem} from '../models/Restaurant';

export interface HomeProps {
  route: any;
  navigation: any;
}

// TODO: rename ot availableBoxes
const Home = ({navigation}: HomeProps) => {
  const {signOut, authData} = useAuth();

  const [toShowMap, setToShowMap] = useState(true);
  const styles = stylesCreator({isFullScreen: !toShowMap});

  const [termsAndConditionsModal, setTermsAndConditionsModalVisible] = useState(false);

  const {showLoading, hideLoading} = useFbLoading();
  const intl = useIntl();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);
  const userLocation = useSelector((state: FBRootState) => state.userState.userLocation);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantHomeListItem | undefined>(undefined);

  const dispatch = useDispatch();

  const refreshRestaurants = async () => {
    await fetchRestaurantList();
  };

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
        if (error.toSignOut()) {
          signOut();
        }
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
      dispatch(restaurantResetAction());
    }

    hideLoading('fetchRestaurants');
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      await analyticsPageOpen({userId: user.id, email: user.email, pageName: 'Home', loc: userLocation});
    });
  }, [navigation, user.email, user.id]);

  useEffect(() => {
    if (!user.acceptedTC) {
      setTermsAndConditionsModalVisible(true);
    }
    fetchRestaurantList();
  }, []);

  const confirmTermsAndConditions = async () => {
    setTermsAndConditionsModalVisible(false);


    const userRepository = new UserRepository({authData: authData!});
    try {
      // update TC
      await userRepository.acceptTC({userId: user.id, email: user.email});

      analyticsSetTC({userId: user.id, email: user.email, action: 'accept', loc: userLocation});

      // fetch user again
      const newUser = await userRepository.checkMe({});
      dispatch(userSetUserAction({user: newUser}));
    } catch (error) {
      if (isFBAppError(error) || isFBGenericError(error)) {
        showToastError(translateText(intl, error.key));
      } else if (isFBBackendError(error)) {
        showToastError(error.message);
      } else {
        showToastError(translateText(intl, 'genericerror'));
      }
    }
  };

  const declineTermsAndConditions = async () => {
    // TODO: add loading
    analyticsSetTC({userId: user.id, email: user.email, action: 'decline', loc: userLocation});
    signOut();
    setTermsAndConditionsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.mainView}>
        <View style={[
          {
            padding: 20,
          },
          toShowMap ? {
            flex: 1,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
          } : {},
        ]}
        >
          <RestaurantSearch onSelect={(r) => setSelectedRestaurant(r)} toHideResults={!toShowMap}/>
        </View>
        
        {toShowMap &&
          <View style={{flex: 1}}>
            <ClusteredMapView zoomOnRestaurant={selectedRestaurant}/>
          </View>
        }
        <View style={{
          flex: 1,
          paddingTop: 10,
          paddingHorizontal: 15,
        }}>

          <TouchableOpacity
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}
            onPress={() => setToShowMap(!toShowMap)}
          >
            <Text style={{fontSize: 12, fontWeight: '700'}}>
              {toShowMap ? translateText(intl, 'home.list_object') : translateText(intl, 'home.list_expand')}
            </Text>

            <Image
              source={toShowMap ? icons.arrow_up : icons.arrow_down}
              style={{width: 10, height: 10, marginLeft: 5}}
            />
          </TouchableOpacity>

          <RestaurantList
            isFullScreen={!toShowMap}
            onRefreshTriggered={() => refreshRestaurants()}
          />
        </View>
      </View>
      <FbModal
        contentContainerStyles={styles.termsConditionsContainerStyles}
        confirm={() => confirmTermsAndConditions()}
        modalVisible={termsAndConditionsModal}
        decline={() => declineTermsAndConditions()}
      >
        <WebView
          style={{marginBottom: 30, width: Dimensions.get('window').width}}
          source={{uri: TERMS_AND_CONDITIONS_FACTORY[userLocale]}}
          startInLoadingState={true}
          renderLoading={() => {
            return (<ActivityIndicator
              color="#bc2b78"
              size="large"
              hidesWhenStopped={true}
            />);
          }}
        />
      </FbModal>
    </SafeAreaView>
  );
};

export default Home;

const stylesCreator = ({isFullScreen}: { isFullScreen: boolean }) => StyleSheet.create({
  mainWrapper: {flex: 1, backgroundColor: '#fff', color: COLORS.black},
  mainView: {flex: 1},
  restaurantsWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: isFullScreen ? '100%' : '40%',
    opacity: 0.95,
  },
  restaurantsWrapperInner: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
    // backgroundColor: '#fff',
  },
  mapView: {
    flex: 1,
  },
  termsConditionsContainerStyles: {
    width: '80%',
    height: '70%',
    backgroundColor: '#fefaf2',
  },
});
