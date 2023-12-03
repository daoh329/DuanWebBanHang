var _ = require("lodash");

// so sánh 2 object
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
