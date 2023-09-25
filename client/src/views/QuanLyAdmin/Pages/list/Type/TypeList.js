import React, { useState } from "react";
import "./style.css";
import Color from "../Category/CategoryComponent";
import Category from "../Color/ColorComponent";
import Brand from "../Brand/BrandComponent"
function TypeProduct() {
  const [state, setState] = useState("");

  const toggleComponentBrand = () => {
    setState("Brand");
  };
  const toggleComponentCategory = () => {
    setState("Category");
  };
  const toggleComponentColor = () => {
    setState("Color")
  }

  return (
    <div className="container-type-product">
      <h3>Mục</h3>
      <div className="type-group">
        <button
          style={state === "Brand" ? { backgroundColor: "purple", color:"white" } : {}}
          className="btn-type"
          onClick={toggleComponentBrand}
        >
          Brand
        </button>
        <button
          style={state === "Category" ? { backgroundColor: "purple", color:'white' } : {}}
          className="btn-type"
          onClick={toggleComponentCategory}
        >
          Category
        </button>
        <button
          style={state === "Color" ? { backgroundColor: "purple", color:'white' } : {}}
          className="btn-type"
          onClick={toggleComponentColor}
        >
          Color
        </button>

      </div>
      {state === "Color" && <Color />}
      {state === "Brand" && <Brand />}
      {state === "Category" && <Category />}
    </div>
  );
}

export default TypeProduct;
