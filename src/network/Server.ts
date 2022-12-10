import {FBLocale} from '../redux/user/reducer';

export enum FB_ENVIRONMENT {
  dev = 'dev',
  stage = 'stage',
  live = 'live'
}

export const ENVIRONMENT: FB_ENVIRONMENT = FB_ENVIRONMENT.live;
const API_ENDPOINT_FACTORY: {[p in FB_ENVIRONMENT]: string} = {
  [FB_ENVIRONMENT.dev]: 'https://foodobox-stage.com/',
  [FB_ENVIRONMENT.stage]: 'https://foodobox-stage.com/',
  [FB_ENVIRONMENT.live]: 'https://apiv1.foodobox.com/',
};

const ANALYTICS_ENDPOINT_FACTORY: {[p in FB_ENVIRONMENT]: string} = {
  [FB_ENVIRONMENT.dev]: 'https://analytics.foodobox-stage.com/',
  [FB_ENVIRONMENT.stage]: 'https://analytics.foodobox-stage.com/',
  [FB_ENVIRONMENT.live]: 'https://analytics.foodobox.com/',
};

export const API_ENDPOINT_ENV = API_ENDPOINT_FACTORY[ENVIRONMENT];
export const ANALYTICS_ENDPOINT_ENV = ANALYTICS_ENDPOINT_FACTORY[ENVIRONMENT];
export const API_ENDPOINT_RESTAURANT_PHOTOS = `${API_ENDPOINT_ENV}restaurants/`;
export const API_ENDPOINT_PRODUCT_PHOTOS = `${API_ENDPOINT_ENV}products/`;

export const WEBSITE_ENDPOINT = 'https://foodobox.com/';

export const CONTACT_US_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}contact-us`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/contact-us/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/contact-us/`,
};

export const REGISTER_BUSINESS_FACTOR = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}for-busines`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/for-busines/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/for-busines/`,
};

export const TERMS_AND_CONDITIONS_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}terms-of-service.html`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}terms-of-service-en.html`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}terms-of-service-ro.html`,
};

export const FAQ_FACTORY = {
  [FBLocale.BG]: `${WEBSITE_ENDPOINT}faq`,
  [FBLocale.EN]: `${WEBSITE_ENDPOINT}en/faq/`,
  [FBLocale.RO]: `${WEBSITE_ENDPOINT}ro/faq/`,
};
