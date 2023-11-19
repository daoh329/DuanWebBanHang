import React, { useState } from "react";
import "./style.css";
import NewProduct from "../Laptop/NewProduct";
import NewPhone from "../Phone/NewPhone";
import MainForm from "../CreateProductForm/MainForm";

function TypeProduct() {
  const [state, setState] = useState("product");

  const toggleComponentLaptop = () => {
    setState("laptop");
  };
  const toggleComponentPhone = () => {
    setState("phone");
  };
  const toggleComponentProduct = () => {
    setState("product");
  };

  return (
    <div className="container-type-product">
      {/* <h3>Loại sản phẩm muốn tạo</h3> */}
      <br/>
      {/* <div className="type-group">
        <button
          style={state === "laptop" ? { backgroundColor: "purple", color:"white" } : {}}
          className="btn-type"
          onClick={toggleComponentLaptop}
        >
          Laptop
        </button>
        <button
          style={state === "phone" ? { backgroundColor: "purple", color:'white' } : {}}
          className="btn-type"
          onClick={toggleComponentPhone}
        >
          Điện thoại
        </button>
        <button
          style={state === "product" ? { backgroundColor: "purple", color:'white' } : {}}
          className="btn-type"
          onClick={toggleComponentProduct}
        >
          Sản phẩm mới
        </button>
      </div> */}
      {state === "laptop" && <NewProduct />}
      {state === "phone" && <NewPhone />}
      {state === "product" && <MainForm />}
    </div>
  );
}

export default TypeProduct;
