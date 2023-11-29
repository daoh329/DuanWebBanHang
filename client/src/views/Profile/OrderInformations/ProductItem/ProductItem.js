import React from "react";
import { useNavigate } from "react-router-dom";

import "./ProductItemt.css";
import { formatCurrency } from "../../../../util/FormatVnd";
import { formatColor } from "../../../../util/formatData";
import { formatCapacity } from "../../../../util/formatCapacity";

function ProductItem(props) {
  const {
    shortDescription,
    productID,
    totalPrice,
    quantity,
    main_image,
    color,
    capacity,
  } = props.product;
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/detail/${productID}`);
  };
  return (
    <div className="product-item">
      <div className="product-image">
        <img
          onClick={handleDetails}
          src={process.env.REACT_APP_API_URL + main_image}
          alt=""
        />
      </div>
      <div className="product-infomations">
        <p onClick={handleDetails} className="name">
          {shortDescription} ({formatColor(color)} - {formatCapacity(capacity)})
        </p>
        <p style={{ margin: "0", color: "#a6a4a4" }}>SKU: {productID}</p>
        <p style={{ margin: "0", color: "#a6a4a4" }}>
          Cung cấp bởi <span>Đình Minh</span>
        </p>
      </div>
      <div className="product-total">
        <p style={{ fontWeight: "500" }}>{formatCurrency(totalPrice)}</p>
        <p style={{ color: "#a6a4a4" }}>Số lượng: {quantity}</p>
      </div>
    </div>
  );
}

export default ProductItem;
