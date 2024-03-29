import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import axios from "axios";

import "./Card.css";
import { formatCurrency } from "../../util/FormatVnd";
import { format_sale2 } from "../../util/formatSale";
import { isCouponExpired } from "../../util/servicesGlobal";
// import { formatCapacity } from "../../util/formatCapacity";

function CardProduct(props) {
  const { item, onClick } = props;
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [variations, setVariations] = useState([]);
  const [discountOfPiceMin, setDiscountOfPiceMin] = useState(0);
  const [discountOfPiceMax, setDiscountOfPiceMax] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  // const [coupons, setCoupons] = useState([]);
  const [couponsShow, setCouponsShow] = useState([]);

  // Lấy tổng số lượng sản phẩm
  useEffect(() => {
    if (item) {
      var total = 0;
      [...item.variations].forEach((item) => {
        total += item.remaining_quantity_variant;
      });
      setTotalQuantity(total);
    }
  }, [item]);

  useEffect(() => {
    // Nếu có nhiều biến thể
    // Lấy giá nhỏ nhất và lớn nhất
    const variations = item.variations;
    setVariations(variations);
    if (variations && variations.length > 1) {
      // Tìm giá trị price lớn nhất và nhỏ nhất
      let minPrice = Number.POSITIVE_INFINITY; // Giá trị ban đầu là dương vô cùng
      let maxPrice = Number.NEGATIVE_INFINITY; // Giá trị ban đầu là âm vô cùng
      for (const item of variations) {
        if (item.price < minPrice) {
          minPrice = item.price;
        }
        if (item.price > maxPrice) {
          maxPrice = item.price;
        }
      }
      setPriceMin(minPrice);
      setPriceMax(maxPrice);
      // Lấy discount_amount của giá nhỏ nhất và lớn nhất
      const variationOfPriceMin = variations.find(
        (data) => data.price === minPrice
      );
      const variationOfPriceMax = variations.find(
        (data) => data.price === maxPrice
      );
      setDiscountOfPiceMin(variationOfPriceMin?.discount_amount);
      setDiscountOfPiceMax(variationOfPriceMax?.discount_amount);
    }
    // nếu chỉ có 1 biến thể
    if (variations && variations.length === 1) {
      setDiscountOfPiceMin(variations[0].discount_amount);
    }
  }, [item]);

  // Gọi hàm lấy tất cả khuyến mãi
  useEffect(() => {
    getCoupons();
  }, [item]);

  // Hàm lấy tất cả khuyến mãi của sản phẩm
  const getCoupons = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/product/${item.id}/coupons`;
      const results = await axios.get(url);
      // Mảng chứa coupons còn hạn
      if (results.data.length !== 0) {
        const arr = [];
        [...results.data].forEach((coupon) => {
          // Kiểm tra HSD của khuyến mãi
          if (!isCouponExpired(coupon)) {
            // Nếu còn hạn
            arr.push(coupon);
          }
        });
        // Sắp xếp có giá lớn -> bé
        arr.sort((a, b) => parseInt(b.value_vnd) - parseInt(a.value_vnd));
        setCouponsShow(arr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleViewDetail() {
    onClick(item);
  }

  return (
    <div className="sanpham-card" onClick={handleViewDetail}>
      <div
        style={{
          width: "165px",
          height: "165px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={
            item?.main_image && process.env.REACT_APP_API_URL + item?.main_image
          }
          style={{
            color: "#333333",
            fontSize: "14px",
            lineHeight: "20px",
            width: "165px",
            maxHeight: "165px",
            backgroundColor: "pink",
          }}
          alt="main_image"
        />
      </div>

      {/* tem */}
      {totalQuantity !== 0 &&
        (discountOfPiceMin > 0 ||
          parseInt(couponsShow[0]?.value_vnd || 0) > 0) && (
          <div className="css-14q2k9dd">
            <div className="css-zb7zul" style={{ textAlign: "start" }}>
              <div className="css-1bqeu8f" style={{ fontSize: "10px" }}>
                TIẾT KIỆM
              </div>
              <div className="css-1rdv2qd">
                {formatCurrency(
                  discountOfPiceMin + parseInt(couponsShow[0]?.value_vnd || 0)
                )}
              </div>
            </div>
          </div>
        )}

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

      {/* shortDescription */}
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
        {totalQuantity === 0 ? (
          <Tag color="red">Sản phẩm tạm hết</Tag>
        ) : (
          // Nếu còn sản phẩm
          <div>
            {variations && (
              <>
                {/* Giá mới */}
                <div style={{ textAlign: "left" }} className="show-discount">
                  {formatCurrency(
                    variations[0]?.price -
                      (variations[0]?.discount_amount +
                        parseInt(couponsShow[0]?.value_vnd || 0))
                  )}
                </div>
                {/* Giá cũ */}
                {(variations[0]?.discount_amount > 0 ||
                  parseInt(couponsShow[0]?.value_vnd || 0) > 0) && (
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
                      {formatCurrency(variations[0]?.price)}
                    </span>
                    &nbsp;
                    <span className="blinking-text">
                      -
                      {format_sale2(
                        variations[0]?.price,
                        variations[0]?.discount_amount +
                          parseInt(couponsShow[0]?.value_vnd || 0)
                      )}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardProduct;
