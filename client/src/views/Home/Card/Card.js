import React, { useEffect } from "react";

import { formatCurrency } from "../../../util/FormatVnd";
import { format_sale } from "../../../util/formatSale";

import { Tag } from "antd";

function CardProduct(props) {
  const { item, onClick } = props;

  useEffect(() => {
    if (!item) return;
  });

  function handleViewDetail() {
    onClick(item);
  }

  return (
    <div className="sanpham-card" onClick={handleViewDetail}>
      <img
        src={
          item.main_image
            ? process.env.REACT_APP_API_URL + item.main_image
            : process.env.REACT_APP_API_URL + item.thumbnail
        }
        style={{
          color: "#333333",
          fontSize: "14px",
          lineHeight: "20px",
          height: "165px",
          width: "165px",
          backgroundColor: "pink",
        }}
        alt=""
      ></img>
      {/* tem */}
      {item.remaining_quantity !== 0 &&
      item.discount > 0 &&
      item.price - item.discount > 0 ? (
        <div className="css-14q2k9dd">
          <div className="css-zb7zul" style={{ textAlign: "start" }}>
            <div className="css-1bqeu8f" style={{ fontSize: "10px" }}>
              TIẾT KIỆM
            </div>
            <div className="css-1rdv2qd">
              {formatCurrency(item.price - item.discount)}
            </div>
          </div>
        </div>
      ) : null}

      {/* brand */}
      <div
        style={{
          color: "#333333",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "15px",
            color: "#82869e",
            fontSize: "13px",
            fontWeight: "500",
            lineHeight: "13px",
          }}
        >
          {item.brand}
        </div>
      </div>
      {/* name */}
      <div className="productname">
        <h3
          style={{
            color: "#434657",
            display: "inline",
            fontFamily: "Roboto",
            fontSize: "12px",
            lineHeight: "16px",
            margin: "0px 0px 8px",
            width: "154px",
            height: "auto",
          }}
        >
          {item.shortDescription}
        </h3>
      </div>

      {/* show giá */}
      <div
        style={{
          alignItems: "start",
          color: "#333333",
          display: "flex",
          flexDirection: "column",
          width: "165px",
          height: "40px",
        }}
      >
        {/* Tag hết sản phẩm */}
        {item.remaining_quantity === 0 ? (
          <Tag color="red">Sản phẩm tạm hết</Tag>
        ) : item.discount > 0 && item.price - item.discount > 0 ? (
          <div>
            {/* discount */}
            <div
              style={{
                color: "#1435c3",
                display: "-webkit-box",
                fontSize: "15px",
                fontWeight: "700",
                lineHeight: "24px",
                width: "90px",
              }}
            >
              {formatCurrency(item.discount)}
            </div>
            {/* price */}
            <div
              style={{
                color: "gray",
                display: "-webkit-box",
                fontSize: "12px",
                lineHeight: "12px",
                fontWeight: "normal",
              }}
            >
              <span style={{ textDecoration: "line-through" }}>
                {formatCurrency(item.price)}
              </span>
              &nbsp;
              <span style={{ color: "#1435c3" }}>
                -{format_sale(item.price, item.discount)}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              color: "#1435c3",
              display: "-webkit-box",
              fontSize: "15px",
              fontWeight: "700",
              width: "90px",
              lineHeight: "24px",
            }}
          >
            {formatCurrency(item.price)}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduct;
