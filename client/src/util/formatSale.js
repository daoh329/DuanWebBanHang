export function format_sale(price, discount) {
  return Math.round((discount / price) * 100) + "%";
}

export function format_sale2(price, discount) {
  const percentage = (discount / price) * 100;
  const roundedPercentage = percentage.toFixed(2);
  return roundedPercentage + "%";
}

