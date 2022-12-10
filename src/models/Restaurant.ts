import {FBBox, FBBoxMapper} from './FBBox';

export interface Restaurant {
  id: number;
  companyId: number;

  name: string;
  summary: string;
  isActive: boolean;

  address: string;
  phoneNumber: string;
  longitude: number;
  latitude: number;

  thumbnailCoverImage: string;
  thumbnailAvatarImage: string;
  coverImage: string;
  avatarImage: string;

  businessType: string; // TODO: add type
  boxes: FBBox[];
}

// TODO: remove this bullshit
export interface RestaurantHomeListItem extends Restaurant {
  priceAfaterDiscount: number;
  distance: number;

  pickUpTo: number;
  pickUpFrom: number;
  boxesCount: number;
  openTime: number;
  closeTime: number;
  openStatus: boolean;

  photoCover: string;
  photoAvatar: string;

  products: FBBox[],
  listIndex: number
}

const RestaurantMapper = {
  fromApi: (r: any): Restaurant => {
    return {
      id: r.id,
      companyId: r.companyId,

      name: r.name,
      summary: r.summary,
      isActive: !!r.isActive,

      address: r.address,
      phoneNumber: r.phoneNumber,
      longitude: r.longitude,
      latitude: r.latitude,

      thumbnailAvatarImage: r.photoAvatar,
      thumbnailCoverImage: r.photoCover,
      coverImage: r.originalPhotoCover,
      avatarImage: r.originalPhotoAvatar,

      businessType: r.businessType,
      boxes: r.products.map((product: any) => FBBoxMapper.fromApi(product)),
    };
  },
};

export {
  RestaurantMapper,
};
