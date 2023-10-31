import React from "react";
import {useNavigate} from 'react-router-dom'

import "./ProductItemt.css";
import { formatPrice } from "../../../../util/FormatVnd";

function ProductItem(props) {
  const { shortDescription, product_id, price_total, quantity, imageUrl } =
    props.product;
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/detail/${product_id}`);
  }
  return (
    <div className="product-item">
      <div className="product-image">
        <img src={process.env.REACT_APP_API_URL + imageUrl} alt="" />
      </div>
      <div className="product-infomations">
        <p onClick={handleDetails} className="name">{shortDescription}</p>
        <p style={{ margin: "0",  color:"#a6a4a4" }}>SKU: {product_id}</p>
        <p style={{ margin: "0", color:"#a6a4a4" }}>
          Cung cấp bởi <span>Đình Minh</span>
        </p>
      </div>
      <div className="product-total">
        <p style={{ fontWeight: "500" }}>{formatPrice(price_total)}</p>
        <p style={{color:"#a6a4a4"}}>x{quantity}</p>
      </div>
    </div>
  );
}

export default ProductItem;
