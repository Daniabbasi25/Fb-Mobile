import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Image,
  Share,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import ClockIcon from './../../assets/images/clockOutline.svg';
import GiftIcon from './../../assets/images/gift.svg';
import DollarIcon from './../../assets/images/dollar.svg';
import PartyHorn from './../../assets/images/party-horn.svg';
import CloseIcon from './../../assets/images/close.svg';
import JumpingIcon from './../../assets/images/jumpingMascot.svg';
import ExcitedIcon from './../../assets/images/excitedMascot.svg';
import ShareIcon from './../../assets/images/shareIcon.svg';

interface OrderDetailProps {
  route: any;
  navigation: any;
}

const SaveOrderScreen = ({navigation, route}: OrderDetailProps) => {
  let {uri} = route.params;
  const [activeTab, setActiveTab] = useState('Съдържание');
  const [cancelOrderSatus, setCancelOrderSatus] = useState(false);

  const ShareFunc = async () => {
    const result = await Share.share({
      message:
        'React Native | A framework for building native apps using React',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listsMain}>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>
            Поръчка от 12/06/2022 в 14:30
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>
            Кутия с пица и салата от Food Corner
          </Text>
          <Text style={styles.addressTxt1}>
            Адрес:{'   '}
            <Text
              style={[styles.addressTxt1, {textDecorationLine: 'underline'}]}>
              ул. “Бели Дунав” 10, София, България
            </Text>
          </Text>
          <Text style={styles.addressTxt1}>
            Телефон:{'   '}
            <Text
              style={[styles.addressTxt1, {textDecorationLine: 'underline'}]}>
              +359 885 00 42 43
            </Text>
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <ExcitedIcon />
            <Text style={styles.heading2}>Кутията е спасена!</Text>
            <View style={styles.ratingSec}>
              <Text style={styles.reviewTxt}>Твоята оценка:</Text>
              <Rating
                type="custom"
                readonly
                ratingColor="#182550"
                startingValue={4}
                ratingBackgroundColor="#fff"
                ratingCount={5}
                imageSize={12}
                style={{paddingVertical: 0}}
              />
            </View>
          </View>
          <View style={styles.shareBtn}>
            <Image source={{uri: route.params.uri}} style={styles.shareIMage} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.toTheResultBtn}
              onPress={() => ShareFunc()}>
              <ShareIcon />
              <Text style={styles.toTheResultBtnTXt}>Сподели с приятели</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.orderDetailsSec]}>
            <View style={[styles.clockSec, {marginTop: 15}]}>
              <GiftIcon />
              <Text style={styles.clockTxt1}>
                Количество: <Text style={styles.clockTxt2}>2 кутии</Text>
              </Text>
            </View>
            <View style={[styles.clockSec, {marginTop: 7}]}>
              <DollarIcon />
              <Text style={styles.clockTxt1}>
                Сума за плащане: <Text style={styles.clockTxt2}>14.00лв</Text>
              </Text>
            </View>
            <View style={[styles.clockSec, {marginTop: 7}]}>
              <PartyHorn />
              <Text style={styles.clockTxt1}>
                Ти спести: <Text style={styles.clockTxt2}>12.00лв</Text>
              </Text>
            </View>
          </View>

          <View style={styles.tabsBox}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab('Съдържание')}>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === 'Съдържание'
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  Съдържание
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab('Алергени')}>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === 'Алергени'
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  Алергени
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === 'Съдържание' ? (
              <View>
                <Text style={styles.tabContentTxt}>
                  В твоята FoodObox изненада най-често ще откриеш вкусни торти,
                  еклери, турска баклава, кадаиф, тулумби или сладки.{'\n'}
                  {'\n'} Ако не всичко е по вкуса ти, сподели със семейството и
                  приятелите си. Споделената храна е по-сладка! :)
                </Text>
              </View>
            ) : null}
            {activeTab === 'Алергени' ? (
              <View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>Яйца</Text>
                  <Text style={styles.allergensContentTxt}>
                    Млечни продукти
                  </Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>Ядки</Text>
                  <Text style={styles.allergensContentTxt}>Глутен</Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>Фъстъци</Text>
                </View>
                <View style={styles.allergensContentSec}>
                  <Text style={styles.allergensContentTxt}>Сусам</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>

      <StatusBar
        backgroundColor="#ffff"
        translucent={false}
        barStyle="dark-content"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listsMain: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  heading: {
    color: '#A6A6A6',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
    width: '90%',
  },
  heading2: {
    fontSize: 20,
    color: '#182550',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 15,
  },
  orderDetailsSec: {
    // padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  orderDetailsHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#182550',
  },
  clockSec: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockTxt1: {
    color: '#A6A6A6',
    fontSize: 14,
    marginLeft: 10,
  },
  clockTxt2: {
    color: '#A6A6A6',
    fontSize: 12,
    marginLeft: 5,
  },
  tabsBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  tab: {
    // borderWidth: 1,
    paddingHorizontal: 5,
    width: '40%',
  },
  tabContentTxt: {
    marginTop: 10,
    color: '#182550',
    fontSize: 12,
  },
  shareBtn: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  shareIMage: {
    width: 70,
    height: 70,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  toTheResultBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#79C54A',
    height: 70,
    flexDirection: 'row',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
  },
  toTheResultBtnTXt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 10,
  },
  initialPriceTxt: {
    color: '#A6A6A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
  },
  initialPriceValue: {
    color: '#A6A6A6',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },

  allergensContentSec: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  allergensContentTxt: {
    fontSize: 12,
    color: '#182550',
    width: '35%',
  },
  productPhoto: {
    width: 94,
    height: 92,
  },
  productPhotoSec: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerHeading: {
    color: '#182550',
    fontSize: 14,
  },
  addressTxt1: {
    color: '#A6A6A6',
    fontSize: 12,
    marginTop: 5,
  },
  ratingSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reviewTxt: {
    color: '#182550',
    fontSize: 12,
    marginRight: 5,
  },
});

export default SaveOrderScreen;
