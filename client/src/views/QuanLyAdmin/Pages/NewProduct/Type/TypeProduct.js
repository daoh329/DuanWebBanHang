import React, { useState } from "react";
import "./style.css";
import NewProduct from "../Laptop/NewProduct";
import NewPhone from "../Phone/NewPhone";

function TypeProduct() {
  const [state, setState] = useState("");

  const toggleComponentLaptop = () => {
    setState("laptop");
  };
  const toggleComponentPhone = () => {
    setState("phone");
  };

  return (
    <div className="container-type-product">
      <h3>Loại sản phẩm muốn tạo</h3>
      <div className="type-group">
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
      </div>
      {state === "laptop" && <NewProduct />}
      {state === "phone" && <NewPhone />}
    </div>
  );
}

export default TypeProduct;
