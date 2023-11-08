import React, { useEffect, useState } from "react";

import { formatCurrency } from "../../../util/FormatVnd";
import { format_sale } from "../../../util/formatSale";

import { Tag } from "antd";

function CardProduct(props) {
  const { item, onClick } = props;
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

  useEffect(() => {
    // Lấy giá nhỏ nhất và lớn nhất
    const capacities = item?.capacities;
    if (capacities && capacities.length > 1) {
      // Tìm giá trị price lớn nhất và nhỏ nhất
      let minPrice = Number.POSITIVE_INFINITY; // Giá trị ban đầu là dương vô cùng
      let maxPrice = Number.NEGATIVE_INFINITY; // Giá trị ban đầu là âm vô cùng
      for (const item of capacities) {
        if (item.capacity_price < minPrice) {
          minPrice = item.capacity_price;
        }
        if (item.capacity_price > maxPrice) {
          maxPrice = item.capacity_price;
        }
      }
      setPriceMin(minPrice);
      setPriceMax(maxPrice);
    }
  }, [item]);

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
      {item.remaining_quantity !== 0 && item.discount > 0 ? (
        <div className="css-14q2k9dd">
          <div className="css-zb7zul" style={{ textAlign: "start" }}>
            <div className="css-1bqeu8f" style={{ fontSize: "10px" }}>
              TIẾT KIỆM
            </div>
            <div className="css-1rdv2qd">{formatCurrency(item.discount)}</div>
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
        ) : (
          // Nếu còn sản phẩm
          <div>
            {/* discount */}
            {item?.capacities?.length === 1 ? (
              <div style={{ textAlign: "left" }} className="show-discount">
                {formatCurrency(
                  item?.capacities[0].capacity_price - item.discount
                )}
              </div>
            ) : (
              <div className="show-discount">
                {formatCurrency(priceMin - item.discount)}
                {" - "}
                {formatCurrency(priceMax - item.discount)}
              </div>
            )}

            {/* price */}
            {item?.discount > 0 && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduct;
