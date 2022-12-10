import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {images} from '../constants';
import FLagIcon from './../../assets/flags/ro.svg';
import SFlagIcon from './../../assets/flags/bg.svg';
import TFlagIcon from './../../assets/flags/us.svg';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

const data = [
  {label: 'English', value: 'English'},
  {label: 'Български', value: 'СБългарски'},
  {label: 'Română', value: 'Română'},
];

const SelectLanguageScreen = (props: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [value, setValue] = useState('Български');
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@Language');
        if (value !== null) {
          setValue(value);
          setLanguageLoading(false);
        }
      } catch (e) {
        console.log('error occure', e);
      }
    };
    getData();
  }, []);
  const [languageLoading, setLanguageLoading] = useState(true);
// my code here
const storeLanguage = async (props: any) => {
  console.log(props);
  try {
     ;
    await AsyncStorage.setItem('@Language', props)
    .then(()=>setValue(props))
    // await
  } catch (e) {
    // saving error
    // 
    console.log("language store error",e)
  }
};
// my code
  return (
    <SafeAreaView style={styles.container}>
      <Image source={images.app_logo} style={styles.logo} />
      <Text style={styles.languageTxt}>
        Добре дошъл във Foodobox! Избери език:
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
        renderRightIcon={() => (
          <>
            {value === 'English' ? (
              <TFlagIcon />
            ) : value === 'Română' ? (
              <SFlagIcon />
            ) : (
              <FLagIcon />
            )}
          </>
        )}
        onChange={item => {
         
          storeLanguage(item.value)
          // props.navigation.navigate('LoginScreen');
        }}
      />
      <View style={{marginTop: 40}}>
        <Button title="Continue" onPress={()=>props.navigation.navigate('LoginScreen',{value:value})}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
    alignItems: 'center',
  },
  logo: {
    width: 146,
    height: 52,
    marginTop: 40,
  },
  languageTxt: {
    color: '#fff',
    fontSize: 14,
    marginTop: height / 3.5,
    fontWeight: '700',
    width: '60%',
    alignSelf: 'center',
    textAlign: 'center',
  },

  dropdown: {
    height: 36,
    backgroundColor: '#182550',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 30,
    width: 144,
    borderWidth: 0.5,
    borderColor: '#FFFFFF80',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default SelectLanguageScreen;
