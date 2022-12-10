import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import SettingIcon from './../../assets/images/setting.svg';
import ProfileIcon from './../../assets/images/profile.svg';
import TrashIcon from './../../assets/images/trash.svg';
import BoxIcon from './../../assets/images/BOX-open.svg';
import SmokeIcon from './../../assets/images/smoke.svg';
import CompleteGift from './../../assets/images/completeGift.svg';
import PendingGift from './../../assets/images/pendingGift.svg';
import BottomTabs from '../components/BottomTabs';
import { AUTH_DATA_KEY, useAuth } from '../providers/AuthProvider';
import { useSelector } from 'react-redux';
import { FBRootState } from '../redux/store';
import { FBUser } from '../models/User';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthData } from '../models/AuthData';
import { UserRepository } from '../repositories/UserRepository';
import { restaurantInitialState } from '../redux/restaurant/reducer';
import { ordersInitialState } from '../redux/order/reducer';
import { userInitialState } from '../redux/user/reducer';
import { CONTACT_US_FACTORY, TERMS_AND_CONDITIONS_FACTORY } from '../network/Server';

interface ProfileProps {
  route: any;
  navigation: any;
}

const ProfileScreen = ({navigation}: ProfileProps) => {
  const {authData} = useAuth();
  const user = useSelector((state: FBRootState) => state.userState.user) as FBUser;
  const userLocale = useSelector((state: FBRootState) => state.userState.locale);

  const {signOut} = useAuth();

  console.log("authData", user);
  
  const [boxes, setBoxes] = useState([
    {
      des: 'Брой спасени кутии',
      number: '6',
      opened: true,
      icon: <BoxIcon />,
    },
    {
      des: 'Количество спасена храна',
      number: '4 кг',
      opened: false,
      icon: <TrashIcon />,
    },
    {
      des: 'Спестени СО2 емисии',
      number: '35 кг',
      opened: false,
      icon: <SmokeIcon />,
    },
    {
      des: 'Спестени пари за храна',
      number: '6',
      opened: false,
      icon: <BoxIcon />,
    },
  ]);

  const handleExit = () => {
    signOut();
    navigation.navigate('SelectLanguageScreen')
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Профил</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <SettingIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.profileMain}>
        <ScrollView contentContainerStyle={{paddingBottom: 30}}>
          <View style={styles.profileIconMain}>
            <ProfileIcon />
          </View>
          <Text style={styles.userNameTxt}>{user.firstName}</Text>
          <View style={{marginTop: 10}}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                paddingHorizontal: '5%',
                paddingVertical: 10,
              }}>
              {boxes.map((val, i) => {
                return (
                  <TouchableOpacity style={styles.box} key={i}>
                    {val.icon}
                    <Text style={styles.boxTxt1}>{val.des}</Text>
                    <Text style={styles.boxTxt2}>{val.number}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Text style={styles.levelTxt}>Достигнато ниво</Text>
            <Text style={styles.level}>Ангажиран милениъл</Text>
            <View style={styles.giftsIcon}>
              {boxes.map((val, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      val.opened ? styles.completeIcon : styles.pendingIcon,
                    ]}>
                    {val.opened ? <PendingGift /> : <CompleteGift />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.progressSec}>
              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFilled,
                    {width: '100%', backgroundColor: '#79C54A'},
                  ]}></View>
              </View>
              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFilled,
                    {width: '25%', backgroundColor: '#79C54A'},
                  ]}></View>
              </View>
              <View style={styles.progress}>
                <View style={styles.progressFilled}></View>
              </View>
              <View style={styles.progress}>
                <View style={styles.progressFilled}></View>
              </View>
              <View style={styles.progress}>
                <View style={styles.progressFilled}></View>
              </View>
            </View>
            <Text style={styles.openBoxTxt}>
              Спаси още 4 кутии, за да отключиш наградите, които{'\n'}те очакват
              на следващото ниво!
            </Text>
            <TouchableOpacity style={styles.exitBtn} onPress={handleExit} >
              <Text style={styles.exitBtnTxt}>Изход</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, {marginTop: 25}]} onPress={()=> {
                          const link = CONTACT_US_FACTORY[userLocale];
                          Linking.openURL(link);              
            }} >
              <Text style={styles.contactBtnTxt}>Свържи се с нас</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={()=>{
                          const link = TERMS_AND_CONDITIONS_FACTORY[userLocale];
                          Linking.openURL(link);
            }} >
              <Text style={styles.contactBtnTxt}>Общи условия</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomTabs navigation={navigation} screenName="ProfileScreen" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  headerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // marginTop: 10,
  },
  profileIconMain: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  userNameTxt: {
    textAlign: 'center',
    fontSize: 20,
    color: '#182550',
    marginTop: 25,
  },
  box: {
    backgroundColor: '#182550',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 105,
    borderRadius: 12,
    marginRight: 5,
  },
  boxTxt1: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
  boxTxt2: {
    color: '#79C54A',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 7,
    fontWeight: '800',
  },
  levelTxt: {
    color: '#A6A6A6',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 20,
  },
  level: {
    color: '#79C54A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    // marginTop: 5,
  },
  openBoxTxt: {
    color: '#182550',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 10,
    // width: '80%',
    // alignSelf: 'center',
  },
  exitBtn: {
    alignSelf: 'center',
    marginTop: 50,
  },
  exitBtnTxt: {
    color: '#CF4F4F',
  },
  contactBtn: {
    alignSelf: 'center',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#182550',
  },
  contactBtnTxt: {
    color: '#182550',
    fontSize: 12,
  },
  giftsIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
  },
  completeIcon: {
    backgroundColor: '#79C54A',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20 / 2,
    borderWidth: 1,
    borderColor: '#A6A6A6',
  },
  pendingIcon: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#A6A6A6',
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
  },
  progressSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
    marginTop: 15,
  },
  progress: {
    width: '19%',
    backgroundColor: '#F5F5F5',
    height: 5,
  },
  progressFilled: {
    // backgroundColor: '#79C54A',
    height: 5,
    borderRadius: 10,
    // width: '25%',
  },
});

export default ProfileScreen;
