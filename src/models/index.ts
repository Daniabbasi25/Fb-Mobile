export enum FOOD_TYPE {
  PASTRIES = 2,
  GROCERIES = 3,
  MEALS = 1,
  OTHERS = 4
}

export enum DIET_TYPE {
  VEGAN = 1,
  VEGETARIAN = 2
}

export enum CURRENCY {
  BGN = 'bgn',
  EUR = 'eur',
  RON = 'ron'
}

export const BE_CURRENCY_TO_CURRENCY_MAPPER : {[key in string]: CURRENCY} = {
  'RON': CURRENCY.RON,
  'BGN': CURRENCY.BGN,
  'EUR': CURRENCY.EUR,
};
