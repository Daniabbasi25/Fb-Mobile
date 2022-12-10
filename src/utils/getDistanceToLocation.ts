import {FBGeoLocation} from '../models/FBGeoLocation';
import {getDistance} from 'geolib';

const getDistanceToLocation = (params: { userLocation: FBGeoLocation, location: FBGeoLocation }): number => {
  const {userLocation, location} = params;
  return getDistance(userLocation, location);
};

export default getDistanceToLocation;
