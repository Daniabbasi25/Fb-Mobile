import React, {useEffect, useState} from 'react';
import {Image, Keyboard, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Utils} from '../../utils';
import Autocomplete from 'react-native-autocomplete-input';
import {FBRootState} from '../../redux/store';
import {RestaurantHomeListItem} from '../../models/Restaurant';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {translateText} from '../../lang/translate';
import {restaurantUpdateFiltersAction} from '../../redux/restaurant/actions';
import {COLORS} from '../../constants';
import {useFbLoading} from '../../providers/FBLoaderProvider';

export interface RestaurantSearchProps {
  onSelect: (restaurant: RestaurantHomeListItem) => void;
  toHideResults: boolean;
}

const RestaurantSearch = ({onSelect, toHideResults}: RestaurantSearchProps) => {
  const restaurants = useSelector((state: FBRootState) => state.restaurantState.forList);
  const userInput = useSelector((state: FBRootState) => state.restaurantState.filters.search.userInput);

  const [suggestionsList, setSuggestionsList] = useState<RestaurantHomeListItem[]>([]);
  const [userHasSelected, setUserHasSelected] = useState(false);
  const {showLoading, hideLoading} = useFbLoading();

  const styles = styleCreator({});
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    setSuggestionsList(restaurants);
  }, [restaurants]);

  const searchRestaurants = (userInputQuery: string) => {
    showLoading('searching');
    
    setUserHasSelected(false);

    dispatch(restaurantUpdateFiltersAction({
      filterCategory: 'search',
      filterCategoryProperty: 'userInput',
      newValue: userInputQuery,
    }));

    setTimeout(() => {
      hideLoading('searching');
    }, 200);
  };

  return (
    <View style={{minHeight: 55}}>
      <Autocomplete
        data={suggestionsList}
        value={userInput}
        onChangeText={i => searchRestaurants(i)}
        flatListProps={{
          style: {
            maxHeight: Utils.height * 0.2,
          },
          keyboardShouldPersistTaps: 'handled',
          keyExtractor: (r: RestaurantHomeListItem) => r.listIndex.toString(),
          renderItem: (item: ListRenderItemInfo<RestaurantHomeListItem>) => (
            <TouchableOpacity
              style={styles.autocompleteOptionText}
              onPress={() => {
                Keyboard.dismiss();

                dispatch(restaurantUpdateFiltersAction({
                  filterCategory: 'search',
                  filterCategoryProperty: 'userInput',
                  newValue: item.item.name,
                }));

                onSelect(item.item);

                setUserHasSelected(true);
              }}
            >
              <View style={{flexGrow: 1, flexDirection: 'row'}}>
                <Text style={{flex: 1, width: 1, color: '#29455f'}}>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#29455f',
                  }}>{item.item.boxes[0].name}</Text>
                  <Text>{` ${translateText(intl, 'order.from')} `}</Text>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#29455f',
                  }}>{item.item.name}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
        placeholder={translateText(intl, 'home.find_object')}
        placeholderTextColor="grey"
        inputContainerStyle={styles.autocompleteInputWrapper}
        renderTextInput={(props: any) =>
          <TextInput
            {...props}
            style={styles.autocompleteInput}
          />
        }
        hideResults={!userInput || userHasSelected || toHideResults}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          right: 0,
          padding: 19,
        }}
        onPress={() => {
          Keyboard.dismiss();
          searchRestaurants('');
        }}>
        <Image source={require('../../../assets/images/app_close_icon.png')}/>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantSearch;

const styleCreator = ({}: {}) => StyleSheet.create({
  autocompleteInputWrapper: {
    borderColor: '#fff',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowOffset: {height: 3, width: 0},
    elevation: 0,
  },
  autocompleteInput: {
    height: 40,
    color: '#000',
  },
  autocompleteOptionText: {
    fontSize: 15,
    padding: 10,
    margin: 2,
    borderRadius: 5,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  autocompleteCloseButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    elevation: 0,
    padding: 7,
  },
});
