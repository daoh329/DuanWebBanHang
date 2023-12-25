import React, { useContext, useEffect, useState } from "react";
import { Button, Divider } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "./OrderStyle.css";
import ProductItem from "./ProductItem/ProductItem";
import { formatCurrency } from "../../../util/FormatVnd";
import { utcToZonedTime, format } from "date-fns-tz";
import { SocketContext } from "../../App";
import dayjs from "dayjs";

function Order() {
  const [reducedPrice, setReducedPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location?.state);
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.user);
  
  // connect socket to server
  useEffect(() => {
    if (user.id && socket && order) {
      // Lắng nghe sự kiện reload thông báo
      socket.on("reload-notification", (data) => {
        if (location.pathname === `/profile/order/${order.order_id}`) {
          navigate("/profile/order", {
            state: {
              order_id: order.order_id,
              action: "call_order"
            },
          });
        }
        
      });
    }
  }, [user, socket, order]);

  useEffect(() => {
    if (order) {
      setProducts(order.products);
    }
  }, [order]);

  // useEffect(() => {
  //   getProductOfOrder();
  // }, []);

  // const getProductOfOrder = async () => {
  //   try {
  //     console.log("order: ",order);
  //     const q = `${process.env.REACT_APP_API_URL}/product/order/${order.products.productID}`;
  //     const results = await axios.get(q);
  //     if (results.status === 200) {
  //       setProduct(results.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleCancelOrder = () => {
    navigate("/profile/order");
  };

  return (
    <>
      {order && (
        <div className="order-informations">
          {/* title */}
          <div className="order-informations-title">
            <Button
              onClick={handleCancelOrder}
              id="order-informations-title-btn"
              icon={<LeftOutlined />}
            />
            <h5>mã đơn hàng: {order?.order_id}</h5>
          </div>

          {/* content */}
          <div className="order-informations-content">
            {/* block 1 */}
            <div className="order-informations-block-1">
              <div className="block-1-1">
                <p style={{ margin: "0 0 16px" }}>Thông tin người nhận</p>
                <p>
                  Nguời nhận: <span>{order.user_name}</span>
                </p>
                <p>
                  Hình thức nhận hàng: <span>{"Giao hàng tiêu chuẩn"}</span>
                </p>
                <p className="address">
                  Địa chỉ: <span>{order.address}</span>
                </p>
                <p>
                  Điện thoại: <span>{order.user_phone}</span>
                </p>
              </div>
              <div className="block-1-2">
                <p>Thông tin đơn hàng</p>
                <p>
                  Trạng thái đơn hàng:{" "}
                  <span>
                    {(() => {
                      switch (order?.order_status) {
                        case 0:
                          return "Chờ xác nhận";
                        case 1:
                          return "Đã xác nhận";
                        case 2:
                          return "Đã hủy";
                        case 3:
                          return "Đang vận chuyển";
                        case 4:
                          return "Đã giao hàng";
                        case 5:
                          return "Giao hàng không thành công";
                        default:
                          return "Không xác định";
                      }
                    })()}
                  </span>
                </p>
                <p>
                  Thời gian tạo:{" "}
                  <span>
                    {dayjs(order.order_created_at).utcOffset(0).format("HH:mm:ss DD/MM/YYYY")}
                  </span>
                </p>
              </div>

              <div className="block-1-3">
                <p>Thông tin hóa đơn thanh toán</p>
                {order &&
                order?.paymentData &&
                (order?.paymentData?.vnp_OrderInfo ||
                  order?.paymentData?.orderId) ? (
                  <>
                    <p>
                      Mã thanh toán giao dịch:{" "}
                      <span>
                        {order?.paymentData?.vnp_OrderInfo ||
                          order?.paymentData?.orderId}
                      </span>
                    </p>
                    <p>
                      Mã tham chiếu giao dịch:{" "}
                      <span>
                        {order?.paymentData?.vnp_TxnRef ||
                          order?.paymentData?.transId}
                      </span>
                    </p>
                    <p>
                      Thời gian thực hiện:{" "}
                      <span>
                        {order?.paymentData?.vnp_PayDate ||
                          order?.paymentData?.responseTime}
                      </span>
                    </p>
                    <p>
                      Kiểu thanh toán:{" "}
                      <span>
                        {order?.paymentData?.vnp_CardType ||
                          order?.paymentData?.payType ||
                          "Khách hàng đã hủy thanh toán"}
                      </span>
                    </p>
                    <p>
                      Ngân hàng:{" "}
                      <span>
                        {order?.paymentData?.vnp_BankCode ||
                          order?.paymentData?.orderType}
                      </span>
                    </p>
                    <p>
                      Số giao dịch:{" "}
                      <span>
                        {order?.paymentData?.vnp_BankTranNo ||
                          order?.paymentData?.transId ||
                          "Khách hàng đã hủy thanh toán"}
                      </span>
                    </p>

                    <p>
                      Tổng tiền:{" "}
                      <span>
                        {parseInt(
                          order?.paymentData?.vnp_Amount
                            ? order?.paymentData?.vnp_Amount / 100
                            : order?.paymentData?.amount
                        ).toLocaleString()}
                      </span>
                    </p>
                    {/* Thêm các trường khác của paymentData tại đây */}
                  </>
                ) : (
                  "Thanh toán khi nhận hàng"
                )}
              </div>
            </div>

            {/* block 2 */}
            <div className="order-informations-block-2">
              <div className="block-2-title">
                <h6>Sản phẩm</h6>
              </div>
              <Divider style={{ margin: "0" }} />
              {/* product */}
              {products &&
                products.map((product, index) => (
                  <div key={index}>
                    <ProductItem product={product} />
                  </div>
                ))}
            </div>

            {/* block 3 */}
            <div className="order-informations-block-3">
              <div className="block-1">
                <div className="sub">
                  <div>Tổng tạm tính</div>
                  <div className="price">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </div>
                <div className="sub">
                  <div>Phí vận chuyển</div>
                  <div className="price">
                    {shippingFee !== 0
                      ? formatCurrency(shippingFee)
                      : "Miễn phí"}
                  </div>
                </div>
                <div className="sub">
                  <div>Giảm giá</div>
                  <div className="price">{formatCurrency(reducedPrice)}</div>
                </div>
                <div className="sub">
                  <div>Thành tiền</div>
                  <div
                    className="price"
                    style={{
                      color: "red",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {formatCurrency(order?.totalAmount)}
                  </div>
                </div>
              </div>
              <div className="block-2">(Đã bao gồm VAT)</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Order;
