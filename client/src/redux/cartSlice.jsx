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
    },
    deleteProductInCart: (state, action) => {
      const product_id = action.payload;
      const updatedProducts = state.products.filter(
        (product) => product.id !== product_id
      );
      return { ...state, products: updatedProducts };
    },
    increaseProduct: (state, action) => {
      const { product_id } = action.payload;
      const cartToUpdate = state.products.find(
        (product) => product.id === product_id
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity + 1;
        cartToUpdate.totalPrice = cartToUpdate.price * cartToUpdate.quantity;
      }
      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      sessionStorage.setItem("cart", JSON.stringify(state.products));
    },
    decreaseProduct: (state, action) => {
      const { product_id } = action.payload;
      const cartToUpdate = state.products.find(
        (product) => product.id === product_id
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity - 1;
        cartToUpdate.totalPrice = cartToUpdate.price * cartToUpdate.quantity;
      }
      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      sessionStorage.setItem("cart", JSON.stringify(state.products));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProductToCart, deleteProductInCart, increaseProduct, decreaseProduct } =
  cartSlice.actions;

export default cartSlice.reducer;
