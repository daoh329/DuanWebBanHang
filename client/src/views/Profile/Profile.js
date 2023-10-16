import React, { useState, useEffect } from "react";
import "./Profile.css";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { Button, Form, Input, Avatar, Table, message } from "antd";
import axios from "axios";

//hỗ trợ icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboardList,
  faBell,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "./AddressManager/Layout";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  // select mới
  const [city, setCity] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [email, setEmail] = useState("");

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

  const [userPhone, setUserPhone] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    printEmail();
  }, []);

  async function printEmail() {
    try {
      const userData = await user;
      setUserPhone(userData.phone);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    printEmail();
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/order/orderhistory/${userPhone}`)
        .then(res => {
            setData(res.data);
            const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setData(sortedOrders || []);
        })
        .catch(error => console.log(error));
  }, [userPhone]);


  const [form] = Form.useForm();
  // Hàm được gọi khi
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const id = user.id;
      const url = `${process.env.REACT_APP_API_URL}/auth/update/${id}`;
      const result = await axios.put(url, values);
      if (result.status === 200) {
        // Set lại state user
        const newData = {
          ...user,
          name: values.name,
          phone: values.phone,
        }
        // Cập nhật thông tin người dùng mới
        localStorage.setItem("user", JSON.stringify(newData));
        return setTimeout(() => {
          setIsLoading(false);
          message.success("Cập nhật thành công");
        }, 1000);
      }
      return setTimeout(() => {
        setIsLoading(false);
        message.warning("Cập nhật thất bại");
      }, 1000);
    } catch (error) {
      console.log(error);
      return setTimeout(() => {
        setIsLoading(false);
        message.error("Cập nhật thất bại");
      }, 1000);
    }
  };

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

  const columns = [
    { title: "Mã giao dịch", dataIndex: "order_id", key: "magd" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Tên sản phẩm", dataIndex: "shortDescription", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Tổng giá",
      key: "totalPrice",
      render: (text, record) => <p>{record.price * record.quantity}</p>,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "order_created_at",
      key: "created_at",
    },

    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "status",
      render: (status) => (
        <span
          style={{
            fontWeight: "bold",
            color: status === 1 ? "green" : status === 2 ? "red" : "orange",
          }}
        >
          {status === 1
            ? "Đã xác nhận"
            : status === 2
            ? "Đã bị hủy"
            : "Chưa xác nhận"}
        </span>
      ),
    },
  ];

  return (
    <>
      <MDBRow>
        <MDBCol size="3">
          <MDBTabs className="flex-column text-center">
            <MDBTabsItem>
              <MDBTabsLink
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                active={verticalActive === "tab1"}
              >
                <Avatar src={user.picture} size="large" />
                {user.name}
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

            {/* Tab thong bao */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab3")}
                active={verticalActive === "tab3"}
              >
                <FontAwesomeIcon icon={faBell} /> Thông báo
              </MDBTabsLink>
            </MDBTabsItem>
            {/* Tab quan li thong tin nhan hang */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab4")}
                active={verticalActive === "tab4"}
              >
                <FontAwesomeIcon icon={faMapLocationDot} /> Sổ địa chỉ
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>

        {/* render */}
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
                            >
                              <div type="title" className="css-vdbely">
                                Thông tin tài khoản
                              </div>
                            </div>
                            <Form
                              labelCol={{ span: 8 }}
                              wrapperCol={{ span: 16 }}
                              form={form}
                              onFinish={onFinish}
                              style={{ maxWidth: 600 }}
                              initialValues={{
                                name: user.name,
                                phone: user.phone,
                              }}
                            >
                              {/* name */}
                              <Form.Item
                                name="name"
                                label="Họ tên"
                                tooltip="Bạn muốn chúng tôi gọi bạn như thế nào."
                              >
                                <Input />
                              </Form.Item>

                              {/* phone */}
                              <Form.Item
                                name="phone"
                                rules={[
                                  {
                                    required: true,
                                    pattern: new RegExp(
                                      /(0)[3|5|7|8|9]+([0-9]{8})\b/g
                                    ),
                                    message:
                                      "Vui lòng nhập số điện thoại đúng định dạng",
                                  },
                                ]}
                                label="Số điện thoại"
                              >
                                <Input />
                              </Form.Item>

                              {/* email */}
                              <Form.Item label="Email">
                                <Input disabled value={user.email} />
                              </Form.Item>

                              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                  loading={isLoading}
                                  type="primary"
                                  htmlType="submit"
                                >
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
                    Đã hủy
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={iconsActive === "tab1"}>
                  {data.filter((order) => order.order_status === 0).length >
                  0 ? (
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (order) => order.order_status === 0
                      )}
                    />
                  ) : (
                    "Không có đơn hàng nào đang chờ xử lý"
                  )}
                </MDBTabsPane>
                <MDBTabsPane show={iconsActive === "tab2"}>
                  {data.filter((order) => order.order_status === 1).length >
                  0 ? (
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (order) => order.order_status === 1
                      )}
                    />
                  ) : (
                    "Không có đơn hàng nào được xác nhận"
                  )}
                </MDBTabsPane>
                <MDBTabsPane show={iconsActive === "tab3"}>
                  {data.filter((order) => order.order_status === 2).length >
                  0 ? (
                    <Table
                      columns={columns}
                      dataSource={data.filter(
                        (order) => order.order_status === 2
                      )}
                    />
                  ) : (
                    "Không có đơn hàng nào bị hủy"
                  )}
                </MDBTabsPane>
              </MDBTabsContent>
            </MDBTabsPane>

            <MDBTabsPane show={verticalActive === "tab3"}>
              <h6 style={{ display: "flex" }}>Thông báo dành cho bạn</h6>
            </MDBTabsPane>

            <MDBTabsPane show={verticalActive === "tab4"}>
              <Layout />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </>
  );
}