export const formatPrice = (price : number): string => {
  return parseFloat(price.toString()).toFixed(2);
};
