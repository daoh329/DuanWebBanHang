export function format_sale(price, discount) {
  return Math.round((discount / price) * 100) + "%";
}
