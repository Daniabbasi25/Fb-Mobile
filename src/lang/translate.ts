const translateText = (intl: any, key: string) => {
  return intl.formatMessage({id: key});
};

export {
  translateText,
};
