import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./Buy.css";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Radio, Input, Checkbox, Modal, Button, Form, Select,Space } from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";
const { TextArea } = Input;
const { Option } = Select;

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
//

export default function Buy(props) {
  const { user } = props;
  console.log(props);

  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate("/profile");
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // select mới
  const [city, setCity] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCity(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // select city
  const handleCityChange = (value) => {
    const selectedCity = city.find((city) => city.Id === value);
    setSelectedCity(selectedCity);
    setSelectedDistrict(null);
  };
  //select district
  const handleDistrictChange = (value) => {
    const selectedDistrict = selectedCity.Districts.find(
      (district) => district.Id === value
    );
    setSelectedDistrict(selectedDistrict);
  };
  //select ward
  const handleWardChange = (value) => {
    const selectedWard = selectedDistrict.Wards.find(
      (ward) => ward.Id === value
    );
    setSelectedWard(selectedWard);
  };

  const [fillActive, setFillActive] = useState("tab1");

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
    title: 'Bạn chưa đăng nhập?',
    icon: <ExclamationCircleFilled />,
    content: 'Hãy đăng nhập để sửa dụng tính năng này!',
    onOk() {
      console.log('Đăng nhập');
      navigate("/login");
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

  const [buysData, setBuysData] = useState(null);
  // Lấy dữ liệu từ sessionStorage khi component được tải
  useEffect(() => {
    const buysDataFromSession = sessionStorage.getItem("buys");
    if (buysDataFromSession) {
      // Chuyển dữ liệu từ chuỗi JSON thành đối tượng JavaScript
      const parsedBuysData = JSON.parse(buysDataFromSession);
      setBuysData(parsedBuysData);
    }
  }, []);

  const handleBuyClick = () => {
    navigate("/");
  };
  const handleAddClick = () => {
    navigate("/profile");
  };

  const handleBuyVNpay = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/pay/create_payment_url`;
  };
  

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
                      <h7>Thông tin nhận hàng</h7>
                      <div
                        className="teko-row teko-row-start css-1v9diph snipcss-f7MJM style-Aergz"
                        id="style-Aergz"
                      >
                        <div
                          className="teko-col teko-col-6 css-gr7r8o style-bjeqp"
                          id="style-bjeqp"
                        >
                          {user ? (
                            <Button
                              data-content-region-name="shippingAddress"
                              data-track-content="true"
                              data-content-name="homeDelivery"
                              data-content-index={0}
                              data-content-target={79}
                              className="css-1014eaz style-tofZn"
                              id="style-tofZn"
                              onClick={handleContinueClick}
                            >
                              <div>
                                <span id="style-owhaV" className="style-owhaV">
                                  {/* user name */}
                                  {user && <div>{user.name}</div>}
                                </span>
                                {/* icon */}
                                <div
                                  data-content-region-name="shippingAddress"
                                  data-track-content="true"
                                  data-content-name="editAddress"
                                  className="css-7kp13n"
                                >
                                  <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    size={20}
                                    className="css-1e44j4b"
                                    color="#848788"
                                    height={20}
                                    width={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M14.4798 5.35373C14.968 4.86557 15.7594 4.86557 16.2476 5.35373L16.6919 5.79803C17.1801 6.28618 17.1801 7.07764 16.6919 7.56579L16.1819 8.07582L13.9698 5.86375L14.4798 5.35373ZM12.9092 6.92441L6.23644 13.5971L5.68342 16.3622L8.44851 15.8092L15.1212 9.13648L12.9092 6.92441ZM16.707 9.67199L9.3486 17.0304C9.24389 17.1351 9.11055 17.2065 8.96535 17.2355L4.87444 18.0537C4.62855 18.1029 4.37434 18.0259 4.19703 17.8486C4.01971 17.6713 3.94274 17.4171 3.99192 17.1712L4.8101 13.0803C4.83914 12.9351 4.91051 12.8017 5.01521 12.697L13.4192 4.29307C14.4931 3.21912 16.2343 3.21912 17.3083 4.29307L17.7526 4.73737C18.8265 5.81131 18.8265 7.55251 17.7526 8.62645L16.7174 9.66162C16.7157 9.66336 16.714 9.6651 16.7122 9.66683C16.7105 9.66856 16.7088 9.67028 16.707 9.67199ZM3.15918 20.5908C3.15918 20.1766 3.49497 19.8408 3.90918 19.8408H20.2728C20.687 19.8408 21.0228 20.1766 21.0228 20.5908C21.0228 21.005 20.687 21.3408 20.2728 21.3408H3.90918C3.49497 21.3408 3.15918 21.005 3.15918 20.5908Z"
                                      fill="#82869E"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                              {/* sdt */}
                              <div> {user && <div>{user.phone}</div>} </div>
                              {/* addres */}
                              <div id="style-GqGe8" className="style-GqGe8">
                                {user && <div>{user.address}</div>}
                              </div>
                            </Button>
                          ) : (
                            <Button
                              data-content-region-name="shippingAddress"
                              data-track-content="true"
                              data-content-name="homeDelivery"
                              data-content-index={0}
                              data-content-target={79}
                              className="css-1014eaz style-tofZn"
                              id="style-tofZn"
                              onClick={showConfirm}
                            >
                              <div>
                                <span id="style-owhaV" className="style-owhaV">
                                  {/* user name */}
                                  {user && <div>{user.name}</div>}
                                </span>
                                {/* icon */}
                                <div
                                  data-content-region-name="shippingAddress"
                                  data-track-content="true"
                                  data-content-name="editAddress"
                                  className="css-7kp13n"
                                >
                                  <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    size={20}
                                    className="css-1e44j4b"
                                    color="#848788"
                                    height={20}
                                    width={20}
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M14.4798 5.35373C14.968 4.86557 15.7594 4.86557 16.2476 5.35373L16.6919 5.79803C17.1801 6.28618 17.1801 7.07764 16.6919 7.56579L16.1819 8.07582L13.9698 5.86375L14.4798 5.35373ZM12.9092 6.92441L6.23644 13.5971L5.68342 16.3622L8.44851 15.8092L15.1212 9.13648L12.9092 6.92441ZM16.707 9.67199L9.3486 17.0304C9.24389 17.1351 9.11055 17.2065 8.96535 17.2355L4.87444 18.0537C4.62855 18.1029 4.37434 18.0259 4.19703 17.8486C4.01971 17.6713 3.94274 17.4171 3.99192 17.1712L4.8101 13.0803C4.83914 12.9351 4.91051 12.8017 5.01521 12.697L13.4192 4.29307C14.4931 3.21912 16.2343 3.21912 17.3083 4.29307L17.7526 4.73737C18.8265 5.81131 18.8265 7.55251 17.7526 8.62645L16.7174 9.66162C16.7157 9.66336 16.714 9.6651 16.7122 9.66683C16.7105 9.66856 16.7088 9.67028 16.707 9.67199ZM3.15918 20.5908C3.15918 20.1766 3.49497 19.8408 3.90918 19.8408H20.2728C20.687 19.8408 21.0228 20.1766 21.0228 20.5908C21.0228 21.005 20.687 21.3408 20.2728 21.3408H3.90918C3.49497 21.3408 3.15918 21.005 3.15918 20.5908Z"
                                      fill="#82869E"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                              {/* sdt */}
                              <div> {user && <div>{user.phone}</div>} </div>
                              {/* addres */}
                              <div id="style-GqGe8" className="style-GqGe8">
                                {user && <div>{user.address}</div>}
                              </div>
                            </Button>
                          )}
                        </div>
                        
                        <div
                          data-content-region-name="addressShipping"
                          data-track-content="true"
                          data-content-name="addNewAddress"
                          className="teko-col teko-col-6 css-gr7r8o style-Jlvl6"
                          id="style-Jlvl6">
                          {user ? (
                          <button
                          height="100%"
                          className="css-162xo41 style-kRCXj"
                          type="button"
                          id="style-kRCXj"
                          onClick={handleAddClick}
                          >
                          <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          size={25}
                          className="css-1e44j4b"
                          color="#848788"
                          height={25}
                          width={25}
                          xmlns="http://www.w3.org/2000/svg"
                          >
                          <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.75 4C12.75 3.58579 12.4142 3.25 12 3.25C11.5858 3.25 11.25 3.58579 11.25 4V11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H11.25V20C11.25 20.4142 11.5858 20.75 12 20.75C12.4142 20.75 12.75 20.4142 12.75 20V12.75H20C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25H12.75V4Z"
                          fill="#82869E"
                          ></path>
                          </svg>
                          Thêm địa chỉ
                          <span id="style-EqcsP" className="style-EqcsP">
                          <div className="css-157jl91"></div>
                          </span>
                          </button>
                          ) : (
                          <button
                          height="100%"
                          className="css-162xo41 style-kRCXj"
                          type="button"
                          id="style-kRCXj">
                          <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          size={25}
                          className="css-1e44j4b"
                          color="#848788"
                          height={25}
                          width={25}
                          xmlns="http://www.w3.org/2000/svg"
                          >
                          <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.75 4C12.75 3.58579 12.4142 3.25 12 3.25C11.5858 3.25 11.25 3.58579 11.25 4V11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H11.25V20C11.25 20.4142 11.5858 20.75 12 20.75C12.4142 20.75 12.75 20.4142 12.75 20V12.75H20C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25H12.75V4Z"
                          fill="#82869E"
                          ></path>
                          </svg>
                          Thêm địa chỉ
                          <span id="style-EqcsP" className="style-EqcsP">
                          <div className="css-157jl91"></div>
                          </span>
                          </button>

                          )}
                        
                        </div>


                      </div>
                      <div className="radio">
                        <label>
                          Phương thức giao hàng
                          <Radio defaultChecked>Giao hàng tiêu chuẩn</Radio>
                        </label>
                      </div>

                      <div className="css-18c0ysw snipcss0-4-4-52">
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
                      </div>
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
                  <Input type="text" maxLength={255} placeholder="Ghi chú" />
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
                          Thanh toán qua Internet Banking, Visa, Master, JCB,
                          VNPAY-QR
                        </div>
                      </Button>
                    </div>
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
                      >
                        <div
                          type="subtitle"
                          className="css-qat15y snipcss0-9-82-83"
                        >
                          Thanh toán QR Code ZaloPay
                          <span
                            className="snipcss0-10-83-84 style-DJQy2"
                            id="style-DJQy2"
                          ></span>
                        </div>
                        <div
                          type="body"
                          color="textSecondary"
                          className="css-ngriz3 snipcss0-9-82-85"
                        >
                          Thanh toán QR Code ZaloPay
                        </div>
                        <div
                          type="body"
                          className="css-9o8e5m snipcss0-9-82-86"
                        ></div>
                      </Button>
                    </div>
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
                                  src={item.thumbnail} // Lấy URL ảnh từ dữ liệu
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
                                {item.name}
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
                              <span className="css-p2smad snipcss0-6-21-22 snipcss0-10-120-121">
                                {formatCurrency(item.promoPrice)}
                              </span>
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
                                <td colSpan={1}>Tổng tiền tam tính</td>
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
                          {user ? (
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
                             className="att-checkout-button css-v463h2 snipcss0-9-203-204">
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
      <Modal
        title="Thông tin khách hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* body */}
        <div className="css-1g8ztiq snipcss-lpZLl">
          <form className="teko-form-vertical css-kxydk6">
            <div className="teko-row teko-form-item css-hsl6pk">
              <div className="teko-col teko-form-item-label css-1mmulcy">
                <label
                  htmlFor="name"
                  className="teko-form-item-no-colon teko-form-item-required css-15ognui style-HFi9o"
                  id="style-HFi9o"
                >
                  <div type="body" color="textTitle" className="css-1ohipf9">
                    Họ tên
                  </div>
                </label>
              </div>
              <div className="teko-col teko-form-item-control css-10ikb73">
                <div className="teko-form-item-control-input">
                  <div className="teko-form-item-control-input-content">
                    <div className="css-5xvlco">
                      <Input
                        type="text"
                        maxLength={255}
                        placeholder="Vui lòng nhập tên người nhận"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="teko-row teko-row-space-between css-1o3gs9x">
              <div className="teko-col css-gr7r8o style-kSbpZ" id="style-kSbpZ">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="telephone"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-gDaoi"
                      id="style-gDaoi"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Số điện thoại
                      </div>
                    </label>
                  </div>
                  <div className="teko-col teko-form-item-control css-10ikb73">
                    <div className="teko-form-item-control-input">
                      <div className="teko-form-item-control-input-content">
                        <div className="css-5xvlco">
                          <Input
                            type="text"
                            maxLength={255}
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="teko-col css-gr7r8o style-ZI6gN" id="style-ZI6gN">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="email"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-MGwiV"
                      id="style-MGwiV"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Email
                      </div>
                    </label>
                  </div>
                  <div className="teko-col teko-form-item-control css-10ikb73">
                    <div className="teko-form-item-control-input">
                      <div className="teko-form-item-control-input-content">
                        <div className="css-5xvlco">
                          <Input
                            type="text"
                            maxLength={255}
                            placeholder="Nhập Email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="css-f1fyi0">
              <div width="100%" color="divider" className="css-yae08c"></div>
            </div>
            <div type="title" className="css-3zo42j">
              Địa chỉ nhận hàng
            </div>
            <div className="teko-row teko-row-space-between css-1o3gs9x">
              <div className="teko-col css-gr7r8o style-Tgoyv" id="style-Tgoyv">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="provinceCode"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-MvFDT"
                      id="style-MvFDT"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Tỉnh/Thành phố
                      </div>
                    </label>
                  </div>
                  {/*  */}
                  <Form.Item>
                    <Select onChange={handleCityChange}>
                      {city.map((city) => (
                        <Option key={city.Id} value={city.Id}>
                          {city.Name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="teko-col css-gr7r8o style-9gr1p" id="style-9gr1p">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="districtCode"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-EyAQH"
                      id="style-EyAQH"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Quận/Huyện
                      </div>
                    </label>
                  </div>
                  <Form.Item>
                    <Select onChange={handleDistrictChange}>
                      {selectedCity &&
                        selectedCity.Districts.map((district) => (
                          <Option key={district.Id} value={district.Id}>
                            {district.Name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="teko-row teko-row-space-between css-1c33opk">
              <div className="teko-col css-gr7r8o style-AUdNr" id="style-AUdNr">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="wardCode"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-vhZwt"
                      id="style-vhZwt"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Phường/Xã
                      </div>
                    </label>
                  </div>

                  <Form.Item>
                    <Select onChange={handleWardChange}>
                      {selectedDistrict &&
                        selectedDistrict.Wards.map((ward) => (
                          <Option key={ward.Id} value={ward.Id}>
                            {ward.Name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="teko-col css-gr7r8o style-yGp84" id="style-yGp84">
                <div className="teko-row teko-form-item css-hsl6pk">
                  <div className="teko-col teko-form-item-label css-1mmulcy">
                    <label
                      htmlFor="address"
                      className="teko-form-item-no-colon teko-form-item-required css-15ognui style-qMHr5"
                      id="style-qMHr5"
                    >
                      <div
                        type="body"
                        color="textTitle"
                        className="css-1ohipf9"
                      >
                        Địa chỉ cụ thể
                      </div>
                    </label>
                  </div>
                  <div className="teko-col teko-form-item-control css-10ikb73">
                    <div className="teko-form-item-control-input">
                      <div className="teko-form-item-control-input-content">
                        <div className="css-5xvlco">
                          <Input
                            type="text"
                            maxLength={255}
                            placeholder="Số nhà,ngõ,tên đường..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="teko-row teko-row-end css-1o3gs9x">
              <div className="teko-row teko-form-item css-hsl6pk">
                <div className="teko-col teko-form-item-control css-10ikb73">
                  <div className="teko-form-item-control-input">
                    <div className="teko-form-item-control-input-content">
                      <label
                        value="false"
                        id="isDefault"
                        className="check-box css-1arb6mh"
                      >
                        <div className="css-l24w9c">
                          <input type="checkbox" className="css-lc01j1" />
                          <div className="checkbox-inner css-gfk8lf">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              size={12}
                              className="css-u5ggi9"
                              color="transparent"
                              height={12}
                              width={12}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 12.4545L9.375 17L19 7"
                                stroke="#82869E"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <div
                          type="body"
                          className="checkbox-label css-10md8qb style-8YjM4"
                          id="style-8YjM4"
                        >
                          Đặt làm mặc định
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Form.Item>
              <Button>Xác nhận</Button>
            </Form.Item>
          </form>
        </div>
      </Modal>
    </>
    
  );
}
