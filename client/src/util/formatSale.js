export function format_sale(price, discount) {
  return Math.round(((price - discount) / price) * 100) + "%";
}
