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
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import ClusteredMapView from '../components/Home/clusteredMapView';
import {RestaurantHomeListItem} from '../models/Restaurant';
import HeartIcon from './../../assets/images/heart.svg';
import BackIcon from './../../assets/images/chevron-left.svg';
import ClockIcon from './../../assets/images/clock.svg';
import CallIcon from './../../assets/images/phone.svg';
import LocationIcon from './../../assets/images/location.svg';
import BoxIcon from './../../assets/images/box2.svg';
import CartIcon from './../../assets/images/shopping-cart.svg';
import CloseIcon from './../../assets/images/close.svg';
import CashPaymentIcon from './../../assets/images/cashPayment.svg';
import JumpingIcon from './../../assets/images/jumpingMascot.svg';
import MoscatIcon from './../../assets/images/showingMascot.svg';

interface ProductDetailProps {
  route: any;
  navigation: any;
}

const ProductDetail = ({navigation}: ProductDetailProps) => {
  const [activeTab, setActiveTab] = useState('Съдържание');
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [fourthModal, setFourthModal] = useState(false);
  const [fifthModal, setFifthModal] = useState(false);
  const [itemNumber, setItemNumber] = useState(1);
  const [cashPayment, setCashPayment] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantHomeListItem | undefined
  >(undefined);
  const foodPhotos = [1, 2, 3, 4, 5, 6];
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.listImageBackground}
        source={require('./../../assets/images/productIMage.png')}>
        <View style={styles.listTopSec}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <BackIcon />
            <Text style={styles.backBtnTxt}>Назад</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favouritesIcon}>
            <HeartIcon width={15} height={14} />
          </TouchableOpacity>
        </View>
        <Text style={styles.productName}>Food Corner</Text>
        <View style={styles.timerBtn}>
          <Text style={styles.timerBtnTxt1}>Офертата започва след</Text>
          <Text style={styles.timerBtnTxt2}> 04:46:07</Text>
        </View>
      </ImageBackground>

      <View style={styles.listsMain}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.productDetailsMain}>
            <View>
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
              <TouchableOpacity
                style={styles.reviewSec}
                onPress={() => setFifthModal(true)}>
                <Rating
                  type="custom"
                  readonly
                  ratingColor="#182550"
                  startingValue={4.5}
                  ratingBackgroundColor="#fff"
                  ratingCount={5}
                  imageSize={15}
                  style={{paddingVertical: 0}}
                />
                <Text style={styles.ratingTxt}>4.5 / 5.0</Text>
                <Text style={styles.totalRatingTxt}> (35 оценки)</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.discountBtn}>
              <Text style={styles.discountBtnTxt}>-40%</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.boxSec}>
            <BoxIcon />
            <Text style={styles.boxSecTxt}>Остават 2 кутии</Text>
          </View>
          <View style={[styles.clockSec, {marginTop: 30}]}>
            <ClockIcon />
            <Text style={styles.clockTxt1}>
              Прозорец за вземане:{' '}
              <Text style={styles.clockTxt2}>16:30 - 17:30</Text>
            </Text>
          </View>
          <View style={styles.clockSec}>
            <CallIcon />
            <Text style={styles.clockTxt1}>
              Телефон за връзка:{' '}
              <Text style={styles.clockTxt2}>+359 885 45 48 23</Text>
            </Text>
          </View>
          <View style={styles.clockSec}>
            <LocationIcon />
            <Text style={styles.clockTxt1}>
              Адрес:{' '}
              <Text style={styles.clockTxt2}>
                ул. “Бели Дунав” 10, София,{'\n'} България
              </Text>
            </Text>
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
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab('Снимки')}>
                <Text
                  style={[
                    styles.tabTxt,
                    activeTab === 'Снимки'
                      ? {color: '#182550'}
                      : {color: '#A6A6A6'},
                  ]}>
                  Снимки
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
            {activeTab === 'Снимки' ? (
              <View>
                <View style={styles.productPhotoSec}>
                  {foodPhotos.map((val, i) => {
                    return (
                      <Image
                        source={require('./../../assets/images/foodPhoto.png')}
                        style={styles.productPhoto}
                        key={i}
                      />
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
          <Text style={styles.initialPriceTxt}>
            първоначална цена:{' '}
            <Text style={styles.initialPriceValue}>12.50лв</Text>
          </Text>
          <Text style={styles.foodPriceTxt}>foodObox цена: 7.00лв</Text>
          <TouchableOpacity
            style={styles.toTheResultBtn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.toTheResultBtnTXt}>Поръчай</Text>
            <CartIcon />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalHeading}>
              Кутия с пица и салата от Food Corner
            </Text>
            <Text style={styles.addressLabel}>Адрес на заведението</Text>
            <Text
              style={[
                styles.addressTxt,
                {borderBottomWidth: 1, borderBottomColor: '#182550'},
              ]}>
              ул. “Бели Дунав” 10, София, България
            </Text>
            <View
              style={{
                height: 63,
                width: '100%',
                marginTop: 10,
                borderRadius: 10,
              }}>
              <TouchableOpacity style={styles.seeloctionBtn}>
                <Text style={styles.seeloctionTxt}>Виж локацията</Text>
              </TouchableOpacity>
              <ClusteredMapView zoomOnRestaurant={selectedRestaurant} />
            </View>

            <Text style={styles.addressLabel}>Час за вземане</Text>
            <Text style={styles.addressTxt}>от 16:30 до 17:30 </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
                setSecondModal(true);
              }}>
              <Text style={styles.buttonTxt}>Продължи с поръчката</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModal}
        onRequestClose={() => {
          setSecondModal(!secondModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSecondModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.secondModalHeading}>Food Corner</Text>
            <View style={styles.incAndDecSec}>
              <TouchableOpacity style={styles.increaseBtn}>
                <Text style={styles.minusTxt}>-</Text>
              </TouchableOpacity>
              <Text style={styles.itemNumberTxt}>{itemNumber} кутии</Text>
              <TouchableOpacity style={styles.decreaseBtn}>
                <Text style={styles.minusTxt}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.totalPaymentSec, {marginTop: 20}]}>
              <Text style={styles.totalPaymentLabel}>Обща сума</Text>
              <Text style={styles.totalPayment}>14.00лв</Text>
            </View>
            <View style={styles.totalPaymentSec}>
              <Text style={styles.saveTxt}>Ти спестяваш</Text>
              <Text style={styles.saveTxt}>10.00лв</Text>
            </View>
            <TouchableOpacity
              style={styles.cashPaymentSec}
              onPress={() => setCashPayment(!cashPayment)}>
              <CashPaymentIcon />
              <Text style={styles.cashPaymentTxt}>плащане в брой</Text>
              <View style={styles.cashPaymentCheck}>
                {cashPayment ? (
                  <View style={styles.cashPaymentCheckFilled}></View>
                ) : null}
              </View>
            </TouchableOpacity>
            <View style={styles.voucherSec}>
              <TextInput
                placeholder="Ваучер или промо код"
                style={styles.voucherInput}
              />
              <TouchableOpacity style={styles.voucherBtn}>
                <Text style={styles.voucherBtnTxt}>Приложи</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSecondModal(false);
                setFourthModal(true);
              }}>
              <Text style={styles.buttonTxt}>Завърши поръчката</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={thirdModal}
        onRequestClose={() => {
          setThirdModal(!thirdModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setThirdModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <JumpingIcon />
            <Text style={[styles.modalHeading, {marginTop: 10}]}>
              Успешна поръчка!
            </Text>
            <Text style={styles.desTxt}>
              Благодаря ти, че избра да спасиш храна с FoodOBox! Вземи кутията
              изненада на място в обекта.
            </Text>
          </View>
        </View>
      </Modal>

      {/* NO REGISTER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fourthModal}
        onRequestClose={() => {
          setFourthModal(!fourthModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFourthModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <MoscatIcon />
            <Text style={[styles.modalHeading, {marginTop: 10}]}>
              Регистрирай се!
            </Text>
            <Text style={styles.desTxt}>
              За да направиш поръчка през Foodobox, трябва първо да създадеш
              персонален профил.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setFourthModal(false);
                navigation.navigate('SignUpScreen');
              }}>
              <Text style={styles.buttonTxt}>Създай профил</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RATING MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fifthModal}
        onRequestClose={() => {
          setFifthModal(!fourthModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFifthModal(false)}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={[styles.modalHeading, {marginTop: 5, fontSize: 12}]}>
              Качество на храната
            </Text>
            <Rating
              type="custom"
              readonly
              ratingColor="#79C54A"
              startingValue={3}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={15}
              style={{paddingVertical: 0, width: '100%', marginTop: 5}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              Отношение на персонала
            </Text>
            <Rating
              type="custom"
              readonly
              ratingColor="#79C54A"
              startingValue={3}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={15}
              style={{paddingVertical: 0, width: '100%', marginTop: 5}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              Количество на храната
            </Text>
            <Rating
              type="custom"
              readonly
              ratingColor="#79C54A"
              startingValue={3}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={15}
              style={{paddingVertical: 0, width: '100%', marginTop: 5}}
            />
            <Text style={[styles.modalHeading, {marginTop: 20, fontSize: 12}]}>
              Бързина на обслужване
            </Text>
            <Rating
              type="custom"
              readonly
              ratingColor="#79C54A"
              startingValue={3}
              ratingBackgroundColor="#fff"
              ratingCount={5}
              imageSize={15}
              style={{paddingVertical: 0, width: '100%', marginTop: 5}}
            />
          </View>
        </View>
      </Modal>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listsMain: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    marginTop: -100,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  listImageBackground: {
    height: 309,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listProduct: {
    backgroundColor: '#FFFFFF',
    elevation: 10,
    borderRadius: 16,
  },
  favouritesIcon: {
    backgroundColor: '#00000070',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42 / 2,
  },
  listTopSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productName: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  productItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productItemsBox: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#182550',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  productItemsBoxTxt: {
    color: '#182550',
    fontSize: 10,
  },
  discountBtn: {
    backgroundColor: '#79C54A',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
  },
  discountBtnTxt: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  backBtnTxt: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBtn: {
    backgroundColor: '#182550',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    height: 25,
    marginTop: 10,
  },
  timerBtnTxt1: {
    color: '#fff',
  },
  timerBtnTxt2: {
    color: '#fff',
    fontWeight: '700',
    // textDecorationLine: 'line-through',
  },
  productDetailsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reviewSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  totalRatingTxt: {
    color: '#A6A6A6',
    fontSize: 12,
    marginLeft: 2,
  },
  ratingTxt: {
    color: '#182550',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  boxSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    borderColor: '#79C54A',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    height: 25,
  },
  boxSecTxt: {
    color: '#182550',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
  },
  clockSec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  clockTxt1: {
    color: '#182550',
    fontSize: 14,
    marginLeft: 10,
  },
  clockTxt2: {
    color: '#182550',
    fontSize: 14,
    fontWeight: '700',
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
    justifyContent: 'space-between',
  },
  tabTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  tab: {
    // borderWidth: 1,
    paddingHorizontal: 5,
  },
  tabContentTxt: {
    marginTop: 10,
    color: '#182550',
    fontSize: 12,
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
  foodPriceTxt: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#79C54A',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalHeading: {
    textAlign: 'center',
    color: '#182550',
    fontSize: 16,
    fontWeight: '800',
    width: '70%',
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  addressLabel: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addressTxt: {
    fontSize: 14,
    color: '#182550',
    fontWeight: '700',

    marginTop: 5,
  },
  seeloctionBtn: {
    backgroundColor: '#1E1E1E80',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
    right: 5,
    height: 19,
    width: 96,
    borderRadius: 4,
  },
  seeloctionTxt: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  secondModalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  incAndDecSec: {
    backgroundColor: '#F3F3F3',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 172,
    justifyContent: 'space-between',
    height: 43,
    borderRadius: 172 / 2,
    elevation: 5,
    marginTop: 25,
  },
  increaseBtn: {
    backgroundColor: '#79C54A',
    height: 43,
    width: 41,
    borderTopLeftRadius: 43 / 2,
    borderBottomLeftRadius: 43 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseBtn: {
    backgroundColor: '#A6A6A6',
    height: 43,
    width: 41,
    borderTopRightRadius: 43 / 2,
    borderBottomRightRadius: 43 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusTxt: {
    fontSize: 25,
    color: '#fff',
  },
  itemNumberTxt: {
    fontSize: 18,
    color: '#182550',
    fontWeight: '800',
  },
  totalPaymentSec: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '70%',
    marginTop: 3,
  },
  totalPaymentLabel: {
    fontSize: 11,
    color: '#182550',
    fontWeight: '600',
  },
  totalPayment: {
    color: '#79C54A',
    fontSize: 18,
    fontWeight: '800',
  },
  saveTxt: {
    color: '#A6A6A6',
    fontSize: 12,
    fontWeight: '700',
  },
  cashPaymentSec: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  cashPaymentTxt: {
    fontSize: 11,
    color: '#000000',
    marginLeft: 10,
    flex: 1,
  },
  cashPaymentCheck: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#15171F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashPaymentCheckFilled: {
    width: 10,
    height: 10,
    backgroundColor: '#15171F',
    borderRadius: 10 / 2,
  },
  voucherSec: {
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A6A6A6',
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: 40,
  },
  voucherBtn: {
    backgroundColor: '#A6A6A6',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 15,
  },
  voucherInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  voucherBtnTxt: {
    color: '#fff',
    fontSize: 14,
  },
  desTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#182550',
    marginTop: 14,
    width: '80%',
  },
});

export default ProductDetail;
