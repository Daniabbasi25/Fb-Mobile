import moment from 'moment';

export type FBUserEditableFields = 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'password';

export interface FBUser {
  acceptedTC: Date | null;
  deviceId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  isActive: boolean;
  isBlocked: boolean;
  phoneNumber: string | null;
  photo: string | null;
}

class FBUserMapper {

  fromApi(o: any): FBUser {
    let acceptedTC = o.acceptedTC;
    if (acceptedTC) {
      acceptedTC = moment(acceptedTC).toDate();
    }

    return {
      acceptedTC: acceptedTC,
      deviceId: o.deviceId,
      email: o.email,
      firstName: o.firstName,
      lastName: o.lastName,
      id: o.id,
      isActive: o.isActive,
      isBlocked: o.isBlocked,
      phoneNumber: o.phoneNumber,
      photo: o.photo,
    };
  }
}

export {
  FBUserMapper,
};
