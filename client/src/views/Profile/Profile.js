import React, { useState, useEffect,useRef } from "react";
import "./Profile.css";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol,
  MDBIcons,
} from "mdb-react-ui-kit";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Avatar,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

//hỗ trợ icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboardList,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Profile(props) {
  const { user } = props;
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
    //

  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  const [verticalActive, setVerticalActive] = useState("tab1");

  const handleVerticalClick = (value) => {
    if (value === verticalActive) {
      return;
    }

    setVerticalActive(value);
  };
  const [iconsActive, setIconsActive] = useState("tab1");

  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  };

  return (
    <>
      <MDBRow>
        <MDBCol size="3">
          <MDBTabs className="flex-column text-center">
            <MDBTabsItem>
              <MDBTabsLink active={verticalActive === "tab1"}>
                {user? (
                  <>
                    <Avatar
                      src={user.picture}
                      size="large"
                    />
                    {user.name}
                    
                  </>
                ) : (
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#ae69dd", margin: "30px" }}
                  />
                )}
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab1")}
                active={verticalActive === "tab1"}
              >
                <FontAwesomeIcon icon={faUser} /> Cá nhân
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab2")}
                active={verticalActive === "tab2"}
              >
                <FontAwesomeIcon icon={faClipboardList} /> Quản lý đơn hàng
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab3")}
                active={verticalActive === "tab3"}
              >
                <FontAwesomeIcon icon={faBell} /> Thông báo
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>
        <MDBCol size="9">
          <MDBTabsContent>
            <MDBTabsPane show={verticalActive === "tab1"}>
              {/*  */}
              <div className="css-gjf6g1 snipcss-NrJii">
                <div className="css-z54kij">
                  <div className="css-hveu7a">
                    <div
                      className="teko-row css-1o3gs9x style-QHQSn"
                      id="style-QHQSn"
                    >
                      <div
                        className="teko-col teko-col-8 css-gr7r8o style-rBeFA"
                        id="style-rBeFA"
                      >
                        <div className="teko-card css-jjszbd">
                          <div className="teko-card-body css-0">
                            <div
                              className="teko-row teko-row-space-between css-1o3gs9x"
                              data-allytip="true"
                              style={{}}
                            >
                              <div type="title" className="css-vdbely">
                                Thông tin tài khoản
                              </div>
                            </div>
                            <Form
                              {...formItemLayout}
                              form={form}
                              name="register"
                              onFinish={onFinish}
                              initialValues={{ prefix: "84" }}
                              style={{ maxWidth: 600 }}
                            >
                              <Form.Item
                                name="email"
                                label="E-mail"
                                >
                                {user && (
                                <div>
                                <Input
                                disabled
                                value={user.email}
                                />
                                </div>
                                )}                              
                              </Form.Item>

                              {/* name */}
                              <Form.Item
                                name="nickname"
                                label="Tên người dùng"
                                tooltip="Bạn muốn chúng tôi gọi bạn như thế nào."
                              >
                               {user && (
                                <div>
                                <Input
                                value={user.given_name}
            
                                />
                                </div>
                                )}       
                              </Form.Item>

                              {/* phone */}
                              <Form.Item
                                name="phone"
                                label="Số điện thoại"
                              >
                                <Input
                                  addonBefore={prefixSelector}
                                  style={{
                                    width: "100%",
                                  }}
                                />
                              </Form.Item>
                              {/* Thành phố */}
                              <Form.Item label="Thành phố" name='TP'>
                                <Select onChange={handleCityChange}>
                                  {city.map((city) => (
                                    <Option key={city.Id} value={city.Id}>
                                      {city.Name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              {/* Huyện */}
                              <Form.Item label="Huyện" name="HUYEN">
                              <Select onChange={handleDistrictChange}>
                                {selectedCity &&
                                  selectedCity.Districts.map((district) => (
                                    <Option key={district.Id} value={district.Id}>
                                      {district.Name}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                              {/* Xã */}
                              <Form.Item label="Xã" name="XA">
                              <Select onChange={handleWardChange}>
                                {selectedDistrict &&
                                  selectedDistrict.Wards.map((ward) => (
                                    <Option key={ward.Id} value={ward.Id}>
                                      {ward.Name}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                              {/* capcha */}
                              <Form.Item
                                label="Captcha"
                                extra="Chúng tôi phải chắc chắn bạn là con người."
                              >
                                <Row gutter={8}>
                                  <Col span={12}>
                                    <Form.Item
                                      name="captcha"
                                      noStyle
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập captcha bất kì!",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Button>Get captcha</Button>
                                  </Col>
                                </Row>
                              </Form.Item>

                              <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                  Cập nhật
                                </Button>
                              </Form.Item>
                            </Form>
                            {/*  */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*  */}
            </MDBTabsPane>

            <MDBTabsPane className="tab-2" show={verticalActive === "tab2"}>
              <h6 style={{ display: "flex" }}>Quản lý đơn hàng</h6>
              <MDBTabs className="mb-3">
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleIconsClick("tab1")}
                    active={iconsActive === "tab1"}
                  >
                    Chờ xử lý
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleIconsClick("tab2")}
                    active={iconsActive === "tab2"}
                  >
                    Đã xác nhận
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink
                    onClick={() => handleIconsClick("tab3")}
                    active={iconsActive === "tab3"}
                  >
                    Đã hoàn thành
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={iconsActive === "tab1"}>
                  Tab 1 content
                </MDBTabsPane>
                <MDBTabsPane show={iconsActive === "tab2"}>
                  Tab 2 content
                </MDBTabsPane>
                <MDBTabsPane show={iconsActive === "tab3"}>
                  Tab 3 content
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBTabsPane>

            <MDBTabsPane show={verticalActive === "tab3"}>
              <h6 style={{ display: "flex" }}>Thông báo dành cho bạn</h6>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </>
  );
}
