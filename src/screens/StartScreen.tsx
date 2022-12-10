import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import BottomTabs from '../components/BottomTabs';
import ArrowIcon from './../../assets/images/arrow.svg';
import HeartIcon from './../../assets/images/heart.svg';
import BoxIcon from './../../assets/images/box3.svg';
import RightIcon from './../../assets/images/Chevron-right.svg';

interface StartProps {
  route: any;
  navigation: any;
}

const StartScreen = ({navigation}: StartProps) => {
  const productsList = [1, 2];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listsMain}>
        <View style={styles.selectedCityMain}>
          <TouchableOpacity style={styles.selectedCityBtn}>
            <ArrowIcon />
            <Text style={styles.selectedCityBtnTxt}>София-град</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectedCityBtn}>
            <Text style={styles.selectedCityBtnTxt}>Радиус: 2км</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lists}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}>
            <View style={styles.header}>
              <Text style={styles.headerTxt}>Най-нови локации</Text>
              <TouchableOpacity
                style={styles.results}
                onPress={() => navigation.navigate('LatestLOcation')}>
                <Text style={styles.resulTxt}>Виж всички </Text>
                <RightIcon width={9} height={15} />
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}>
                {productsList.map((val, i) => {
                  return (
                    <View style={styles.listProduct} key={i}>
                      <TouchableOpacity style={styles.discountBtn}>
                        <Text style={styles.discountBtnTxt}>-40%</Text>
                      </TouchableOpacity>
                      <ImageBackground
                        style={styles.listImageBackground}
                        borderTopLeftRadius={16}
                        borderTopRightRadius={16}
                        source={require('./../../assets/images/productIMage.png')}>
                        <View style={styles.listTopSec}>
                          <TouchableOpacity style={styles.favouritesIcon}>
                            <HeartIcon width={15} height={14} />
                          </TouchableOpacity>
                          <Text style={styles.productName}>Food Corner</Text>
                        </View>
                        <View style={styles.productItems}>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              палачинки
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              сандвичи
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>кафе</Text>
                          </View>
                        </View>
                        <View style={styles.priceSec}>
                          <Text style={styles.newPriceTxt}>7.00лв</Text>
                        </View>
                        <View style={styles.timeSec}>
                          <BoxIcon />
                          <Text style={styles.timeToOpenTxt}>
                            Остават 2 кутии
                          </Text>
                        </View>
                      </ImageBackground>
                      <View style={styles.listProductBottomSec}>
                        <Text style={styles.timeTxt}>
                          Вземи от 14:00ч. до 19:00ч.
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.header}>
              <Text style={styles.headerTxt}>Изтичат скоро</Text>
              <TouchableOpacity
                style={styles.results}
                onPress={() => navigation.navigate('LatestLOcation')}>
                <Text style={styles.resulTxt}>Виж всички </Text>
                <RightIcon width={9} height={15} />
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}>
                {productsList.map((val, i) => {
                  return (
                    <View style={styles.listProduct} key={i}>
                      <TouchableOpacity style={styles.discountBtn}>
                        <Text style={styles.discountBtnTxt}>-40%</Text>
                      </TouchableOpacity>
                      <ImageBackground
                        style={styles.listImageBackground}
                        borderTopLeftRadius={16}
                        borderTopRightRadius={16}
                        source={require('./../../assets/images/productIMage.png')}>
                        <View style={styles.listTopSec}>
                          <TouchableOpacity style={styles.favouritesIcon}>
                            <HeartIcon width={15} height={14} />
                          </TouchableOpacity>
                          <Text style={styles.productName}>Food Corner</Text>
                        </View>
                        <View style={styles.productItems}>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              палачинки
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              сандвичи
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>кафе</Text>
                          </View>
                        </View>
                        <View style={styles.priceSec}>
                          <Text style={styles.newPriceTxt}>7.00лв</Text>
                        </View>
                        <View style={styles.timeSec}>
                          <BoxIcon />
                          <Text style={styles.timeToOpenTxt}>
                            Остават 2 кутии
                          </Text>
                        </View>
                      </ImageBackground>
                      <View style={styles.listProductBottomSec}>
                        <Text style={styles.timeTxt}>
                          Вземи от 14:00ч. до 19:00ч.
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.header}>
              <Text style={styles.headerTxt}>Препоръчани за теб</Text>
              <TouchableOpacity
                style={styles.results}
                onPress={() => navigation.navigate('LatestLOcation')}>
                <Text style={styles.resulTxt}>Виж всички </Text>
                <RightIcon width={9} height={15} />
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                }}>
                {productsList.map((val, i) => {
                  return (
                    <View style={styles.listProduct} key={i}>
                      <TouchableOpacity style={styles.discountBtn}>
                        <Text style={styles.discountBtnTxt}>-40%</Text>
                      </TouchableOpacity>
                      <ImageBackground
                        style={styles.listImageBackground}
                        borderTopLeftRadius={16}
                        borderTopRightRadius={16}
                        source={require('./../../assets/images/productIMage.png')}>
                        <View style={styles.listTopSec}>
                          <TouchableOpacity style={styles.favouritesIcon}>
                            <HeartIcon width={15} height={14} />
                          </TouchableOpacity>
                          <Text style={styles.productName}>Food Corner</Text>
                        </View>
                        <View style={styles.productItems}>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              палачинки
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>
                              сандвичи
                            </Text>
                          </View>
                          <View style={styles.productItemsBox}>
                            <Text style={styles.productItemsBoxTxt}>кафе</Text>
                          </View>
                        </View>
                        <View style={styles.priceSec}>
                          <Text style={styles.newPriceTxt}>7.00лв</Text>
                        </View>
                        <View style={styles.timeSec}>
                          <BoxIcon />
                          <Text style={styles.timeToOpenTxt}>
                            Остават 2 кутии
                          </Text>
                        </View>
                      </ImageBackground>
                      <View style={styles.listProductBottomSec}>
                        <Text style={styles.timeTxt}>
                          Вземи от 14:00ч. до 19:00ч.
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
      <BottomTabs navigation={navigation} screenName="StartScreen" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  activeTab: {
    width: '50%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    elevation: 5,
    borderRadius: 6,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  tabTxt: {
    fontSize: 14,
  },

  selectedCityBtn: {
    backgroundColor: '#79C54A',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectedCityBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  selectedCityMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  filterSec: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
  },
  filterBtn: {
    width: 34,
    height: 30,
    backgroundColor: '#182550',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34 / 2,
  },
  filterTab: {
    height: 30,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: '#182550',
    marginLeft: 10,
  },
  filterTabTxt: {
    // color: '#182550',
    fontSize: 14,
  },
  listsMain: {
    flex: 1,
    backgroundColor: '#182550',
  },
  listSecMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '85%',
    alignSelf: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  input: {
    flex: 1,
    marginLeft: 5,
  },
  listSearchBtn: {},
  lists: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  headerTxt: {
    fontSize: 14,
    color: '#182550',
    fontWeight: '700',
  },
  results: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  resulTxt: {
    color: '#182550',
    fontSize: 12,
  },
  listImageBackground: {
    height: 114,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listProduct: {
    backgroundColor: '#FFFFFF',
    // height: 113,
    elevation: 10,
    borderRadius: 16,
    // marginTop: 35,
    width: 211,
    marginRight: 20,
  },
  favouritesIcon: {
    backgroundColor: '#00000070',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25 / 2,
  },
  listTopSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  productItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  productItemsBox: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  productItemsBoxTxt: {
    color: '#fff',
    fontSize: 10,
  },
  priceSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  oldPriceTxt: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '200',
  },
  newPriceTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  listProductBottomSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  timeSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTxt: {
    color: '#182550',
    fontSize: 11,
  },
  timeToOpenTxt: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 5,
  },
  discountBtn: {
    backgroundColor: '#79C54A',
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 25,
    borderRadius: 55 / 2,
    position: 'absolute',
    zIndex: 1,
    right: 10,
    top: -11,
  },
  discountBtnTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StartScreen;
