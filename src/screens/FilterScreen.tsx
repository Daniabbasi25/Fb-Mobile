import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import CloseIcon from './../../assets/images/closeBlue.svg';
import SelectedCityIcon from './../../assets/images/SelectedCity.svg';
import DollarIcon from './../../assets/images/dollarIcon.svg';
import InformationIcon from './../../assets/images/information.svg';
import ClockIcon from './../../assets/images/clock.svg';
import CakeIcon from './../../assets/images/cake.svg';
import AppleIcon from './../../assets/images/appleIcon.svg';
import CofeeIcon from './../../assets/images/cofee.svg';
import OthersIcon from './../../assets/images/others.svg';
import VegIcon from './../../assets/images/vegan.svg';
import VegetarianIcon from './../../assets/images/vegetarian.svg';

interface FilterScreenProps {
  route: any;
  navigation: any;
}

const FilterScreen = ({navigation}: FilterScreenProps) => {
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeIcon}>
          <CloseIcon />
        </TouchableOpacity>
        <Text style={styles.heading}>Сортирай по</Text>
        <View style={styles.sortBySec}>
          <TouchableOpacity style={styles.sortByBtn}>
            <SelectedCityIcon />
            <Text style={styles.sortByBtnTxt}>най-близо</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortByBtn}>
            <DollarIcon />
            <Text style={styles.sortByBtnTxt}>цена</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortByBtn}>
            <ClockIcon />
            <Text style={styles.sortByBtnTxt}>активни сега</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortByBtn}>
            <InformationIcon />
            <Text style={styles.sortByBtnTxt}>изтичащи скоро</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.heading, {marginTop: 30}]}>Тип заведение</Text>
        <View style={styles.filterSec}>
          <TouchableOpacity style={styles.cakeBox}>
            <CakeIcon />
            <Text style={styles.cakeBoxTxt}>печива и сладкиши</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cakeBox}>
            <AppleIcon />
            <Text style={styles.cakeBoxTxt}>хранителни продукти</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cakeBox}>
            <CofeeIcon />
            <Text style={styles.cakeBoxTxt}>ястия</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cakeBox}>
            <OthersIcon />
            <Text style={styles.cakeBoxTxt}>други</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.heading, {marginTop: 30}]}>
          диетични предпочитания
        </Text>
        <View style={styles.filterSec}>
          <TouchableOpacity style={styles.cakeBox}>
            <VegIcon />
            <Text style={styles.cakeBoxTxt}>веган</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cakeBox}>
            <VegetarianIcon />
            <Text style={styles.cakeBoxTxt}>веган</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeSec}>
          <View style={styles.fromTimeSec}>
            <Text style={styles.fromTimeLabel}>вземи от</Text>
            <TouchableOpacity
              style={styles.fromTimeBtn}
              onPress={() => setOpen(true)}>
              <Text style={styles.fromTimeBtnTxt}>
                {moment(fromTime).format('hh:mm')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.fromTimeSec, {marginLeft: 20}]}>
            <Text style={styles.fromTimeLabel}>до</Text>
            <TouchableOpacity
              style={styles.fromTimeBtn}
              onPress={() => setOpen2(true)}>
              <Text style={styles.fromTimeBtnTxt}>
                {moment(toTime).format('hh:mm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <DatePicker
          modal
          open={open}
          date={fromTime}
          //   maximumDate={new Date('2021-12-31')}
          //   minimumDate={new Date('2021-01-01')}
          onConfirm={date => {
            setOpen(false);
            setFromTime(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          textColor={'#000'}
        />
        <DatePicker
          modal
          open={open2}
          date={toTime}
          onConfirm={date => {
            setOpen2(false);
            setToTime(date);
          }}
          onCancel={() => {
            setOpen2(false);
          }}
          textColor={'#000'}
        />
      </ScrollView>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.navigate('Objects')}>
          <Text style={styles.cancelBtnTxt}>Изчисти</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate('Objects')}>
          <Text style={styles.doneBtnTxt}>Приложи</Text>
        </TouchableOpacity>
      </View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    color: '#182550',
    fontSize: 14,
    fontWeight: '800',
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  sortBySec: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  sortByBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#182550',
    paddingHorizontal: 10,
    marginRight: 5,
    borderRadius: 30,
    height: 35,
    marginTop: 10,
  },
  sortByBtnTxt: {
    color: '#182550',
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 5,
  },
  filterSec: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  cakeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginTop: 10,
  },
  cakeBoxTxt: {
    fontSize: 12,
    color: '#182550',
    marginTop: 20,
  },
  timeSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromTimeSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  fromTimeLabel: {
    fontSize: 14,
    color: '#182550',
    fontWeight: '800',
  },
  fromTimeBtn: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginLeft: 20,
    borderRadius: 4,
    width: 65,
  },
  fromTimeBtnTxt: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '300',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  cancelBtn: {
    width: '45%',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    height: 48,
  },
  cancelBtnTxt: {
    fontSize: 16,
    color: '#A6A6A6',
    fontWeight: '400',
  },
  doneBtn: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#79C54A',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
  },
  doneBtnTxt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default FilterScreen;
