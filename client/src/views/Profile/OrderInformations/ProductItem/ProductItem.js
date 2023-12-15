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
    discount_code,
  } = props.product;
  const navigate = useNavigate();
  const handleDetails = () => {
    navigate(`/detail/${productID}`, {
      state: { capacity: capacity, color: color },
    });
  };
  return (
    <>
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
            {shortDescription} ({formatColor(color)} -{" "}
            {formatCapacity(capacity)})
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
      {/* coupons used */}
      {discount_code && (
        <>
          <p
            style={{
              fontSize: "14px",
              padding: "0 0 0 16px",
              margin: "0 0 5px 0",
            }}
          >
            Khuyến mãi đã sử dụng
          </p>

          <div
            className="coupons-style"
            style={{
              margin: "0",
              padding: "0 16px 10px 16px",
              alignItems: "center",
            }}
          >
            <img
              src="https://shopfront-cdn.tekoapis.com/cart/gift-filled.png"
              alt="icon"
              height={16}
              width={16}
            />
            <p style={{ lineHeight: "12px", height: "max-content" }}>
              Giảm {formatCurrency(discount_code.value_vnd)} (áp dụng vào giá
              sản phẩm)
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default ProductItem;
