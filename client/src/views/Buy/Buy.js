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
  const [paymentMenthod, setPaymentMenthod] = useState([]);
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
        `${process.env.REACT_APP_API_URL}/auth/delivery-address/${user.id}`
      );
      setDeliveryAddress(result.data);
      DedaultAddress(result.data);
    } catch (error) {
      console.log(error);
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
      console.log("capacities: "+capacities);

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

  const handleBuyVNpay = async () => {
    // const totalAmount = buysData.total; // Lấy tổng tiền từ buysData
    // console.log('amount: '+totalAmount)
    // setPaymentMenthod(0); // Cập nhật phương thức thanh toán

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

    if (!deliveryMethod) {
      message.error("Vui lòng chọn hình thức giao hàng");
      return;
    }

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng không?",
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
    // Xử lý cho phương thức thanh toán COD
    setPaymentMenthod(1); // Cập nhật phương thức thanh toán
  };

  const handleBuyMoMoPay = async () => {
    // Xử lý cho phương thức thanh toán ZaloPay
    setPaymentMenthod(2); // Cập nhật phương thức thanh toán

    sessionStorage.setItem("UserID", user.id);
    sessionStorage.setItem("addressID", deliveryAddress[addressChecked].id);
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

    const data = {
      amount,
      productID: productID,
      quantity: quantity,
    };

    if (!deliveryMethod) {
      message.error("Vui lòng chọn hình thức giao hàng");
      return;
    }

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng?",
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
          const responseData = await response.json(); // Phân tích cú pháp body yêu cầu thành JSON

          if (responseData && responseData.url) {
            window.location.href = responseData.url;
          } else if (responseData && responseData.error) {
            // Hiển thị thông báo lỗi
            message.error("Thanh toán momo chỉ hỗ trợ mốc giá dưới 50 triệu");
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

  const handleBuyClick = async () => {
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
      paymentMenthod: paymentMenthod,
      totalAmount: amount,
      note: note,
      status: 0,
    };

    // console.log(data)

    if (!deliveryMethod) {
      message.error("Vui lòng chọn hình thức giao hàng");
      return;
    } else if (
      !paymentMenthod ||
      paymentMenthod == [] ||
      paymentMenthod == null
    ) {
      message.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    // Thêm thông báo xác nhận mua hàng
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn mua hàng?",
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
                    <MDBTabsItem className="nav-tabs-buy">
                      <MDBTabsLink
                        className="nav-link-buy"
                        onClick={() => handleFillClick("tab1")}
                        active={fillActive === "tab1"}
                      >
                        Nhận hàng tại nhà
                      </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem className="nav-tabs-buy">
                      <MDBTabsLink
                        className="nav-link-buy"
                        onClick={() => handleFillClick("tab2")}
                        active={fillActive === "tab2"}
                      >
                        Nhận hàng tại điểm
                      </MDBTabsLink>
                    </MDBTabsItem>
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
                        <label
                          style={{
                            display: "block",
                            fontSize: "15px",
                            marginBottom: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Phương thức giao hàng
                        </label>
                        <div style={{ justifyContent: "space-between" }}>
                          <label
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              value="ngày trong tuần"
                              checked={deliveryMethod === "ngày trong tuần"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }
                            />
                            Ngày trong tuần
                          </label>
                          <label
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              value="Chủ nhật"
                              checked={deliveryMethod === "Chủ nhật"}
                              onChange={(e) =>
                                setDeliveryMethod(
                                  e.target.checked ? e.target.value : ""
                                )
                              }
                            />
                            Chủ nhật
                          </label>
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

                    <MDBTabsPane show={fillActive === "tab2"}>
                      {/*  */}
                      <div className="css-11tnwen snipcss0-0-0-1 snipcss-DLdxM">
                        <div className="css-1xehz2l snipcss0-1-1-2">
                          <div className="css-au5p93 snipcss0-2-2-3">
                            Chọn khu vực nhận hàng
                          </div>
                          <div className="css-q55v4i snipcss0-2-2-4">
                            <div className="css-12bxpw5 snipcss0-3-4-5">
                              <div
                                className="css-en0qru snipcss0-4-5-6"
                                tabIndex={0}
                              >
                                <button
                                  type="button"
                                  className="css-ff84vc snipcss0-5-6-7"
                                >
                                  <span className="css-1denlqa snipcss0-6-7-8">
                                    <span className="css-1fnfu41 snipcss0-7-8-9">
                                      Thành phố Hồ Chí Minh
                                    </span>
                                  </span>
                                  <span
                                    direction="down"
                                    size={12}
                                    className="css-er4drj snipcss0-6-7-10"
                                  ></span>
                                </button>
                              </div>
                              <div
                                className="css-43jsjt snipcss0-4-5-11 style-F8tYz"
                                data-popper-reference-hidden="false"
                                data-popper-escaped="false"
                                data-popper-placement="bottom-start"
                                id="style-F8tYz"
                              >
                                <div
                                  origin="center top"
                                  className="css-1x7vo2d snipcss0-5-11-12"
                                >
                                  <ul className="css-1ymolov snipcss0-6-12-13">
                                    <li className="css-zsmsql snipcss0-7-13-14">
                                      Tỉnh Bà Rịa - Vũng Tàu
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-15">
                                      Thành phố Thái Nguyên
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-16">
                                      Tỉnh Nghệ An
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-17">
                                      Tỉnh Thừa Thiên Huế
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-18">
                                      Tỉnh Long An
                                    </li>
                                    <li className="css-ip2e5w snipcss0-7-13-19">
                                      Thành phố Hồ Chí Minh
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-20">
                                      Thành phố Cần Thơ
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-21">
                                      Tỉnh Bình Dương
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-22">
                                      Thành phố Hà Nội
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-23">
                                      Tỉnh Đồng Nai
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-24">
                                      Tỉnh Đắk Lắk
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-25">
                                      Tỉnh Bắc Ninh
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-26">
                                      Tỉnh Tây Ninh
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-27">
                                      Tỉnh Tiền Giang
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-28">
                                      Tỉnh Quảng Trị
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-29">
                                      Tỉnh Thanh Hóa
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-30">
                                      Tỉnh Bến Tre
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-31">
                                      Tỉnh Ninh Thuận
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-32">
                                      Tỉnh Khánh Hòa
                                    </li>
                                    <li className="css-zsmsql snipcss0-7-13-33">
                                      Tỉnh Đồng Tháp
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  className="snipcss0-5-11-34 style-V8nJR"
                                  id="style-V8nJR"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="css-1hqpg snipcss0-1-1-35">
                          <div className="css-1x5w71s snipcss0-2-35-36">
                            <div
                              className="css-1sks6na snipcss0-3-36-37 style-R9YTz"
                              id="style-R9YTz"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-37-38 style-hxlik"
                                id="style-hxlik"
                              >
                                <div className="css-un3w91 snipcss0-5-38-39">
                                  <div className="css-1a6d6qm snipcss0-6-39-40">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1cjp49c snipcss0-7-40-41"
                                    />
                                    <div className="radio-inner css-nyq1jm snipcss0-7-40-42">
                                      <div className="css-1q6g407 snipcss0-8-42-43"></div>
                                    </div>
                                  </div>
                                  <div className="active css-1yyu6fw snipcss0-6-39-44">
                                    <p className="css-1eud8hl snipcss0-7-44-45"></p>
                                    <p className="css-j662fd snipcss0-8-45-46">
                                      ĐỊA ĐIỂM KINH DOANH 6 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ -
                                      02873096867
                                    </p>
                                    Số 2A, Nguyễn Oanh, Phường 7, Quận Gò Vấp,
                                    Thành phố Hồ Chí Minh, Phường 07, Quận Gò
                                    Vấp, Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-38-47"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-48 style-Jj6to"
                              id="style-Jj6to"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-48-49 style-y1k2b"
                                id="style-y1k2b"
                              >
                                <div className="css-un3w91 snipcss0-5-49-50">
                                  <div className="css-1a6d6qm snipcss0-6-50-51">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-51-52"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-51-53">
                                      <div className="css-1mdu17v snipcss0-8-53-54"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-50-55">
                                    <p className="css-1eud8hl snipcss0-7-55-56"></p>
                                    <p className="css-j662fd snipcss0-8-56-57">
                                      ĐỊA ĐIỂM KINH DOANH 1 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ -
                                      02873016867
                                    </p>
                                    264A-264B-264C, Nguyễn Thị Minh Khai, Phường
                                    6, Quận 3, Thành phố Hồ Chí Minh, Phường Võ
                                    Thị Sáu, Quận 3, Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-49-58"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-59 style-H8Cjr"
                              id="style-H8Cjr"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-59-60 style-dwrd8"
                                id="style-dwrd8"
                              >
                                <div className="css-un3w91 snipcss0-5-60-61">
                                  <div className="css-1a6d6qm snipcss0-6-61-62">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-62-63"
                                      defaultChecked=""
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-62-64">
                                      <div className="css-1mdu17v snipcss0-8-64-65"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-61-66">
                                    <p className="css-1eud8hl snipcss0-7-66-67"></p>
                                    <p className="css-j662fd snipcss0-8-67-68">
                                      ĐỊA ĐIỂM KINH DOANH 50 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ -
                                      02873066867
                                    </p>
                                    677/2A Điện Biên Phủ, Phường 25, Quận Bình
                                    Thạnh, TP. HCM, Phường 25, Quận Bình Thạnh,
                                    Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-60-69"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-70 style-CNont"
                              id="style-CNont"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-70-71 style-eGA26"
                                id="style-eGA26"
                              >
                                <div className="css-un3w91 snipcss0-5-71-72">
                                  <div className="css-1a6d6qm snipcss0-6-72-73">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-73-74"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-73-75">
                                      <div className="css-1mdu17v snipcss0-8-75-76"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-72-77">
                                    <p className="css-1eud8hl snipcss0-7-77-78"></p>
                                    <p className="css-j662fd snipcss0-8-78-79">
                                      ĐỊA ĐIỂM KINH DOANH 3 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ -
                                      02873036867
                                    </p>
                                    1081C, Hậu Giang, Phường 11, Quận 6, Thành
                                    phố Hồ Chí Minh, Phường 11, Quận 6, Thành
                                    phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-71-80"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-81 style-Ed1mU"
                              id="style-Ed1mU"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-81-82 style-LFTP1"
                                id="style-LFTP1"
                              >
                                <div className="css-un3w91 snipcss0-5-82-83">
                                  <div className="css-1a6d6qm snipcss0-6-83-84">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-84-85"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-84-86">
                                      <div className="css-1mdu17v snipcss0-8-86-87"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-83-88">
                                    <p className="css-1eud8hl snipcss0-7-88-89"></p>
                                    <p className="css-j662fd snipcss0-8-89-90">
                                      Địa điểm Kinh doanh 4 - Công Ty Cổ Phần
                                      Thương Mại Dịch Vụ Phong Vũ - 02873046867
                                    </p>
                                    164, Lê Văn Việt, Tăng Nhơn Phú B, TP.Thủ
                                    Đức, Phường Tăng Nhơn Phú B, Thành phố Thủ
                                    Đức, Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-82-91"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-92 style-HPgd2"
                              id="style-HPgd2"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-92-93 style-dcaRg"
                                id="style-dcaRg"
                              >
                                <div className="css-un3w91 snipcss0-5-93-94">
                                  <div className="css-1a6d6qm snipcss0-6-94-95">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-95-96"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-95-97">
                                      <div className="css-1mdu17v snipcss0-8-97-98"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-94-99">
                                    <p className="css-1eud8hl snipcss0-7-99-100"></p>
                                    <p className="css-j662fd snipcss0-8-100-101">
                                      ĐỊA ĐIỂM KINH DOANH 39 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ
                                    </p>
                                    292/15 Cách Mạng Tháng 8, Phường 10, Quận 3,
                                    Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-93-102"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-103 style-Xt7gL"
                              id="style-Xt7gL"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-103-104 style-wkpDD"
                                id="style-wkpDD"
                              >
                                <div className="css-un3w91 snipcss0-5-104-105">
                                  <div className="css-1a6d6qm snipcss0-6-105-106">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-106-107"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-106-108">
                                      <div className="css-1mdu17v snipcss0-8-108-109"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-105-110">
                                    <p className="css-1eud8hl snipcss0-7-110-111"></p>
                                    <p className="css-j662fd snipcss0-8-111-112">
                                      Địa điểm kinh doanh 48 - Công ty cổ phần
                                      Thương mại - Dịch vụ Phong Vũ -
                                      02873026867
                                    </p>
                                    Số 2, Đường Hoàng Hoa Thám, Phương 12, ,
                                    Quận Tân Bình, Thành phố Hồ Chí Minh, Phường
                                    12, Quận Tân Bình, Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-104-113"></div>
                              </div>
                            </div>
                            <div
                              className="css-1sks6na snipcss0-3-36-114 style-oIpVj"
                              id="style-oIpVj"
                            >
                              <div
                                className="teko-col css-gr7r8o snipcss0-4-114-115 style-sZmG5"
                                id="style-sZmG5"
                              >
                                <div className="css-un3w91 snipcss0-5-115-116">
                                  <div className="css-1a6d6qm snipcss0-6-116-117">
                                    <input
                                      type="radio"
                                      className="teko-radio-input css-1ef6d5l snipcss0-7-117-118"
                                    />
                                    <div className="radio-inner css-1q3w26f snipcss0-7-117-119">
                                      <div className="css-1mdu17v snipcss0-8-119-120"></div>
                                    </div>
                                  </div>
                                  <div className="css-1yyu6fw snipcss0-6-116-121">
                                    <p className="css-1eud8hl snipcss0-7-121-122"></p>
                                    <p className="css-j662fd snipcss0-8-122-123">
                                      ĐỊA ĐIỂM KINH DOANH 5 - CÔNG TY CỔ PHẦN
                                      THƯƠNG MẠI - DỊCH VỤ PHONG VŨ -
                                      02873056867
                                    </p>
                                    Số 9 - 11, Nguyễn Thị Thập, Phường Tân Phú,
                                    Quận 7, Thành phố Hồ Chí Minh, Phường Tân
                                    Phú, Quận 7, Thành phố Hồ Chí Minh
                                    <p></p>
                                  </div>
                                </div>
                                <div className="css-1wr4ueo snipcss0-5-115-124"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "inline-grid" }}>
                        <h6>Thông tin khách hàng</h6>
                        <label>
                          Tên khách hàng
                          <Input
                            placeholder="Tên khách hàng"
                            allowClear
                            onChange={onChange}
                          />
                        </label>
                        <label>
                          Số điện thoại
                          <Input
                            placeholder="Số điện thoại"
                            allowClear
                            onChange={onChange}
                          />
                        </label>
                      </div>
                    </MDBTabsPane>
                  </MDBTabsContent>
                </div>
              </div>
              {/*  */}

              {/*  */}

              <div className="css-18c0ysw snipcss0-4-4-52">
                <div type="subtitle" className="css-1realo9 snipcss0-5-52-53">
                  Ghi chú cho đơn hàng
                </div>
                <div className="css-boqvfl snipcss0-5-52-54">
                  <Input
                    type="text"
                    maxLength={255}
                    placeholder="Ghi chú"
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
                            onClick={handleBuyVNpay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán VNPAY-QR
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
                            onClick={handleBuyVNpay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-76-77"
                            >
                              Thanh toán VNPAY-QR
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
                            Thanh toán VNPAY-QR
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
                            onClick={handleBuyCOD}
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
                            onClick={handleBuyCOD}
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
                            onClick={handleBuyMoMoPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-82-83"
                            >
                              Thanh toán QR Code Momo
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
                            onClick={handleBuyMoMoPay}
                          >
                            <div
                              type="subtitle"
                              className="css-qat15y snipcss0-9-82-83"
                            >
                              Thanh toán QR Code Momo
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
                            Thanh toán QR Code Momo
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

              <div className="teko-row teko-row-start teko-row-middle css-1dmv21i snipcss0-4-4-87">
                <label className="check-box css-1arb6mh snipcss0-5-87-88">
                  <Checkbox onChange={onChange}></Checkbox>
                </label>
                <div type="body" className="css-1os8pr0 snipcss0-5-87-93">
                  Tôi muốn xuất hóa đơn
                </div>
              </div>

              <div
                data-content-region-name="staffCode"
                data-track-content="true"
                data-content-name="referralCode"
                data-content-target="checkout"
                className="css-18c0ysw snipcss0-4-4-94"
              >
                <div className="css-18c0ysw snipcss0-4-4-52">
                  <div type="subtitle" className="css-1realo9 snipcss0-5-52-53">
                    Nhập mã nhân viên tư vấn
                  </div>
                  <div className="css-boqvfl snipcss0-5-52-54">
                    <Input
                      type="text"
                      maxLength={255}
                      placeholder="Đây là mã giới thiệu không có tác dụng cho đơn hàng"
                    />
                  </div>
                </div>
              </div>
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
              <div className="snipcss0-4-99-155">
                <div className="css-1pnc6ez snipcss0-5-155-156">
                  <div className="teko-row teko-row-no-wrap teko-row-space-between css-1o3gs9x2 snipcss0-6-156-157">
                    <div className="teko-col css-gr7r8o2 snipcss0-7-157-158">
                      <label className="check-box css-1arb6mh snipcss0-8-158-159">
                        <Checkbox onChange={onChange}></Checkbox>
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
              </div>
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
                              <tr>
                                <td colSpan={1}>Phí vận chuyển</td>
                                <td colSpan={3}>Miễn Phí</td>
                              </tr>
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
                      <div className="css-12xhfzh snipcss0-8-202-206">
                        <p className="snipcss0-9-206-207">
                          Nhấn "Thanh toán" đồng nghĩa với việc bạn đọc và đồng
                          ý tuân theo 
                          <a
                            href="https://help.phongvu.vn/chinh-sach-ban-hang/quyen-va-nghia-vu-cac-ben"
                            target="_blank"
                            className="snipcss0-10-207-208"
                          >
                            Điều khoản và Điều kiện
                          </a>
                        </p>
                      </div>
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
