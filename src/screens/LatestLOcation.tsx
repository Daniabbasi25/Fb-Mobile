import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
} from 'react-native';
import FilterIcon from './../../assets/images/filterIcon.svg';
import LeftIcon from './../../assets/images/chevron-left.svg';
import RefreshIcon from './../../assets/images/refresh.svg';
import HeartIcon from './../../assets/images/heart.svg';
import BoxIcon from './../../assets/images/box.svg';

interface LatestLOcationProps {
  route: any;
  navigation: any;
}

const LatestLOcation = ({navigation}: LatestLOcationProps) => {
  const filters = ['около мен', 'активни сега', 'любими', 'печива и сладкиши'];
  const productsList = [1, 2, 3, 4, 5, 6];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listsMain}>
        <View style={styles.listSecMain}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => navigation.goBack()}>
            <LeftIcon height={20} width={20} />
            <Text style={styles.headerTxt}>Най-нови локации</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <FilterIcon height={21} width={21} />
          </TouchableOpacity>
        </View>
        <View style={styles.lists}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}>
            <TouchableOpacity style={styles.results}>
              <RefreshIcon width={12} height={12} />
              <Text style={styles.resulTxt}> поднови резултатите</Text>
            </TouchableOpacity>
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
                    source={require('./../../assets/images/productImage1.png')}>
                    <View style={styles.listTopSec}>
                      <TouchableOpacity style={styles.favouritesIcon}>
                        <HeartIcon width={15} height={14} />
                      </TouchableOpacity>
                      <Text style={styles.productName}>Food Corner</Text>
                    </View>
                    <View style={styles.productItems}>
                      <View style={styles.productItemsBox}>
                        <Text style={styles.productItemsBoxTxt}>палачинки</Text>
                      </View>
                      <View style={styles.productItemsBox}>
                        <Text style={styles.productItemsBoxTxt}>сандвичи</Text>
                      </View>
                      <View style={styles.productItemsBox}>
                        <Text style={styles.productItemsBoxTxt}>кафе</Text>
                      </View>
                    </View>
                    <View style={styles.priceSec}>
                      <Text style={styles.oldPriceTxt}>12.50лв</Text>
                      <Text style={styles.newPriceTxt}>7.00лв</Text>
                    </View>
                  </ImageBackground>
                  <View style={styles.listProductBottomSec}>
                    <Text style={styles.timeTxt}>
                      Вземи от 14:00ч. до 19:00ч.
                    </Text>
                    <View style={styles.timeSec}>
                      <BoxIcon />
                      <Text style={styles.timeToOpenTxt}>Остават 2 кутии</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTxt: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 10,
  },
  lists: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    paddingHorizontal: '3%',
  },
  results: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  resulTxt: {
    color: '#182550',
    fontSize: 12,
  },
  listImageBackground: {
    height: 100,
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
    marginTop: 35,
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
    justifyContent: 'space-between',
    width: '40%',
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
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  timeSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTxt: {
    color: '#182550',
    fontWeight: '700',
    fontSize: 10,
  },
  timeToOpenTxt: {
    color: '#182550',
    fontWeight: '700',
    fontSize: 10,
    marginLeft: 5,
  },
  discountBtn: {
    backgroundColor: '#79C54A',
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 22,
    borderRadius: 55 / 2,
    position: 'absolute',
    zIndex: 1,
    right: 30,
    top: -11,
  },
  discountBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default LatestLOcation;
