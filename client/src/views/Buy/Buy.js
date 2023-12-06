import React, { useState, useEffect, useLocation } from "react";
import axios from "axios";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Input, Checkbox, Modal, Button } from "antd";
import { message } from "antd";
import "./Buy.css";
import ButtonAddress from "./ButtonCheckedAddress/ButtonAddress";
import ReceiverInformationModal from "../Profile/AddressManager/ItemAddress/Modal/receiverInformationModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductInCart } from "../../redux/cartSlice";
import { formatCurrency } from "../../util/FormatVnd";
import { NotificationBeenLoggedOut } from "../NotificationsForm/Authenticated";

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
//

export default function Buy() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [note, setNote] = useState("");
  const [paymentMenthod, setPaymentMenthod] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [fillActive, setFillActive] = useState("tab1");
  const [buysData, setBuysData] = useState(null);
  // state checked address
  const [addressChecked, setAddressChecked] = useState();

  const [productID, setProductID] = useState(null);
  const [amount, setAmount] = useState(null);
  const [totalPrice, settotalPrice] = useState(null);
  const [color, setColor] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  const navigate = useNavigate();

  function DedaultAddress(value) {
    let index = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i].setdefault === 1) {
        index = i;
      }
    }
    setAddressChecked(index);
  }

  // Hàm lấy thông tin địa chỉ nhận hàng của người dùng
  const getDeliveryAddress = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/delivery-address/${user.id}`,
        { withCredentials: true }
      );
      setDeliveryAddress(result.data);
      DedaultAddress(result.data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        NotificationBeenLoggedOut();
      }
    }
  };

  useEffect(() => {
    if (user) {
      getDeliveryAddress();
    }
  }, [user]);

  // modal
  const showModalAdd = (value) => {
    setIsModalOpenAdd(true);
  };

  const handleCancel = () => {
    setIsModalOpenAdd(false);
  };

  const handleFillClick = (value) => {
    if (value === fillActive) {
      return;
    }
    setFillActive(value);
  };
  //
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Bạn chưa đăng nhập?",
      icon: <ExclamationCircleFilled />,
      content: "Hãy đăng nhập để sửa dụng tính năng này!",
      onOk() {
        navigate("/login");
      },
      onCancel() {},
    });
  };

  // // Lấy dữ liệu từ sessionStorage khi component được tải
  // useEffect(() => {
  //   const buysDataFromSession = sessionStorage.getItem("buys");
  //   // console.log("buysDataFromSession:", buysDataFromSession); // Kiểm tra dữ liệu trong sessionStorage
  //   if (buysDataFromSession) {
  //     const parsedBuysData = JSON.parse(buysDataFromSession);
  //     // console.log("parsedBuysData:", parsedBuysData); // Kiểm tra dữ liệu sau khi chuyển đổi
  //     setBuysData(parsedBuysData);
  //     // console.log("dữ liệu buys:", parsedBuysData);
  //   }
  // }, []);

  // // let productID = null;
  // // if (buysData && buysData.selectedItems && buysData.selectedItems.length > 0) {
  // //   productID = buysData.selectedItems[0].id;
  // // }

  //Thanh toán VNPay

  // useEffect(() => {
  //   const buysDataFromSession = sessionStorage.getItem("buys");
  //   console.log("buysDataFromSession:", buysDataFromSession); // Kiểm tra dữ liệu trong sessionStorage
  //   if (buysDataFromSession) {
  //     const parsedBuysData = JSON.parse(buysDataFromSession);
  //     setBuysData(parsedBuysData);
  //     console.log("parsedBuysData:", JSON.stringify(parsedBuysData, null, 2)); // Kiểm tra dữ liệu sau khi chuyển đổi

  //     // Chuyển đổi total thành số trước khi cập nhật vào state amount
  //     setAmount(Number(parsedBuysData.total)); // Cập nhật giá trị total vào state amount
  //     console.log("dữ liệu total:", Number(parsedBuysData.total));
  //     // Truy cập vào mảng selectedItems và lấy ra tất cả productID
  //     const productIDs = parsedBuysData.selectedItems.map(item => item.id);
  //     setProductID(productIDs); // Cập nhật mảng productIDs vào state

  //     // Truy cập vào mảng selectedItems và lấy ra đối tượng đầu tiên
  //     const firstSelectedItem = parsedBuysData.selectedItems[0];
  //     if (firstSelectedItem) {
  //       setQuantity(firstSelectedItem.quantity);
  //       setColor(firstSelectedItem.color);
  //       setCapacity(firstSelectedItem.capacity.capacity); // Lưu ý: capacity là một đối tượng có thuộc tính capacity
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const buysDataFromSession = sessionStorage.getItem("buys");
    if (buysDataFromSession) {
      const parsedBuysData = JSON.parse(buysDataFromSession);
      setBuysData(parsedBuysData);
      console.log("parsedBuysData:", JSON.stringify(parsedBuysData, null, 2)); // Kiểm tra dữ liệu sau khi chuyển đổi

      // Chuyển đổi total thành số trước khi cập nhật vào state amount
      setAmount(Number(parsedBuysData.total));

      // Truy cập vào mảng selectedItems và lấy ra tất cả productID
      const productIDs = parsedBuysData.selectedItems.map((item) => item.id);
      setProductID(productIDs); // Cập nhật mảng productIDs vào state

      // Lấy ra tất cả color, quantity và capacity
      const colors = parsedBuysData.selectedItems.map((item) => item.color);
      setColor(colors); // Cập nhật mảng colors vào state

      const quantities = parsedBuysData.selectedItems.map(
        (item) => item.quantity
      );
      setQuantity(quantities); // Cập nhật mảng quantities vào state

      const capacities = parsedBuysData.selectedItems.map(
        (item) => item.capacity
      );
      setCapacity(capacities); // Cập nhật mảng capacities vào state

      const totalPrices = parsedBuysData.selectedItems.map(
        (item) => item.totalPrice
      );
      settotalPrice(totalPrices);
    }
  }, []);

  // useEffect(() => {
  //   console.log("Color:", color);
  // }, [color]);
  // useEffect(() => {
  //   console.log("product:", productID);
  // }, [color]);

  // useEffect(() => {
  //   console.log("Capacity:", capacity);
  // }, [capacity]);

  // // Cập nhật quantity mỗi khi nó thay đổi
  // useEffect(() => {
  //   if (buysData && buysData.selectedItems) {
  //     // Tính toán tổng quantity từ selectedItems
  //     const totalQuantity = buysData.selectedItems.reduce(
  //       (total, item) => total + item.quantity,
  //       0
  //     );

  //     // Cập nhật biến trạng thái quantity
  //     setQuantity(totalQuantity);
  //   }
  // }, [buysData]);

  // // Cập nhật sessionStorage mỗi khi quantity thay đổi
  // useEffect(() => {
  //   // Lưu quantity vào sessionStorage
  //   sessionStorage.setItem("quantity", JSON.stringify(quantity));
  // }, [quantity]);

  const removeFromCart = () => {
    // lấy sản phẩm được chọn mua
    var informationSelected = sessionStorage.getItem("buys");
    if (informationSelected) {
      informationSelected = JSON.parse(informationSelected).selectedItems;
      const data = [];
      // Nếu informationSelected là mảng
      Array.isArray(informationSelected) &&
        [...informationSelected].forEach((value) => {
          const item = {
            product_id: value.id,
            capacity: value.capacity,
            color: value.color,
          };
          data.push(item);
        });
      // xóa trong cart redux
      data.forEach((item) => {
        dispatch(deleteProductInCart(item));
      });
    }
  };

  const selectVNPay = () => {
    setPaymentMenthod(0); // Giả sử setPaymentMethod là hàm cập nhật state
  };

  const selectCOD = () => {
    setPaymentMenthod(1); // Giả sử setPaymentMethod là hàm cập nhật state
  };

  const selectMoMoPay = () => {
    setPaymentMenthod(2); // Giả sử setPaymentMethod là hàm cập nhật state
  };

  const handleBuyClick = async () => {
    // Kiểm tra giá trị của paymentMenthod và gọi hàm tương ứng
    if (!deliveryMethod) {
      message.error("Vui lòng chọn thời gian giao hàng");
      return;
    } else if (
      paymentMenthod == null
    ) {
      message.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (paymentMenthod === 0) {
      await handleBuyVNpay();
    } else if (paymentMenthod === 1) {
      handleBuyCOD();
    } else if (paymentMenthod === 2) {
      await handleBuyMoMoPay();
    }
  };

  const handleBuyVNpay = async () => {

    const data = {
      amount,
      bankCode,
      language,
      UserID: user.id,
      addressID: deliveryAddress[addressChecked].id,
      productID: productID,
      color: color,
      capacity: capacity,
      quantity: quantity,
      totalPrice: totalPrice,
      deliveryMethod: deliveryMethod,
      paymentMenthod: 0,
      note: note,
      status: 0,
    };
    // console.log("data: "+ data)

    // Kiểm tra xem số tiền có nằm trong khoảng từ 5 nghìn đến 1 tỷ không
    if (amount < 5000 || amount > 1000000000) {
      message.error("Thanh toán VN Pay chỉ hỗ trợ mốc giá từ 5 nghìn đến 1 tỷ");
      return;
    }

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng không?",
      okText: 'Đồng ý',
      cancelText: 'Không đồng ý',
      onOk: async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/pay/create_payment_url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const responseData = await response.json(); // Phân tích cú pháp body yêu cầu thành JSON

          if (responseData && responseData.url) {
            window.location.href = responseData.url;
          }
        } else {
          const errorData = await response.json();
          if (errorData === "Số lượng sản phẩm không đủ") {
            message.error("Số lượng sản phẩm không đủ");
          }
        }
      },
    });
  };
  // navigate(`/createorder?amount=${totalAmount}`); // Thêm totalAmount vào URL như một tham số truy vấn
  const handleBuyCOD = () => {
    // Lấy thông tin cá nhân của người dùng từ state hoặc form
    const data = {
      UserID: user.id,
      addressID: deliveryAddress[addressChecked].id,
      productID: productID,
      color: color,
      capacity: capacity,
      quantity: quantity,
      totalPrice: totalPrice,
      deliveryMethod: deliveryMethod,
      paymentMenthod: 1,
      totalAmount: amount,
      note: note,
      status: 0,
    };

    // console.log(data)

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng?",
      okText: 'Đồng ý',
      cancelText: 'Không đồng ý',
      onOk: async () => {
        // In ra giá trị của biến data
        // console.log("Data:", data);
        // Gửi thông tin đăng ký lên server
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/order/pay`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        // Xử lý kết quả trả về từ server NodeJS
        if (response.ok) {
          // Thông báo thành công
          message.success("Thanh toán đơn hàng thành công");

          // Chuyển hướng người dùng đến trang thông báo thành công
          window.location.replace("/success");
          // Xóa sản phẩm khỏi giỏ hàng
          removeFromCart();
        } else {
          // Kiểm tra nếu lỗi liên quan đến số lượng sản phẩm
          const responseData = await response.json();
          if (responseData === "Số lượng sản phẩm không đủ") {
            message.error("Số lượng sản phẩm không đủ");
          } else {
            // Thông báo lỗi khác
            message.error("Thanh toán đơn hàng thất bại");
          }
        }
      },
    });
  };

  const handleBuyMoMoPay = async () => {
    // Xử lý cho phương thức thanh toán MoMoPay

    const data = {
      amount,
      productID: productID,
      quantity: quantity,
    };

    // Kiểm tra xem số tiền có nằm trong khoảng từ 5 nghìn đến 50 triệu không
    if (amount < 5000 || amount > 50000000) {
      message.error(
        "Thanh toán MOMO Pay chỉ hỗ trợ mốc giá từ 5 nghìn đến 50 triệu"
      );
      return;
    }

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng?",
      okText: 'Đồng ý',
      cancelText: 'Không đồng ý',
      onOk: async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/pay/paymomo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          sessionStorage.setItem("UserID", user.id);
          sessionStorage.setItem(
            "addressID",
            deliveryAddress[addressChecked].id
          );
          sessionStorage.setItem("productID", JSON.stringify(productID));
          sessionStorage.setItem("quantity", JSON.stringify(quantity));
          sessionStorage.setItem("color", JSON.stringify(color));
          sessionStorage.setItem("capacity", JSON.stringify(capacity));
          sessionStorage.setItem("totalPrice", JSON.stringify(totalPrice));
          sessionStorage.setItem("deliveryMethod", deliveryMethod);
          sessionStorage.setItem("paymentMenthod", 2);
          sessionStorage.setItem("note", note);
          sessionStorage.setItem("totalAmount", amount);
          sessionStorage.setItem("status", 0);
          const responseData = await response.json(); // Phân tích cú pháp body yêu cầu thành JSON

          if (responseData && responseData.url) {
            window.location.href = responseData.url;
          } else if (responseData && responseData.error) {
            // Hiển thị thông báo lỗi
            message.error(
              "Thanh toán MOMO Pay chỉ hỗ trợ mốc giá từ 10 nghìn đến 50 triệu"
            );
          }
        } else {
          const errorData = await response.json();
          if (errorData === "Số lượng sản phẩm không đủ") {
            message.error("Số lượng sản phẩm không đủ");
          }
        }
      },
    });
  };

  const handleChecked = (value) => {
    setAddressChecked(value);
  };

  // Đếm chiều dài mảng address
  function countAddress() {
    return deliveryAddress.length;
  }

  return (
    <>
      {/* main */}
      <div className="snipcss0-0-0-1 snipcss-nvTph">
        {/* main2 */}
        <div className="css-d00g6r snipcss0-1-1-2">
          {/* main3 */}
          <div
            className="teko-row css-q0e31u snipcss0-2-2-3 style-4Trly"
            id="style-4Trly"
          >
            {/* main4 */}
            <div
              className="teko-col teko-col-8 css-gr7r8o2 snipcss0-3-3-4 style-yXGc7"
              id="style-yXGc7"
            >
              {/*  */}
              <div className="teko-card css-svl62k snipcss0-4-4-5">
                <div className="teko-card-body css-0 snipcss0-5-5-6">
                  <MDBTabs fill className="mb-3-buy">
                    {/* <MDBTabsItem className="nav-tabs-buy">
                      <MDBTabsLink
                        className="nav-link-buy"
                        onClick={() => handleFillClick("tab1")}
                        active={fillActive === "tab1"}
                      >
                        Nhận hàng tại nhà
                      </MDBTabsLink>
                    </MDBTabsItem> */}
                    {/* <MDBTabsItem className="nav-tabs-buy">
                      <MDBTabsLink
                        className="nav-link-buy"
                        onClick={() => handleFillClick("tab2")}
                        active={fillActive === "tab2"}
                      >
                        Nhận hàng tại điểm
                      </MDBTabsLink>
                    </MDBTabsItem> */}
                  </MDBTabs>

                  <MDBTabsContent>
                    <MDBTabsPane show={fillActive === "tab1"}>
                      <h6 style={{ marginTop: "10px" }}>Thông tin nhận hàng</h6>
                      <div className="address-group">
                        {/* show address */}
                        {user.id &&
                          deliveryAddress &&
                          deliveryAddress.map((value, index) => (
                            <ButtonAddress
                              getValues={getDeliveryAddress}
                              key={index}
                              index={index}
                              onClick={handleChecked}
                              value={value}
                              checked={addressChecked === index ? true : false}
                            />
                          ))}

                        {/* add address */}
                        <div
                          onClick={user.id ? showModalAdd : showConfirm}
                          className="address-add"
                        >
                          <PlusOutlined />
                          <div>Thêm địa chỉ</div>
                        </div>
                        <ReceiverInformationModal
                          countAddress={countAddress()}
                          getValues={getDeliveryAddress}
                          action={"add"}
                          open={isModalOpenAdd}
                          cancel={handleCancel}
                        />
                        {/*  */}
                      </div>
                      <div className="radio">
                        <div
                          style={{
                            display: "block",
                            fontSize: "17px",
                            marginBottom: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Thời gian giao hàng
                        </div>
                        
                        <div className="check_box" >
                          <div
                            
                          >
                            {/* <input
                              type="checkbox"
                              value="ngày trong tuần"
                              checked={deliveryMethod === "ngày trong tuần"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }
                            /> */}
                            
                            <Checkbox type="checkbox"
                              value="ngày trong tuần"
                              checked={deliveryMethod === "ngày trong tuần"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }>Tất cả ngày trong tuần</Checkbox>
                          </div>
                          {/*  */}
                          <div
                            style={{marginTop:"5px" ,marginRight:"82px"}}
                          >
                            {/* <input
                              type="checkbox"
                              value="Chủ nhật"
                              checked={deliveryMethod === "Chủ nhật"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }
                            /> */}
                         
                            <Checkbox type="checkbox"
                              value="Chủ nhật"
                              checked={deliveryMethod === "Chủ nhật"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }>Chủ nhật</Checkbox>
                           
                          </div>
                        </div>
                      </div>


                      {/* <div className="css-18c0ysw snipcss0-4-4-52">
                        <div
                          type="subtitle"
                          className="css-1realo9 snipcss0-5-52-53"
                        >
                          Nhập Mã Online, hóa đơn qua Email
                        </div>
                        <div className="css-boqvfl snipcss0-5-52-54">
                          <Input
                            type="text"
                            maxLength={255}
                            placeholder="Email"
                          />
                        </div>
                      </div> */}
                    </MDBTabsPane>
                  </MDBTabsContent>
                </div>
              </div>
              {/*  */}

              {/*  */}

              <div className="css-18c0ysw snipcss0-4-4-52">
                <div className="css-boqvfl snipcss0-5-52-54">
                  <Input
                    type="text"
                    maxLength={255}
                    placeholder="Ghi chú (Nếu có)"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                  />
                </div>
              </div>

              <div className="teko-card css-t9nop0 snipcss0-4-4-57">
                <div className="teko-card-header css-0 snipcss0-5-57-58">
                  <div className="snipcss0-6-58-59">
                    <div type="title" className="css-1p6ero0 snipcss0-7-59-60">
                      Phương thức thanh toán
                    </div>
                    <div
                      type="body"
                      color="textSecondary"
                      className="css-kgtmqg snipcss0-7-59-61"
                    >
                      Thông tin thanh toán của bạn sẽ luôn được bảo mật
                    </div>
                  </div>
                </div>
                <div className="teko-card-body css-0 snipcss0-5-57-62">
                  <div
                    className="teko-row teko-row-start css-80kmv8 snipcss0-6-62-63 style-RRpB6"
                    id="style-RRpB6"
                  >
                    {/* pt1 */}
                    {user.id ? (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-75 style-keAdr"
                        id="style-keAdr"
                      >
                        {paymentMenthod == 0 ? (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="COD"
                            data-content-target="COD"
                            className="css-64rk53 snipcss0-8-75-76 style-UMMoQ button-select"
                            id="style-UMMoQ"
                            onClick={selectVNPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán VN Pay
                              <span
                                className="snipcss0-10-77-78 style-NANX3"
                                id="style-NANX3"
                              ></span>
                            </div>
                            <div
                              type="body"
                              color="textSecondary"
                              className="css-ngriz3 snipcss0-9-76-79"
                            ></div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-76-80"
                            >
                              Thanh toán qua Internet Banking, Visa, Master,
                              JCB, VNPAY-QR
                            </div>
                          </Button>
                        ) : (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="COD"
                            data-content-target="COD"
                            className="css-64rk53 snipcss0-8-75-76 style-UMMoQ"
                            id="style-UMMoQ"
                            onClick={selectVNPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán VN Pay
                              <span
                                className="snipcss0-10-77-78 style-NANX3"
                                id="style-NANX3"
                              ></span>
                            </div>
                            <div
                              type="body"
                              color="textSecondary"
                              className="css-ngriz3 snipcss0-9-76-79"
                            ></div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-76-80"
                            >
                              Thanh toán qua Internet Banking, Visa, Master,
                              JCB, VNPAY-QR
                            </div>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-75 style-keAdr"
                        id="style-keAdr"
                      >
                        <Button
                          data-content-region-name="paymentMethod"
                          data-track-content="true"
                          data-content-name="COD"
                          data-content-target="COD"
                          className="css-64rk53 snipcss0-8-75-76 style-UMMoQ button-select"
                          id="style-UMMoQ"
                          onClick={showConfirm}
                        >
                          <div
                            type="subtitle"
                            className="css-qat15y snipcss0-9-76-77"
                          >
                            Thanh toán VN Pay
                            <span
                              className="snipcss0-10-77-78 style-NANX3"
                              id="style-NANX3"
                            ></span>
                          </div>
                          <div
                            type="body"
                            color="textSecondary"
                            className="css-ngriz3 snipcss0-9-76-79"
                          ></div>
                          <div
                            type="body"
                            className="css-9o8e5m snipcss0-9-76-80"
                          >
                            Thanh toán qua Internet Banking, Visa, Master, JCB,
                            VNPAY-QR
                          </div>
                        </Button>
                      </div>
                    )}

                    {/* pt2 */}
                    {user.id ? (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-75 style-keAdr"
                        id="style-keAdr"
                      >
                        {paymentMenthod == 1 ? (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="COD"
                            data-content-target="COD"
                            className="css-64rk53 snipcss0-8-75-76 style-UMMoQ button-select"
                            id="style-UMMoQ"
                            onClick={selectCOD}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán khi nhận hàng
                              <span
                                className="snipcss0-10-77-78 style-NANX3"
                                id="style-NANX3"
                              ></span>
                            </div>
                            <div
                              type="body"
                              color="textSecondary"
                              className="css-ngriz3 snipcss0-9-76-79"
                            ></div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-76-80"
                            ></div>
                          </Button>
                        ) : (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="COD"
                            data-content-target="COD"
                            className="css-64rk53 snipcss0-8-75-76 style-UMMoQ "
                            id="style-UMMoQ"
                            onClick={selectCOD}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán khi nhận hàng
                              <span
                                className="snipcss0-10-77-78 style-NANX3"
                                id="style-NANX3"
                              ></span>
                            </div>
                            <div
                              type="body"
                              color="textSecondary"
                              className="css-ngriz3 snipcss0-9-76-79"
                            ></div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-76-80"
                            ></div>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-75 style-keAdr"
                        id="style-keAdr"
                      >
                        <Button
                          data-content-region-name="paymentMethod"
                          data-track-content="true"
                          data-content-name="COD"
                          data-content-target="COD"
                          className="css-64rk53 snipcss0-8-75-76 style-UMMoQ"
                          id="style-UMMoQ"
                          onClick={showConfirm}
                        >
                          <div
                            type="subtitle"
                            className="css-qat15y snipcss0-9-76-77"
                          >
                            Thanh toán khi nhận hàng
                            <span
                              className="snipcss0-10-77-78 style-NANX3"
                              id="style-NANX3"
                            ></span>
                          </div>
                          <div
                            type="body"
                            color="textSecondary"
                            className="css-ngriz3 snipcss0-9-76-79"
                          ></div>
                          <div
                            type="body"
                            className="css-9o8e5m snipcss0-9-76-80"
                          ></div>
                        </Button>
                      </div>
                    )}

                    {/* pt3 */}
                    {user.id ? (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-81 style-poooX"
                        id="style-poooX"
                      >
                        {paymentMenthod == 2 ? (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="ZALOPAY_GATEWAY"
                            data-content-target="ZALOPAY_GATEWAY"
                            className="css-64rk53 snipcss0-8-81-82 style-OQooy button-select"
                            id="style-OQooy"
                            onClick={selectMoMoPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-82-83"
                            >
                              Thanh toán bằng ví điện từ MOMO
                              <span
                                className="snipcss0-10-83-84 style-DJQy2"
                                id="style-DJQy2"
                              ></span>
                            </div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-82-86"
                            ></div>
                          </Button>
                        ) : (
                          <Button
                            data-content-region-name="paymentMethod"
                            data-track-content="true"
                            data-content-name="ZALOPAY_GATEWAY"
                            data-content-target="ZALOPAY_GATEWAY"
                            className="css-64rk53 snipcss0-8-81-82 style-OQooy"
                            id="style-OQooy"
                            onClick={selectMoMoPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-82-83"
                            >
                              Thanh toán bằng ví điện từ MOMO
                              <span
                                className="snipcss0-10-83-84 style-DJQy2"
                                id="style-DJQy2"
                              ></span>
                            </div>
                            <div
                              type="body"
                              className="css-9o8e5m snipcss0-9-82-86"
                            ></div>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-81 style-poooX"
                        id="style-poooX"
                      >
                        <Button
                          data-content-region-name="paymentMethod"
                          data-track-content="true"
                          data-content-name="ZALOPAY_GATEWAY"
                          data-content-target="ZALOPAY_GATEWAY"
                          className="css-64rk53 snipcss0-8-81-82 style-OQooy"
                          id="style-OQooy"
                          onClick={showConfirm}
                        >
                          <div
                            type="subtitle"
                            className="css-qat15y snipcss0-9-82-83"
                          >
                            Thanh toán bằng ví điện từ MOMO
                            <span
                              className="snipcss0-10-83-84 style-DJQy2"
                              id="style-DJQy2"
                            ></span>
                          </div>
                          <div
                            type="body"
                            className="css-9o8e5m snipcss0-9-82-86"
                          ></div>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* <div className="teko-row teko-row-start teko-row-middle css-1dmv21i snipcss0-4-4-87">
                <label className="check-box css-1arb6mh snipcss0-5-87-88">
                  <Checkbox checked onChange={onChange}></Checkbox>
                </label>
                <div type="body" className="css-1os8pr0 snipcss0-5-87-93">
                  Tôi muốn xuất hóa đơn
                </div>
              </div> */}
            </div>
            <div
              className="teko-col teko-col-4 css-gr7r8o2 tether-target-attached-top snipcss0-3-3-99 tether-element-attached-top tether-element-attached-center tether-target-attached-center style-FJLy3"
              id="style-FJLy3"
            >
              <div className="css-14xqo9c snipcss0-0-0-1 tether-target-attached-top snipcss0-4-99-100 tether-element-attached-top tether-element-attached-center tether-target-attached-center">
                <div className="card-header css-0 snipcss0-1-1-2 snipcss0-5-100-101">
                  <div className="css-1euuut5 snipcss0-2-2-3 snipcss0-6-101-102">
                    <h5 className="snipcss0-3-3-4 snipcss0-7-102-103">
                      Thông tin đơn hàng
                    </h5>
                    <a
                      href="/cart"
                      className="snipcss0-3-3-5 snipcss0-7-102-104"
                    >
                      Chỉnh sửa
                    </a>
                  </div>
                </div>
                <div className="card-body css-0 snipcss0-1-1-6 snipcss0-5-100-105">
                  {buysData &&
                    buysData.selectedItems.map((item, index) => (
                      <div key={index}>
                        <div className="css-9op68y snipcss0-2-6-7 snipcss0-6-105-106">
                          <div className="css-ov1ktg snipcss0-3-7-8 snipcss0-7-106-107">
                            <div className="snipcss0-4-8-9 snipcss0-8-107-108">
                              <div
                                height={80}
                                width={80}
                                className="css-17nqxzh snipcss0-5-9-10 snipcss0-9-108-109"
                              >
                                <picture className="snipcss0-6-10-11 snipcss0-10-109-110">
                                  <img
                                    className="lazyload css-jdz5ak snipcss0-7-11-14 snipcss0-11-110-113"
                                    alt="product"
                                    src={
                                      item.main_image
                                        ? process.env.REACT_APP_API_URL +
                                          item.main_image
                                        : process.env.REACT_APP_API_URL +
                                          item.thumbnail
                                    } // Lấy URL ảnh từ dữ liệu
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </picture>
                              </div>
                            </div>
                            <div className="css-f0vs3e snipcss0-4-8-15 snipcss0-8-107-114">
                              <a
                                href={`/detail/${buysData.selectedItems[0].id}`} // Lấy ID sản phẩm từ dữ liệu
                                aria-label="Image"
                                className="css-587jha snipcss0-5-15-16 snipcss0-9-114-115"
                              >
                                {/* Tên sản phẩm */}
                                <div
                                  type="body"
                                  color="textPrimary"
                                  className="css-l4bwcr snipcss0-6-16-17 snipcss0-10-115-116"
                                >
                                  {item.shortDescription}
                                </div>
                              </a>
                              {/* Số lượng */}
                              <div
                                type="caption"
                                color="textSecondary"
                                className="css-1qm2d75 snipcss0-5-15-18 snipcss0-9-114-117"
                              >
                                Số lượng {item.quantity}
                              </div>
                              {/* Giá sản phẩm */}
                              <span className="css-7ofbab snipcss0-5-15-19 snipcss0-9-114-118">
                                {formatCurrency(item.totalPrice)}
                                {/* <span className="css-1ul6wk9 snipcss0-6-19-20 snipcss0-10-118-119">
                              đ
                            </span> */}
                              </span>
                              <div className="css-1vptl7o snipcss0-5-15-21 snipcss0-9-114-120">
                                {/* Giá khuyến mãi */}
                                {/* <span className="css-p2smad snipcss0-6-21-22 snipcss0-10-120-121">
                                  {formatCurrency(item.promoPrice)}
                                </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="snipcss0-4-99-155">
                <div className="css-1pnc6ez snipcss0-5-155-156">
                  <div className="teko-row teko-row-no-wrap teko-row-space-between css-1o3gs9x2 snipcss0-6-156-157">
                    <div className="teko-col css-gr7r8o2 snipcss0-7-157-158">
                      <label className="check-box css-1arb6mh snipcss0-8-158-159">
                        <Checkbox 
                        onChange={onChange}></Checkbox>
                        <div
                          type="body"
                          className="checkbox-label css-10md8qb snipcss0-9-159-164 style-Aggjr"
                          id="style-Aggjr"
                        >
                          <div
                            type="subtitle"
                            className="ellipsis css-1gcn5cj snipcss0-10-164-165"
                          >
                            Cài đặt miễn phí
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="snipcss0-4-99-168 style-orm2K" id="style-orm2K">
                <div className="css-1pnc6ez snipcss0-5-168-169">
                  <div className="teko-row teko-row-no-wrap teko-row-space-between css-1o3gs9x2 snipcss0-6-169-170">
                    <div className="teko-col css-gr7r8o2 snipcss0-7-170-171">
                      <label className="check-box css-1arb6mh snipcss0-8-171-172">
                        <Checkbox onChange={onChange}></Checkbox>
                        <div
                          type="body"
                          className="checkbox-label css-10md8qb snipcss0-9-172-177 style-aUwfK"
                          id="style-aUwfK"
                        >
                          <div
                            type="subtitle"
                            className="ellipsis css-1gcn5cj snipcss0-10-177-178"
                          >
                            Hỗ trợ kỹ thuật miễn phí
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="css-cssveg snipcss0-4-99-181">
                <div className="css-27abj6 snipcss0-5-181-182">
                  <div className="teko-card css-516rdm snipcss0-6-182-183">
                    <div className="teko-card-body css-0 snipcss0-7-183-184">
                      <div className="css-nouyrl snipcss0-8-184-185">
                        <MDBTable style={{ border: "none" }} borderless>
                          {buysData && buysData.total && (
                            <MDBTableBody>
                              <tr>
                                <td colSpan={1}>Tổng tiền tạm tính</td>
                                <td colSpan={3}>
                                  {formatCurrency(buysData.total)}
                                </td>
                              </tr>
                              {/* <tr>
                                <td colSpan={1}>Phí vận chuyển</td>
                                <td colSpan={3}>Miễn Phí</td>
                              </tr> */}
                              <tr>
                                <td colSpan={1}>Thanh tiền</td>
                                <td colSpan={3}>
                                  {formatCurrency(buysData.total)}
                                </td>
                              </tr>
                            </MDBTableBody>
                          )}
                        </MDBTable>
                      </div>
                    </div>
                    <div className="teko-card-footer css-0 snipcss0-7-183-202">
                      <div
                        data-content-region-name="bottomCheckOut"
                        data-track-content="true"
                        data-content-name="checkout"
                        className="css-0 snipcss0-8-202-203"
                      >
                        <div>
                          {user.id ? (
                            <button
                              onClick={handleBuyClick}
                              className="att-checkout-button css-v463h2 snipcss0-9-203-204"
                            >
                              <div className="css-1lqe6yk snipcss0-10-204-205">
                                THANH TOÁN
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={showConfirm}
                              className="att-checkout-button css-v463h2 snipcss0-9-203-204"
                            >
                              <div className="css-1lqe6yk snipcss0-10-204-205">
                                THANH TOÁN
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                      {/* <div className="css-12xhfzh snipcss0-8-202-206">
                        <p className="snipcss0-9-206-207">
                          Nhấn "Thanh toán" đồng nghĩa với việc bạn đọc và đồng
                          ý tuân theo 
                          <a
                            href=""
                            target="_blank"
                            className="snipcss0-10-207-208"
                          >
                            Điều khoản và Điều kiện
                          </a>
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="checkoutInlineRight snipcss0-4-99-209"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
