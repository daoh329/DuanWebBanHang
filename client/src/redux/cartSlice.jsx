import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
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
      const { product_id, color, capacity } = action.payload;
      const updatedProducts = state.products?.filter(
        (product) =>
          product.id !== product_id ||
          product.color !== color ||
          product.capacity !== capacity
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
      } = action.payload;
      // Tìm sản phẩm có cùng id, color và capacity trong cart để update
      const productUpdate = [...state.products].find(
        (product) =>
          product.id === id &&
          product.color === color &&
          product.capacity === capacity
      );
      // Nếu tìm được thì update sản phẩm
      if (productUpdate) {
        productUpdate.capacity = capacity;
        productUpdate.color = color;
        productUpdate.price = price;
        productUpdate.brand = brand;
        productUpdate.shortDescription = shortDescription;
        productUpdate.discount = discount;
        if (productUpdate.quantity > remaining_quantity) {
          productUpdate.quantity = remaining_quantity
        }
        productUpdate.totalPrice =
          (productUpdate.price - discount) * productUpdate.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    increaseProduct: (state, action) => {
      const { product_id, color, capacity } = action.payload;
      const cartToUpdate = state.products.find(
        (product) =>
          product.id === product_id &&
          product.color === color &&
          product.capacity === capacity
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity + 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.price - cartToUpdate.discount) * cartToUpdate.quantity;
      }
      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    decreaseProduct: (state, action) => {
      const { product_id, color, capacity } = action.payload;
      const cartToUpdate = state.products.find(
        (product) =>
          product.id === product_id &&
          product.color === color &&
          product.capacity === capacity
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity - 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.price - cartToUpdate.discount) * cartToUpdate.quantity;
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
