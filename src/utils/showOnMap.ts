import {FBGeoLocation} from "../models/FBGeoLocation";
import {showLocation} from "react-native-map-link";

export const showOnMap = async (params: {location: FBGeoLocation}) => {
  await showLocation({
    latitude: params.location.latitude,
    longitude: params.location.longitude,
    googleForceLatLon: true
  });
}
