import analytics from '@react-native-firebase/analytics';
import {FBRestaurantFilters} from '../redux/restaurant/reducer';
import {FB_CITIES_TO_LOCATION_MAP, FBLocale} from '../redux/user/reducer';
import {ANALYTICS_ENDPOINT_ENV, ENVIRONMENT} from '../network/Server';
import {FBUserVoucher} from '../models/FBUserVoucher';
import {AppEventsLogger} from 'react-native-fbsdk-next';
import {FBGeoLocation} from '../models/FBGeoLocation';
import axiosClient from '../network/axiosClient';
import moment from 'moment';


const logEvent = async (name: string, data: any) => {
  try {
    data.env = ENVIRONMENT;
    
    let loc: FBGeoLocation | undefined = undefined;
    if (data.loc) {
      if (!Object.values(FB_CITIES_TO_LOCATION_MAP).find(city_location => city_location === data.loc)) {
        loc = data.loc;
      }
      delete data.loc;
    }

    // console.log(name, data);
    
    if (data.data) {
      Object.assign(data, data.data);
      delete data.data;
    }

    if (data.email) {
      delete data.email;
    }

    if (data.deviceId) {
      data.fbDId = data.deviceId;
      delete data.deviceId;
    }

    if (data.productId) {
      data.fbPId = data.productId;
      delete data.productId;
    }

    if (data.quantity) {
      data.fbQ = data.quantity;
      delete data.quantity;
    }

    if (data.voucher) {
      data.fbV = data.voucher;
      delete data.voucher;
    }
    
    if (data.type) {
      data.fbType = data.type;
      name = name + data.type.charAt(0).toUpperCase() + data.type.slice(1);
      delete data.type;
    }
    
    if (data.step) {
      data.fbStep = data.step;
      name = name + data.step.charAt(0).toUpperCase() + data.step.slice(1);
      delete data.step;
    }
    
    if (data.status) {
      data.fbStatus = data.status;
      name = name + data.status.charAt(0).toUpperCase() + data.status.slice(1);
      delete data.status;
    }
    
    if (data.action) {
      data.fbAction = data.action;
      name = name + data.action.charAt(0).toUpperCase() + data.action.slice(1);
      delete data.action;
    }

    name = name + data.env.charAt(0).toUpperCase() + data.env.slice(1);

    Object.keys(data).forEach((k) => {
      if (typeof data[k] === 'boolean') {
        data[k] = data[k] ? 1 : 0;
      }
      
      if (data[k] === null) {
        data[k] = '';
      }
    });
    
    
    AppEventsLogger.logEvent(name, data);
    await analytics().logEvent(name, data);
    await axiosClient.post(
      ANALYTICS_ENDPOINT_ENV,
      { event: {...data, name: name, loc: loc, created_at_utc: moment.utc().format(), created_at_local: moment().format(), created_at: moment().valueOf()}},
      {headers: {'Content-Type': 'application/json'}}
    );
  } catch (e) {
    console.log(e);
  }
};

export const analyticsRegistration = async(params: {email: string, step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any } }) => {
  await logEvent('ManualRegistration', {...params});
};

export const analyticsEmailLogin = async (params: {email: string, step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any }}) => {
  await logEvent('EmailLogin', {...params});
};

export const analyticsSocialLogin = async(params: { type: 'fb' | 'google' | 'apple', step: 'initiated' | 'external_completed' | 'failed' | 'refused' | 'completed', data?: { [key: string]: any }}) => {
  await logEvent('SocialLogin', { ...params});
};

export const analyticsResetPassword = async (params: {step: 'initiated' | 'completed' | 'failed', data?: { [key: string]: any }}) => {
  await logEvent('ResetPassword', {...params});
};

export const analyticsPageOpen = async (params: { userId: number, email: string, pageName: string, data?: { [key: string]: any }, loc?: FBGeoLocation}) => {
  await logEvent('PageOpen', { ...params});
};

export const analyticsOrderStatusChange = async (params: { userId: number, email: string, orderId: number, status: 'confirmed' | 'cancelled', loc?: FBGeoLocation }) => {
  await logEvent('OrderStatusChange', { ...params});
};

export const analyticsBasketUpdated = async (params: { userId: number, email: string, productId: number, quantity: number, voucher: FBUserVoucher | null, value: number, loc?: FBGeoLocation }) => {
  await logEvent('BasketUpdated', { ...params});
};

export const analyticsCheckoutStepChange = async (params: { userId: number, email: string, productId: number, quantity: number, voucher: FBUserVoucher | null, step: 'initiated' | 'confirmed' | 'paymentConfirm' | 'completed' | 'failed', error?: any, loc?: FBGeoLocation }) => {
  await logEvent('Checkout', { ...params});
};

export const analyticsLinkOpened = async (params: { userId: number; email: string; link: string; linkName: string, loc?: FBGeoLocation }) => {
  await logEvent('LinkOpened', { ...params});
};

export const analyticsSignOut = async (params: { userId: number; email: string, loc?: FBGeoLocation }) => {
  await logEvent('SignOut', { ...params});
};

export const analyticsFilterChange = async (params: { userId: number; email: string; filters: FBRestaurantFilters, loc?: FBGeoLocation }) => {
  await logEvent('FilterChange', { ...params});
};

export const analyticsSetLocale = async (params: { userId: number; email: string; locale: FBLocale, loc?: FBGeoLocation }) => {
  await logEvent('SetLocale', { ...params});
};

export const analyticsSetTC = async (params: { userId: number; email: string; action: 'accept' | 'decline', loc?: FBGeoLocation }) => {
  await logEvent('SetTC', { ...params});
};

