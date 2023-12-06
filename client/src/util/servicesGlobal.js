import _ from "lodash";
import axios from "axios";

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
export const addToRecentlyViewedProduct = (products, user_id) => {
  // Lấy danh sách các sản phẩm đã xem từ localStorage
  var historysp = JSON.parse(localStorage.getItem("historyProductId")) || {};
  // Kiểm tra xem lịch sử sản phẩm xem đã có dữ liệu chưa
  if (Object.keys(historysp).length === 0) {
    // Nếu chưa thì tạo dữ liệu mới
    historysp.userId = user_id;
    historysp.productIds = [products.id];
    localStorage.setItem("historyProductId", JSON.stringify(historysp));
    // logic code
  } else if (Object.keys(historysp).length > 0) {
    // Nếu có thì thêm dữ liệu mới
    // Kiểm tra xem sản phẩm mới có nằm trong danh sách các sản phẩm đã xem hay không
    const isViewed = [...historysp.productIds].find(
      (item) => item === products.id
    );
    // Nếu sản phẩm mới chưa được xem
    if (!isViewed) {
      // Thêm đối tượng sản phẩm mới vào cuối danh sách
      historysp.productIds.push(products.id);
      // Lưu trữ danh sách các sản phẩm đã xem vào localStorage
      localStorage.setItem("historyProductId", JSON.stringify(historysp));
    }
  }
};
// get recently viewed products
export const getRecentlyViewedProducts = async (historysp, setHistorysp) => {
  try {
    const url = `${process.env.REACT_APP_API_URL}/product/json`;
    const results = await axios.get(url, { withCredentials: true });
    const data = [];
    const productIdOut = [];
    [...historysp.productIds].forEach((id) => {
      const dataFinded = [...results.data].find((item) => item.id === id);
      if (dataFinded) {
        data.push(dataFinded);
      } else {
        productIdOut.push(id);
      }
    });
    setHistorysp(data);
    if (productIdOut.length !== 0) {
      var newArr = [];
      productIdOut.forEach((id) => {
        newArr = [...historysp.productIds].filter((i) => i !== id);
      });
      historysp.productIds = newArr
      localStorage.setItem("historyProductId", JSON.stringify(historysp));
    }
  } catch (error) {
    console.log(error);
    setHistorysp([]);
  }
};
