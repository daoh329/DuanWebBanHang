export function formatCurrency(price) {
  // Sử dụng hàm toLocaleString để định dạng số về dạng tiền tệ
  if (!price) price = 0;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
