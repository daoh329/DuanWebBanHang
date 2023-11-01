import React, { useState, useEffect, useCallback } from "react";
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
  faClipboardList,
  faBell,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "./AddressManager/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { update } from "../../redux/userSlice";
import NotificationsLayout from "./NotificationsManager/NotificationsLayout";
import Order from "./OrderInformations/Order";
import { CreateNotification } from "../../component/NotificationManager/NotificationManager";

export default function Profile() {
  // lấy trạng thái được truyền qua bằng thẻ Link
  const location = useLocation();
  const tab = location.state?.tab;
  // Lấy thông tin người dùng trong redux
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verticalActive, setVerticalActive] = useState(tab ? tab : "tab1");
  const [iconsActive, setIconsActive] = useState("tab1");

  // Hàm tải dữ liệu
  const loadData = useCallback(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/order/orderhistory/id/${user.id}`)
        .then(res => {
            setData(res.data);
            const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setData(sortedOrders || []);
        })
        .catch(error => console.log(error));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const [form] = Form.useForm();
  // Hàm được gọi khi submit update profile
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
        };
        // Cập nhật thông tin người dùng mới
        return setTimeout(() => {
          setIsLoading(false);
          message.success("Cập nhật thành công");
          dispatch(update(newData));
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

  const handleVerticalClick = (value) => {
    if (value === verticalActive) {
      return;
    }
    setVerticalActive(value);
  };

  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  };

  // Hàm xác nhận đơn hàng
  const handleConfirmOrder = async (record) => {
    if (record.order_id) {
      console.log("Confirm order button clicked for order:", record.order_id);
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/order/buyback/${record.order_id}`
        );
        loadData(); // Gọi lại hàm tải dữ liệu sau khi xác nhận đơn hàng
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    } else {
      console.error("Order ID is undefined:", record);
    }
  };

  // Hàm hủy đơn hàng
  const handleCancelOrder = async (record) => {
    if (record.order_id) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/order/cancelorder/${record.order_id}`
        );
        CreateNotification(
          record.user_id,
          record.order_id,
          "2",
          "Hủy đơn hàng thành công",
          `Đơn hàng ${record.order_id} đã được hủy thành công`
        );
        loadData(); // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    } else {
      console.error("Order ID is undefined:", record);
    }
  };

  const [order, setOrder] = useState(null);
  const handleOpenOrderInformations = (order_id) => {
    try {
      const orderData = data.filter((order) => order.order_id === order_id);
      setOrder(orderData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToInformationsNotification = (parentPage, order_id ) => {
    handleOpenOrderInformations(order_id);
    setVerticalActive(parentPage);

  }

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "magd",
      render: (order_id) => (
        <Link onClick={() => handleOpenOrderInformations(order_id)}>
          {order_id}
          <p>Xem chi tiết</p>
        </Link>
      ),
    },
    { title: "Sản phẩm", dataIndex: "shortDescription", key: "name" },
    {
      title: "Tổng giá",
      key: "totalPrice",
      render: (text, record) => <p>{record.price * record.quantity}</p>,
    },

    {
      title: "Ngày mua",
      dataIndex: "order_updated_at",
      key: "updated_at",
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "status",
      render: (status) => (
        <span
          style={{
            fontWeight: "bold",
            color:
              status === 1
                ? "green"
                : status === 2
                ? "red"
                : status === 3
                ? "#FF33FF"
                : status === 4
                ? "#00DD00"
                : status === 5
                ? "red"
                : "orange",
          }}
        >
          {status === 1
            ? "Đã xác nhận"
            : status === 2
            ? "Đã bị hủy"
            : status === 3
            ? "Đang vận chuyển"
            : status === 4
            ? "Đã giao hàng"
            : status === 5
            ? "Giao hàng không thành công"
            : "Chưa xác nhận"}
        </span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <span>
          {record.order_status === 0 ? (
            <Button
              className="cancel-button"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => handleCancelOrder(record)}
            >
              Hủy
            </Button>
          ) : record.order_status === 2 || record.order_status === 5 ? (
            <Button
              className="buy-again-button"
              style={{ backgroundColor: "#33CCFF", color: "white" }}
              onClick={() => handleConfirmOrder(record)}
            >
              Mua lại
            </Button>
          ) : null}
        </span>
      ),
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Đặt vị trí cuộn lên đầu trang khi trang mới được tải
  }, []);
  
  return (
    <>
      <MDBRow>
        <MDBCol size="3">
          <MDBTabs className="flex-column text-center">
            {/* profile */}
            <MDBTabsItem>
              <MDBTabsLink
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => handleVerticalClick("tab1")}
                active={verticalActive === "tab1"}
              >
                <Avatar src={user.picture} size="large" />
                {user.name}
              </MDBTabsLink>
            </MDBTabsItem>

            {/* Orders Manager */}
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
            {/*  */}
            <MDBTabsPane show={verticalActive === "tab1"}>
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
            </MDBTabsPane>

            {/* Orders manager */}
            {order ? (
              <MDBTabsPane className="tab-2" show={verticalActive === "tab2"}>
                <Order setOrder={setOrder} order={order} />
              </MDBTabsPane>
            ) : (
              <MDBTabsPane
                style={{ paddingTop: "20px" }}
                className="tab-2"
                show={verticalActive === "tab2"}
              >
                <h5 style={{ display: "flex" }}>Quản lý đơn hàng</h5>
                {/* Tab */}
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
                      Vận chuyển
                    </MDBTabsLink>
                  </MDBTabsItem>
                  <MDBTabsItem>
                    <MDBTabsLink
                      onClick={() => handleIconsClick("tab4")}
                      active={iconsActive === "tab4"}
                    >
                      Đã giao
                    </MDBTabsLink>
                  </MDBTabsItem>
                  <MDBTabsItem>
                    <MDBTabsLink
                      onClick={() => handleIconsClick("tab5")}
                      active={iconsActive === "tab5"}
                    >
                      Đã hủy
                    </MDBTabsLink>
                  </MDBTabsItem>
                </MDBTabs>
                {/* order informations */}
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
                    {data.filter((order) => order.order_status === 3).length >
                    0 ? (
                      <Table
                        columns={columns}
                        dataSource={data.filter(
                          (order) => order.order_status === 3
                        )}
                      />
                    ) : (
                      "Không có đơn hàng nào đang vận chuyển"
                    )}
                  </MDBTabsPane>
                  <MDBTabsPane show={iconsActive === "tab4"}>
                    {data.filter((order) => order.order_status === 4).length >
                    0 ? (
                      <Table
                        columns={columns}
                        dataSource={data.filter(
                          (order) => order.order_status === 4
                        )}
                      />
                    ) : (
                      "Không có đơn hàng nào đã được giao"
                    )}
                  </MDBTabsPane>
                  <MDBTabsPane show={iconsActive === "tab5"}>
                    {data.filter(
                      (order) =>
                        order.order_status === 5 || order.order_status === 2
                    ).length > 0 ? (
                      <Table
                        columns={columns}
                        dataSource={data.filter(
                          (order) =>
                            order.order_status === 5 || order.order_status === 2
                        )}
                      />
                    ) : (
                      "Không có đơn hàng nào bị hủy"
                    )}
                  </MDBTabsPane>
                </MDBTabsContent>
              </MDBTabsPane>
            )}

            {/*  */}
            <MDBTabsPane show={verticalActive === "tab3"}>
              <NotificationsLayout statusPage={handleToInformationsNotification} />
            </MDBTabsPane>
            {/*  */}
            <MDBTabsPane show={verticalActive === "tab4"}>
              <Layout />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </>
  );
}
