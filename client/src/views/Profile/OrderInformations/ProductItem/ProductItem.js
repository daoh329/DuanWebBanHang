import React from "react";

import "./ProductItemt.css";

function ProductItem(props) {
  const { shortDescription, product_id, price_total, quantity, imageUrl } = props.product;
  return (
    <div className="product-item">
      <div className="product-image">
        <img src={process.env.REACT_APP_API_URL + imageUrl} alt="" />
      </div>
      <div className="product-infomations">
        <p className="name">{shortDescription}</p>
        <p style={{ margin: "0" }}>SKU: {product_id}</p>
        <p style={{ margin: "0" }}>
          Cung cấp bởi <span>Đình Minh</span>
        </p>
      </div>
      <div className="product-total">
        <p style={{ fontWeight: "500" }}>{price_total}</p>
        <p>x{quantity}</p>
      </div>
    </div>
  );
}

export default ProductItem;
