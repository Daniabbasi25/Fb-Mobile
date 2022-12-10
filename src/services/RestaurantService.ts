import {BaseRestaurantRepository} from '../repositories/RestaurantRepository';
import {Restaurant, RestaurantHomeListItem} from '../models/Restaurant';
import moment from 'moment';
import {FBGeoLocation} from '../models/FBGeoLocation';
import getDistanceToLocation from '../utils/getDistanceToLocation';
import {FBBox} from '../models/FBBox';
import {translateText} from '../lang/translate';
import {DIET_TYPE, FOOD_TYPE} from '../models';
import {IntlShape} from 'react-intl/src/types';

class RestaurantService {
  restaurantRepository: BaseRestaurantRepository;

  constructor(params: {
    restaurantRepository: BaseRestaurantRepository
  }) {
    this.restaurantRepository = params.restaurantRepository;
  }

  static formatPickUpWindowDate(date: number) {
    return moment(date).format('HH:mm');
  }

  static isFinished(foodobox: FBBox): boolean {
    const now = new Date().getTime();
    return now > foodobox.pickUpTo;
  }

  static isStarted(foodobox: FBBox): boolean {
    const now = new Date().getTime();
    return now > foodobox.pickUpFrom;
  }

  static hasAvailability(foodobox: FBBox): boolean {
    return foodobox.quantity > 0;
  }

  static isOpen(foodobox: FBBox): boolean {
    return foodobox.isOpen;
  }

  static canCheckout(foodobox: FBBox): boolean {
    return !RestaurantService.isFinished(foodobox) && RestaurantService.hasAvailability(foodobox) && RestaurantService.isOpen(foodobox);
  }
  
  static getDietTypeText(box: FBBox, intl: IntlShape): string {
    return box.dietType ? translateText(intl, `filter.${DIET_TYPE[box.dietType].toLowerCase()}`) : '';
  }
  
  static getFoodTypeText(box: FBBox, intl: IntlShape): string {
    return box.foodType ? translateText(intl, `filter.${FOOD_TYPE[box.foodType].toLowerCase()}`) : '';
  }

  async getRestaurantsForHome(params: { userLocation: FBGeoLocation }): Promise<RestaurantHomeListItem[]> {
    const {userLocation} = params;

    const restaurants = await this.restaurantRepository.getAllWithProduct();
    let index = 0;

    return restaurants.reduce((acc: RestaurantHomeListItem[], r: Restaurant) => {
      // Since atm we can not handle displaying of more than 1 box per restaurant
      // we will just create as many "restaurants" as there are boxes

      for (const box of r.boxes) {
        // skip if price is not set
        if (!box.price) {
          continue;
        }

        const restaurantHomeListItem: RestaurantHomeListItem = {
          ...r,
          
          priceAfaterDiscount: box.discountedPrice,
          distance: getDistanceToLocation({
            userLocation: userLocation,
            location: {latitude: r.latitude, longitude: r.longitude},
          }),

          pickUpTo: box.pickUpTo,
          pickUpFrom: box.pickUpFrom,
          boxesCount: box.boxesCount,
          openTime: box.pickUpFrom,
          closeTime: box.pickUpTo,
          openStatus: box.isOpen,

          photoCover: r.coverImage,
          photoAvatar: r.avatarImage,

          products: [box],
          listIndex: index,
        };

        acc.push(restaurantHomeListItem);
        index++;
      }

      return acc;
    }, []);
  }

}

export {
  RestaurantService,
};
