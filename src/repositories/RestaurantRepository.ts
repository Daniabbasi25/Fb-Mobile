import {Restaurant, RestaurantMapper} from '../models/Restaurant';
import axiosClient from '../network/axiosClient';
import {FBBaseError} from '../common/FBBaseError';
import {AuthData} from '../models/AuthData';

interface getRestaurantsWithProductResponse {
  success: boolean,
  restaurants: object[]
}

class RestaurantRepositoryError extends FBBaseError {
}

export interface BaseRestaurantRepository {
  getAllWithProduct(): Promise<Restaurant[]>;
}

class RestaurantRepository implements BaseRestaurantRepository {
  private authData: AuthData;

  constructor(params: {
    authData: AuthData
  }) {
    this.authData = params.authData;
  }

  public async getAllWithProduct(): Promise<Restaurant[]> {
    const url = '/user/restaurants?getProducts=true';
    
    const response: getRestaurantsWithProductResponse = await axiosClient.get(url, {
      headers: {
        'x-access-token': this.authData.userToken,
      },
    });
    try {
      return response.restaurants.map((r: any) => RestaurantMapper.fromApi(r));
    } catch (e) {
      console.log(e);
      throw e;
    }
    
  }
}

export {
  RestaurantRepositoryError,
  RestaurantRepository,
};
