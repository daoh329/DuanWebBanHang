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
      const product_id = action.payload;
      const updatedProducts = state.products.filter(
        (product) => product.id !== product_id
      );
      localStorage.setItem(
        "cart",
        JSON.stringify({ ...state, products: updatedProducts }.products)
      );
      return { ...state, products: updatedProducts };
    },
    updateProductCart: (state, action) => {
      const { id, capacity, brand, main_image, shortDescription, discount } =
        action.payload;
        console.log(capacity);
      const productUpdate = [...state.products].find(
        (product) => product.id === id
      );
      if (productUpdate) {
        productUpdate.capacity = capacity;
        productUpdate.brand = brand;
        productUpdate.main_image = main_image;
        productUpdate.shortDescription = shortDescription;
        productUpdate.discount = discount;
        productUpdate.totalPrice =
          (capacity.capacity_price - discount) *
          productUpdate.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    increaseProduct: (state, action) => {
      const { product_id } = action.payload;
      const cartToUpdate = state.products.find(
        (product) => product.id === product_id
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity + 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.capacity.capacity_price - cartToUpdate.discount) *
          cartToUpdate.quantity;
      }
      // Lưu giỏ hàng vào sessionStorage sau khi cập nhật
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
    decreaseProduct: (state, action) => {
      const { product_id } = action.payload;
      const cartToUpdate = state.products.find(
        (product) => product.id === product_id
      );
      if (cartToUpdate) {
        cartToUpdate.quantity = cartToUpdate.quantity - 1;
        cartToUpdate.totalPrice =
          (cartToUpdate.capacity.capacity_price - cartToUpdate.discount) *
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
