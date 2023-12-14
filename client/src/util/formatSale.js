export function format_sale(price, discount) {
  return Math.round((discount / price) * 100) + "%";
}

export function format_sale2(price, discount) {
  const percentage = (discount / price) * 100;

  if (percentage < 1) {
    // Nếu có phần thập phân, làm tròn đến 2 số sau dấu phẩy
    return percentage.toFixed(2) + "%";
  } else {
    // Nếu không có phần thập phân, làm tròn tới số nguyên
    return Math.round(percentage) + "%";
  }
}

