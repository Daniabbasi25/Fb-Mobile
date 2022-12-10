import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {RestaurantHomeListItem} from '../models/Restaurant';
import ArrowIcon from './../../assets/images/arrow.svg';

const data = [
  {label: 'Пловдив', value: 'Пловдив'},
  {label: 'София-град', value: 'София-град'},
  {label: 'Варна', value: 'Варна'},
];

const ChooseCity = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantHomeListItem | undefined
  >(undefined);
  const [value, setValue] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectedCityBtn}>
        <ArrowIcon />
        <Text style={styles.selectedCityBtnTxt}>София-град</Text>
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <ClusteredMapView zoomOnRestaurant={selectedRestaurant} />
      </View>
      <View style={styles.selectCityMain}>
        <Text style={styles.selectCityHeading}>
          Въведи град и радиус, в който искаш да спасиш храна{' '}
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="София-град"
          searchPlaceholder="Search..."
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
        />
        <Slider
          style={{width: '105%', marginTop: 30, alignSelf: 'center'}}
          minimumValue={0}
          maximumValue={10}
          minimumTrackTintColor="#79C54A"
          maximumTrackTintColor="gray"
          thumbTintColor="#79C54A"
        />
        <Text style={styles.sliderValueTXt}>8км</Text>
        <TouchableOpacity style={styles.toTheResultBtn}>
          <Text style={styles.toTheResultBtnTXt}>Към резултатите</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  dropdown: {
    height: 40,
    // width: '90%',
    // alignSelf: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: 30,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectCityHeading: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
  selectCityMain: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // height: 200,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  toTheResultBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#79C54A',
    height: 48,
    borderRadius: 8,
    marginTop: 30,
  },
  toTheResultBtnTXt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sliderValueTXt: {
    textAlign: 'right',
    color: '#79C54A',
    fontWeight: 'bold',
  },
  selectedCityBtn: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#79C54A',
    height: 36,
    width: 139,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    left: 25,
    elevation: 5,
    borderRadius: 8,
  },
  selectedCityBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 3,
  },
});

export default ChooseCity;
