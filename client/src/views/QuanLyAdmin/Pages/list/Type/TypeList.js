import React, { useState } from "react";
import "./style.css";
import Category from "../Category/CategoryComponent";
import Color from "../ColorComponent/ColorComponent";
import Brand from "../Brand/BrandComponent"
import Capacity from "../Capacity/Capacity";


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
  const toggleComponentCapacity = () => {
    setState("Capacity");
  }

  return (
    <div className="container-type-product">

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
        <button
          style={state === "Capacity" ? { backgroundColor: "purple", color:'white' } : {}}
          className="btn-type"
          onClick={toggleComponentCapacity}
        >
          Capacity
        </button>

      </div>
      {state === "Color" && <Color />}
      {state === "Brand" && <Brand />}
      {state === "Category" && <Category />}
      {state === "Capacity" && <Capacity />}
    </div>
  );
}

export default TypeProduct;
