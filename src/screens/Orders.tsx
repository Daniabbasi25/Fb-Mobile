import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import BottomTabs from '../components/BottomTabs';
import FilterIcon from './../../assets/images/filterIcon.svg';
import BoxIcon from './../../assets/images/box2.svg';
import RightIcon from './../../assets/images/Chevron-right.svg';
import PlusIcon from './../../assets/images/PLUS.svg';
import SavedIcon from './../../assets/images/savedOrderIcon.svg';
import CompletdOrderIcon from './../../assets/images/completedOrderIcon.svg';
import CanceledOrderIcon from './../../assets/images/canceledOrderImage.svg';
import ListOrders from './ListOrders';

interface OrdersProps {
  route: any;
  navigation: any;
}

const Orders = ({navigation}: OrdersProps) => {
  const [activeTab, setActiveTab] = useState('Активни поръчки');
  const orders = [
    {
      name: 'Food Corner',
      orderStartTime: 'Поръчка от днес 14:00ч.',
      orderImage: require('./../../assets/images/productIMage.png'),
      box: 'box 2 кутии',
      price: '14.00лв',
      pickUpTime: 'Вземи между 14:00ч. и 19:00ч.',
    },
    {
      name: 'Food Corner',
      orderStartTime: 'Поръчка от днес 14:00ч.',
      orderImage: require('./../../assets/images/productIMage.png'),
      box: 'box 2 кутии',
      price: '14.00лв',
      pickUpTime: 'Вземи между 14:00ч. и 19:00ч.',
    },
  ];

  const ProgressedOrders = [
    {
      name: 'Food Corner',
      orderStartTime: 'Поръчка от днес 14:00ч.',
      orderImage: require('./../../assets/images/productIMage.png'),
      box: 'box 2 кутии',
      price: '14.00лв',
      pickUpTime: 'Спасена кутия',
      orderStatus: 'saved',
    },
    {
      name: 'Food Corner',
      orderStartTime: 'Поръчка от днес 14:00ч.',
      orderImage: require('./../../assets/images/productIMage.png'),
      box: 'box 2 кутии',
      price: '14.00лв',
      pickUpTime: 'Завършена поръчка',
      orderStatus: 'completed',
    },
    {
      name: 'Food Corner',
      orderStartTime: 'Поръчка от днес 14:00ч.',
      orderImage: require('./../../assets/images/productIMage.png'),
      box: 'box 2 кутии',
      price: '14.00лв',
      pickUpTime: 'Отменена поръчка',
      orderStatus: 'canceled',
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Поръчки</Text>
        <TouchableOpacity>
          <FilterIcon width={21} height={21} />
        </TouchableOpacity>
      </View>
      <View style={styles.ordersMain}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('Активни поръчки')}>
            <Text
              style={[
                styles.tabTxt,
                activeTab === 'Активни поръчки'
                  ? {color: '#182550'}
                  : {color: '#A6A6A6'},
              ]}>
              Активни поръчки
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('Завършени поръчки')}>
            <Text
              style={[
                styles.tabTxt,
                activeTab === 'Завършени поръчки'
                  ? {color: '#182550'}
                  : {color: '#A6A6A6'},
              ]}>
              Завършени поръчки
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: 100}}>
          {activeTab === 'Активни поръчки' ? (
            <View>
              {orders.map((val, i) => {
                return (
                  <View style={styles.orderCard} key={i}>
                    <Image source={val.orderImage} style={styles.orderImage} />
                    <View style={{flex: 1, marginLeft: 13}}>
                      <Text style={styles.orderName}>{val.name}</Text>
                      <Text style={styles.orderStartTime}>
                        {val.orderStartTime}
                      </Text>
                      <View style={styles.priceSec}>
                        <View style={styles.boxSec}>
                          <BoxIcon />
                          <Text style={styles.boxTxt}>{val.box}</Text>
                        </View>
                        <Text style={styles.price}>{val.price}</Text>
                      </View>
                      <Text style={styles.pickUpTime}>{val.pickUpTime}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.rightBtn}
                      onPress={() => navigation.navigate('OrderDetailScreen')}>
                      <RightIcon />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}

          {activeTab === 'Завършени поръчки' ? (
            <View>
              {ProgressedOrders.map((val, i) => {
                return (
                  <View style={styles.orderCard} key={i}>
                    <TouchableOpacity style={styles.statusBtn}>
                      {val.orderStatus === 'saved' ? <SavedIcon /> : null}
                      {val.orderStatus === 'completed' ? (
                        <CompletdOrderIcon />
                      ) : null}
                      {val.orderStatus === 'canceled' ? (
                        <CanceledOrderIcon />
                      ) : null}
                    </TouchableOpacity>

                    <Image source={val.orderImage} style={styles.orderImage} />
                    <View style={{flex: 1, marginLeft: 13}}>
                      <Text style={styles.orderName}>{val.name}</Text>
                      <Text style={styles.orderStartTime}>
                        {val.orderStartTime}
                      </Text>
                      <View style={styles.priceSec}>
                        <View style={styles.boxSec}>
                          <BoxIcon />
                          <Text style={styles.boxTxt}>{val.box}</Text>
                        </View>
                        <Text style={styles.price}>{val.price}</Text>
                      </View>
                      <Text
                        style={[
                          styles.pickUpTime,
                          val.orderStatus === 'canceled'
                            ? {color: '#CF4F4F'}
                            : null,
                        ]}>
                        {val.pickUpTime}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn}>
                      <RightIcon />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}
          <TouchableOpacity style={styles.toTheResultBtn}>
            <Text style={styles.toTheResultBtnTXt}>Направи нова поръчка</Text>
            <PlusIcon />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <BottomTabs navigation={navigation} screenName="Orders" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182550',
    // borderWidth: 1,
  },
  ordersMain: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    paddingVertical: 20,
  },
  headerTxt: {
    color: '#fff',
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tabTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  tab: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCard: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: 25,
    borderRadius: 16,
    elevation: 5,
  },
  orderImage: {
    height: 104,
    width: 112,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  orderName: {
    color: '#182550',
    fontSize: 18,
    fontWeight: '800',
  },
  orderStartTime: {
    color: '#A6A6A6',
    fontSize: 11,
  },
  priceSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  boxSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxTxt: {
    fontSize: 11,
    color: '#000000',
    marginLeft: 5,
    fontWeight: '700',
  },
  price: {
    color: '#182550',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 15,
  },
  pickUpTime: {
    fontSize: 10,
    color: '#79C54A',
    fontWeight: '700',
    marginTop: 5,
  },
  rightBtn: {
    backgroundColor: '#CCCCCC14',
    height: 104,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  toTheResultBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#79C54A',
    height: 48,
    borderRadius: 8,
    marginTop: 30,
    flexDirection: 'row',
  },
  toTheResultBtnTXt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 5,
  },
  statusBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 30,
  },
});

export default Orders;
