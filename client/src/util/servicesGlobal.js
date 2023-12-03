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
