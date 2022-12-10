import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ObjectIcon from './../../assets/images/objects.svg';
import OrdersIcon from './../../assets/images/orders.svg';
import HeartIcon from './../../assets/images/heart.svg';
import DashboardIcon from './../../assets/images/dashboard.svg';
import UserIcon from './../../assets/images/user.svg';

const BottomTabs = (props: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Objects')}
        style={[
          props.screenName === 'Objects'
            ? styles.activeTab
            : styles.inactiveTab,
        ]}>
        <ObjectIcon />
        {props.screenName === 'Objects' ? (
          <Text style={styles.activeTabTxt}>обекти</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Orders')}
        style={[
          props.screenName === 'Orders' ? styles.activeTab : styles.inactiveTab,
        ]}>
        <OrdersIcon />
        {props.screenName === 'Orders' ? (
          <Text style={styles.activeTabTxt}>поръчки</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('StartScreen')}
        style={[
          props.screenName === 'StartScreen'
            ? styles.activeTab
            : styles.inactiveTab,
        ]}>
        <DashboardIcon />
        {props.screenName === 'StartScreen' ? (
          <Text style={styles.activeTabTxt}>начало</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('LovedOnes')}
        style={[
          props.screenName === 'LovedOnes'
            ? styles.activeTab
            : styles.inactiveTab,
        ]}>
        <HeartIcon />
        {props.screenName === 'LovedOnes' ? (
          <Text style={styles.activeTabTxt}>любими</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('ProfileScreen')}
        style={[
          props.screenName === 'ProfileScreen'
            ? styles.activeTab
            : styles.inactiveTab,
        ]}>
        <UserIcon />
        {props.screenName === 'ProfileScreen' ? (
          <Text style={styles.activeTabTxt}>профил</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#182550',
    height: 64,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 32,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  inactiveTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
  activeTabTxt: {
    color: '#fff',
    marginLeft: 5,
  },
  activeTab: {
    backgroundColor: '#79C54A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 107,
    borderRadius: 107 / 2,
  },
});

export default BottomTabs;
