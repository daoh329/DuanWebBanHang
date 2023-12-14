import { createSlice } from "@reduxjs/toolkit";
import { isCouponExpired } from "../util/servicesGlobal";

const initialState = {
  products: [],
  updated: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      state.products = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    deleteProductInCart: (state, action) => {
      const { product_id, color, capacity, coupons } = action.payload;
      const updatedProducts = state.products?.filter(
        (product) =>
          product.id !== product_id ||
          product.color !== color ||
          product.capacity !== capacity ||
          product.coupons.id !== coupons.id
      );
      localStorage.setItem(
        "cart",
        JSON.stringify({ ...state, products: updatedProducts }.products)
      );
      return { ...state, products: updatedProducts };
    },
    updateProductCart: (state, action) => {
      const {
        id,
        capacity,
        color,
        price,
        brand,
        shortDescription,
        discount,
        remaining_quantity,
        allCoupons,
      } = action.payload;
      // Tìm sản phẩm có cùng id, color và capacity trong cart để update
      const productUpdate = [...state.products].filter(
        (product) =>
          product.id === id &&
          product.color === color &&
          product.capacity === capacity
      );
      // Nếu tìm được thì update sản phẩm
      if (productUpdate.length !== 0) {
        productUpdate.forEach((product) => {
          product.capacity = capacity;
          product.color = color;
          product.price = price;
          product.brand = brand;
          product.shortDescription = shortDescription;
          product.discount = discount;
          if (product.quantity > remaining_quantity) {
            product.quantity = remaining_quantity;
          };
          // update coupon Selected
          const couponSelected = allCoupons.find((coupon) => coupon.id === product.coupons.id);
          if (isCouponExpired(couponSelected)) {
            product.coupons = {};
          }else{
            product.coupons = couponSelected;
          }
          // Update other coupons
          product.otherCoupons = allCoupons.filter((coupon) => !(coupon.id === product.coupons.id) && !isCouponExpired(coupon));
          console.log(allCoupons.filter((coupon) => !(coupon.id === product.coupons.id) && !isCouponExpired(coupon)));
          product.totalPrice =
          (product.price -
            (product.discount + parseInt(couponSelected.value_vnd || 0))) *
          product.quantity;
        });
      }
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    increaseProduct: (state, action) => {
      const { product_id, color, capacity, coupons, numberIncreased } =
        action.payload;
      // const numberIncreased2 = numberIncreased || 1
      const cartToUpdate = state.products.find(
        (product) =>
          product.id === product_id &&
          product.color === color &&
          product.capacity === capacity &&
          product.coupons.id === coupons.id
      );

      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity + 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.price -
            (cartToUpdate.discount + parseInt(coupons.value_vnd || 0))) *
          cartToUpdate.quantity;
      }

      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    decreaseProduct: (state, action) => {
      const { product_id, color, capacity, coupons } = action.payload;
      const cartToUpdate = state.products.find(
        (product) =>
          product.id === product_id &&
          product.color === color &&
          product.capacity === capacity &&
          product.coupons.id === coupons.id
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity - 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.price -
            (cartToUpdate.discount + parseInt(coupons.value_vnd || 0))) *
          cartToUpdate.quantity;
      }
      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addProductToCart,
  deleteProductInCart,
  increaseProduct,
  decreaseProduct,
  updateProductCart,
} = cartSlice.actions;

export default cartSlice.reducer;
