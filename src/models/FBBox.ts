import {scheduleFloatToDate} from '../utils/scheduleFloatToDate';
import roundToDecimal from '../utils/roundToDecimal';
import {BE_CURRENCY_TO_CURRENCY_MAPPER, CURRENCY, DIET_TYPE, FOOD_TYPE} from './index';

export interface FBBox {
  id: number;
  restaurantId: number;

  name: string;
  summary: string;
  isActive: boolean;

  price: number;
  currency: CURRENCY;
  discount: number;
  quantity: number; // available boxes for offer
  discountedPrice: number; // TODO: this should not be on the interface

  thumbnailPhoto: string;
  photo: string;

  foodType: null | FOOD_TYPE;
  dietType: null | DIET_TYPE;
  allergenes: string[]; // TODO: fix typo and add type

  // schedule
  isOpen: boolean;
  pickUpTo: number;
  pickUpFrom: number;
  boxesCount: number; // total boxes
}

const FBBoxMapper = {
  fromApi: (fb: any): FBBox => {
    let foodType = null;
    if (fb.foodType in FOOD_TYPE) {
      foodType = fb.foodType;
    }

    let dietType = null;
    if (fb.dietType in DIET_TYPE) {
      dietType = fb.dietType;
    }

    const defaultPickUpTo = new Date();
    defaultPickUpTo.setHours(23, 59);
    const defaultPickUpFrom = new Date();
    defaultPickUpFrom.setHours(0, 0);
    
    let currency = CURRENCY.BGN;
    if (fb.currency in BE_CURRENCY_TO_CURRENCY_MAPPER) {
      currency = BE_CURRENCY_TO_CURRENCY_MAPPER[fb.currency];
    }

    const box: FBBox = {
      id: fb.id,
      restaurantId: fb.restaurantId,

      name: fb.name,
      summary: fb.summary,
      isActive: !!fb.isActive,

      price: fb.price,
      currency: currency,
      discount: fb.discount,
      quantity: fb.quantity,
      discountedPrice: roundToDecimal(fb.price - fb.price * fb.discount / 100),

      thumbnailPhoto: fb.photo,
      photo: fb.originalPhoto,

      foodType: foodType,
      dietType: dietType,
      allergenes: JSON.parse(fb.allergenes),

      isOpen: fb.todaysSchedule.open,
      pickUpTo: fb.todaysSchedule.pickUpTo ? scheduleFloatToDate(fb.todaysSchedule.pickUpTo) : defaultPickUpTo.getTime(),
      pickUpFrom: fb.todaysSchedule.pickUpFrom ? scheduleFloatToDate(fb.todaysSchedule.pickUpFrom) : defaultPickUpFrom.getTime(),
      boxesCount: fb.todaysSchedule.boxesCount,

    };

    return box;
  },
};

export {
  FBBoxMapper,
};
