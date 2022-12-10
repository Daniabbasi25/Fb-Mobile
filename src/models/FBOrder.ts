import {FBUserVoucher} from './FBUserVoucher';
import {scheduleFloatToDate} from '../utils/scheduleFloatToDate';
import moment from 'moment';
import roundToDecimal from '../utils/roundToDecimal';
import {BE_CURRENCY_TO_CURRENCY_MAPPER, CURRENCY} from './index';

export interface FBOrder {
  id: number;
  boxId: number;
  boxName: string;
  boxPickUpFrom: number;
  boxPickUpTo: number;
  boxPhoto: string;
  boxOriginalPrice: number;
  boxDiscount: number;
  restaurantName: string;
  restaurantId: number;
  restaurantAddress: string;
  restaurantLongitude: number;
  restaurantLatitude: number;
  restaurantPhoneNumber: string;
  createdAt: number;
  status: number; // TODO: refactor
  numberOfCheckoutBoxes: number;
  pin: string;
  totalAmount: number;
  currency: CURRENCY;
  promoCode: FBUserVoucher | null;
  promoAmount: number | null;
  promoDetails: string | null;
}

export const FBOrderSortKey: keyof FBOrder = 'createdAt';

export const FBOrderMapper = {
  fromApi: (fborder: any): FBOrder => {
    const createdAt = moment(fborder.createdAt).toDate();

    let currency = CURRENCY.BGN;
    if (fborder.currency in BE_CURRENCY_TO_CURRENCY_MAPPER) {
      currency = BE_CURRENCY_TO_CURRENCY_MAPPER[fborder.currency];
    }
    
    return {
      id: fborder.orderId,
      boxId: fborder.productId,
      boxName: fborder.productName,
      boxPickUpFrom: scheduleFloatToDate(fborder.todaysSchedule.pickUpFrom, createdAt),
      boxPickUpTo: scheduleFloatToDate(fborder.todaysSchedule.pickUpTo, createdAt),
      boxPhoto: fborder.productPhoto,
      boxOriginalPrice: fborder.boxOriginalPrice,
      boxDiscount: fborder.boxDiscount,
      numberOfCheckoutBoxes: fborder.quantity,
      status: fborder.status,
      pin: fborder.pin,
      totalAmount: roundToDecimal(fborder.totalPrice),
      currency: currency,
      createdAt: createdAt.getTime(),
      restaurantName: fborder.restaurantName,
      restaurantId: fborder.restaurantId,
      restaurantAddress: fborder.restaurantAddress,
      restaurantLongitude: fborder.restaurantLongitude,
      restaurantLatitude: fborder.restaurantLatitude,
      restaurantPhoneNumber: fborder.restaurantPhoneNumber,
      promoCode: fborder.voucherCode,
      promoAmount: fborder.promoPrice,
      promoDetails: fborder.voucherDetails,
    };
  },
};
