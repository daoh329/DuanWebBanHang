import React, { useEffect, useState } from "react";
import { Button, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";

import "./OrderStyle.css";
import ProductItem from "./ProductItem/ProductItem";
import { formatCurrency } from "../../../util/FormatVnd";
import { format } from "date-fns";

function Order(props) {
  const { order, setOrder } = props;
  const [productAPI, setProduct] = useState(null);

  useEffect(() => {
    getProductOfOrder();
  }, []);

  const getProductOfOrder = async () => {
    try {
      const q = `${process.env.REACT_APP_API_URL}/order/${order[0].productID}`;
      const results = await axios.get(q);
      if (results.status === 200) {
        // Chuyển đổi paymentData từ chuỗi sang đối tượng JSON
        const parsedPaymentData = JSON.parse(results.data[0].paymentData);
        setProduct({...results.data[0], paymentData: parsedPaymentData});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = () => {
    setOrder(null);
  };

  const product = {
    shortDescription: order[0]?.shortDescription,
    product_id: order[0]?.productID,
    price_total:
      parseFloat(order[0]?.price ? order[0]?.price : 0) *
      parseFloat(order[0]?.quantity ? order[0]?.quantity : 0),
    quantity: order[0]?.quantity,
    imageUrl: productAPI?.galery[0],
  };

  return (
    <div className="order-informations">
      {/* title */}
      <div className="order-informations-title">
        <Button
          onClick={handleCancelOrder}
          id="order-informations-title-btn"
          icon={<LeftOutlined />}
        />
        <h5>đơn hàng: {order[0].order_id}</h5>
      </div>

      {/* content */}
      <div className="order-informations-content">
        {/* block 1 */}
        <div className="order-informations-block-1">
          <div className="block-1-1">
            <p style={{ margin: "0 0 16px" }}>Thông tin người nhận</p>
            <p >
              Nguời nhận: <span>{order[0].user_name}</span>
            </p>
            <p>
              Hình thức nhận hàng: <span>{"Giao hàng tiêu chuẩn"}</span>
            </p>
            <p className="address">
              Địa chỉ: <span >{order[0].address}</span>
            </p>
            <p>
              Điện thoại: <span>{order[0].user_phone}</span>
            </p>
          </div>
          <div className="block-1-2">
            <p>Thông tin đơn hàng</p>
            <p>
            Trạng thái đơn hàng:{" "}
              <span>
                {(() => {
                  switch (order[0]?.order_status) {
                    case 0: return "Chờ xác nhận";
                    case 1: return "Đã xác nhận";
                    case 2: return "Đã hủy";
                    case 3: return "Đang vận chuyển";
                    case 4: return "Đã giao hàng";
                    case 5: return "Giao hàng không thành công";
                    default: return "Không xác định";
                  }
                })()}
              </span>
            </p>
            <p>
              Thời gian tạo: <span>{format(new Date(order[0].order_created_at), "HH:mm:ss dd/MM/yyyy") }</span>
            </p>
          </div>
          
          <div className="block-1-3">
            {order[0] && order[0]?.paymentData && (order[0]?.paymentData?.vnp_OrderInfo || order[0]?.paymentData?.orderId) ? (
              <>
                <p>Thông tin xuất hóa đơn</p>
                <p>Mã thanh toán giao dịch: <span>{order[0]?.paymentData?.vnp_OrderInfo || order[0]?.paymentData?.orderId}</span></p>
                <p>Mã tham chiếu giao dịch: <span>{order[0]?.paymentData?.vnp_TxnRef || order[0]?.paymentData?.transId}</span></p>
                <p>Thời gian thực hiện: <span>{order[0]?.paymentData?.vnp_PayDate || order[0]?.paymentData?.responseTime}</span></p>
                <p>Loại thanh toán: <span>{order[0]?.paymentData?.vnp_CardType || order[0]?.paymentData?.payType}</span></p>
                <p>Ngân hàng: <span>{order[0]?.paymentData?.vnp_BankCode || order[0]?.paymentData?.orderType}</span></p>
                <p>Số giao dịch: <span>{order[0]?.paymentData?.vnp_BankTranNo || order[0]?.paymentData?.transId}</span></p>
                <p>Tổng tiền: <span>{(parseInt(order[0]?.paymentData?.vnp_Amount ? order[0]?.paymentData?.vnp_Amount / 100 : order[0]?.paymentData?.amount)).toLocaleString()}</span></p>
                {/* Thêm các trường khác của paymentData tại đây */}
              </>
            ) : null}
          </div>




        </div>

        {/* block 2 */}
        <div className="order-informations-block-2">
          <div className="block-2-title">
            <h6>Sản phẩm</h6>
          </div>
          <Divider style={{ margin: "0" }} />

          {/* product */}
          <ProductItem product={product} />
        </div>

        {/* block 3 */}
        <div className="order-informations-block-3">
          <div className="block-1">
            <div className="sub">
              <div>Tổng tạm tính</div>
              <div className="price">{formatCurrency(product.price_total) }</div>
            </div>
            <div className="sub">
              <div>Phí vận chuyển</div>
              <div className="price">{formatCurrency(25000)}</div>
            </div>
            <div className="sub">
              <div>Giảm giá</div>
              <div className="price">{formatCurrency()}</div>
            </div>
            <div className="sub">
              <div>Thành tiền</div>
              <div className="price" style={{color:'red', fontSize:"16px", fontWeight:"600"}}>{formatCurrency(product?.price_total + 25000)}</div>
            </div>
          </div>
          <div className="block-2">(Đã bao gồm VAT)</div>
        </div>
      </div>
    </div>
  );
}

export default Order;
