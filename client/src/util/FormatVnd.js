export function formatPrice(price) {
  // Sử dụng hàm toLocaleString để định dạng số về dạng tiền tệ
  if (!price) price = 0;
  const formattedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedPrice;
}
