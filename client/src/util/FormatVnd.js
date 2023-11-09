export function formatCurrency(price) {
  if (!price) price = 0;
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  if (typeof price === "string") {
    // Loại bỏ dấu phẩy và định dạng lại chuỗi
    const formattedPrice = price.replace(/,/g, "");
    // Chuyển chuỗi số thành số nguyên
    const numberPrice = parseFloat(formattedPrice);
    // Định dạng số tiền và trả về
    return formatter.format(numberPrice);
  } else if (typeof price === "number") {
    // Định dạng số tiền và trả về
    return formatter.format(price);
  }else{
    console.log("Kiểu dữ liệu 'giá' không đúng");
    return formatter.format(0);
  }

}
