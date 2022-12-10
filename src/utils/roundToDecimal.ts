const roundToDecimal = (amount: number, decimals = 2): number => {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

export default roundToDecimal;
