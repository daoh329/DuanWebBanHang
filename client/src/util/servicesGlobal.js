import _ from "lodash";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ========= UTIL
// so sánh 2 object (Chỉ so sánh các phần tử ở cấp đầu tiên)
export const ObjectCompareObject = (obj1, obj2) => {
  if (
    obj1 === undefined ||
    obj2 === undefined ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  return _.isEqual(obj1, obj2);
};
// so sánh 2 array (Chỉ so sánh các phần tử ở cấp đầu tiên)
export const ArrayCompareArray = (arr1, arr2) => {
  if (
    arr1 === undefined ||
    arr2 === undefined ||
    !Array.isArray(arr1) ||
    !Array.isArray(arr2)
  ) {
    return false;
  }

  return _(arr1).differenceWith(arr2, _.isEqual).isEmpty();
};

// =========== SERVICES
export const checkLogin = async () => {
  // kiểm tra phiên đăng nhập bằng cách gọi API lấy thông tin user
  try {
    const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
    const result = await axios.get(url, { withCredentials: true });
    if (result.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    if (e.response.status === 401) {
      return "Unauthorized";
    } else {
      return false;
    }
  }
};
// add recently viewed product id
export const addToRecentlyViewedProduct = (products) => {
  // Kiểm tra xem 'id' có tồn tại hay không
  if (!products.id) {
    console.error("Product ID is undefined!");
    return;
  }
  // Lấy danh sách các sản phẩm đã xem từ session storage
  var historysp =
    JSON.parse(sessionStorage.getItem("historyProductId")) || [];
  if (typeof historysp === "number") {
    historysp = [historysp];
  }
  // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
  const isViewed = historysp === products.id;
  // Nếu sản phẩm mới chưa được xem
  if (!isViewed) {
    // Thêm đối tượng sản phẩm mới vào cuối danh sách
    historysp.push(products.id);
    // Lưu trữ danh sách các sản phẩm đã xem vào session storage
    localStorage.setItem("historyProductId", JSON.stringify(historysp));
  }
};
// get recently viewed products
export const getRecentlyViewedProducts = async (product_id, setHistorysp) => {
  if (!Array.isArray(product_id)) {
    return [];
  }
  try {
    const url = `${process.env.REACT_APP_API_URL}/product/json`;
    const results = await axios.get(url, { withCredentials: true });
    const data = [];
    [...product_id].forEach((id) => {
      const dataFinded = [...results.data].find((item) => item.id === id);
      data.push(dataFinded);
    });
    setHistorysp(data);
  } catch (error) {
    console.log(error);
    return [];
  }
};
