var _ = require("lodash");

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
