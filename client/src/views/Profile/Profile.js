import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { Button, Form, Input, Avatar, Table, message, Modal } from "antd";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

//hỗ trợ icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faBell,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "./AddressManager/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { update } from "../../redux/userSlice";
import NotificationsLayout from "./NotificationsManager/NotificationsLayout";
import Order from "./OrderInformations/Order";
import { CreateNotification } from "../../component/NotificationManager/NotificationManager";
import { utcToZonedTime, format } from "date-fns-tz";
import { formatCurrency } from "../../util/FormatVnd";
import { NotificationBeenLoggedOut } from "../NotificationsForm/Authenticated";
import { SocketContext } from "../App";

export default function Profile() {
  // lấy trạng thái được truyền qua bằng thẻ Link
  const socket = useContext(SocketContext);
  const location = useLocation();
  // Lấy thông tin người dùng trong redux
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  // hook nhận hành động chuyển page
  useEffect(() => {
    const action = location.state?.action;
    // nếu hành động đó gọi tới thông tin đơn hàng
    // và đã có dữ liệu đơn hàng (data.length > 0)
    if (action === "call_order" && data.length > 0) {
      // lấy order_id, xác định đơn hàng và chuyển page
      loadData();
      const order_id = location.state?.order_id;
      handleOpenOrderInformations(order_id);
    }
  }, [data, location]);

  // connect socket to server
  useEffect(() => {
    if (user.id && socket) {
      // Lắng nghe sự kiện reload thông báo
      socket.on("reload-notification", (data) => {
        loadData();
      });
    }
  }, [user, socket]);

  useEffect(() => {
    if (data) {
      const arrCopy = [...data];
      arrCopy.forEach((item, index) => {
        item.key = index;
      });
      setDataTable(arrCopy);
    }
  }, [data]);

  // Hàm tải dữ liệu
  const loadData = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/order/orderhistory/id/${user.id}`)
      .then((res) => {
        // Chuyển đổi paymentData từ chuỗi đã được mã hóa sang đối tượng JavaScript
        const dataWithParsedPaymentData = res.data.map((order) => {
          let paymentData = {};
          try {
            paymentData = JSON.parse(decodeURIComponent(order.paymentData));
          } catch (error) {
            console.error("Error parsing paymentData:", error);
          }
          return {
            ...order,
            paymentData,
          };
        });

        setData(dataWithParsedPaymentData);
        const sortedOrders = dataWithParsedPaymentData.sort(
          (a, b) => new Date(b.order_created_at) - new Date(a.order_created_at)
        );
        setData(sortedOrders || []);
      })
      .catch((error) => console.log(error));
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Hàm đặt lại đơn hàng
  const handleConfirmOrder = async (record) => {
    if (record.order_id) {
      console.log("Confirm order button clicked for order:", record.order_id);
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/order/buyback/${record.order_id}`,
          null,
          { withCredentials: true }
        );
        loadData(); // Gọi lại hàm tải dữ liệu sau khi xác nhận đơn hàng
      } catch (error) {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        }
        console.error("Error confirming order:", error);
      }
    } else {
      console.error("Order ID is undefined:", record);
    }
  };

  const handleCancelOrder = async (record) => {
    // Nếu paymentMenthod là 0 hoặc 2, hiển thị thông báo yêu cầu liên hệ để hủy đơn hàng
    if (record.paymentMenthod === 0 || record.paymentMenthod === 2) {
      Modal.info({
        title: "Yêu cầu hủy đơn hàng",
        content: `Bạn đã thanh toán bằng ví điện tử nếu bạn muốn hủy đơn hàng, vui lòng liên hệ đến số 0338112099 để yêu cầu hoàn tiền và hủy đơn hàng.`,
        okText: "Đồng ý",
        cancelButtonProps: { style: { display: "none" } }, // Ẩn nút "Cancel"
      });
      // Nếu paymentMenthod là 1, hiển thị thông báo xác nhận hủy đơn hàng và thực hiện hủy nếu đồng ý
    } else if (record.order_status === 1) {
      Modal.info({
        title: "Thông báo",
        content: "Vui lòng liên hệ đến số 0338112099 để hủy đơn hàng.",
        okText: "Đồng ý",
        cancelButtonProps: { style: { display: "none" } }, // Ẩn nút "Cancel"
      });
    } else if (record.paymentMenthod === 1) {
      Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: `Bạn có chắc chắn muốn hủy đơn hàng ${record.order_id} không?`,
        okText: "Đồng ý",
        cancelText: "Không đồng ý",
        onOk: async () => {
          // Đặt logic hủy đơn hàng ở đây
          if (record.order_id) {
            try {
              await axios.put(
                `${process.env.REACT_APP_API_URL}/order/cancelorder/${record.order_id}`,
                null,
                { withCredentials: true }
              );
              CreateNotification(
                record.user_id,
                record.order_id,
                "2",
                "Hủy đơn hàng thành công",
                `Đơn hàng ${record.order_id} của bạn đã được hủy thành công`
              );
              loadData(); // Gọi lại hàm tải dữ liệu sau khi hủy đơn hàng
              // Báo lên socket là có thông báo mới cho người dùng
              if (socket) {
                // Gửi thông báo tới server khi nút được click
                socket.emit("notification", { userId: record.user_id });
              }
            } catch (error) {
              if (error.response && error.response.status === 401) {
                NotificationBeenLoggedOut();
              }
            }
          }
        },
      });
    }
  };

  // Tạo state order để chuyển sang page order mỗi khi có dữ liệu
  const handleOpenOrderInformations = (order_id) => {
    // tìm đơn hàng trong mảng đơn hàng
    // và set dữ liệu đơn hàng đó cho order
    const orderData = data.find((order) => order.order_id === order_id);
    setTimeout(() => {
      navigate(`order/${order_id}`, { state: orderData });
    }, 100)
  };

  const handleToInformationsNotification = (parentPage, order_id) => {
    handleOpenOrderInformations(order_id);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "magd",
      render: (order_id) => (
        <MDBTabsLink
          onClick={() => {
            const orderData = data.find((order) => order.order_id === order_id);
            navigate(`order/${order_id}`, { state: orderData });
          }}
        >
          {order_id}
          <p>Chi tiết</p>
        </MDBTabsLink>
      ),
    },
    // { title: "Sản phẩm", dataIndex: "shortDescription", key: "name" },
    { title: "Tổng giá", dataIndex: "totalAmount", key: "totalPrice" },

    {
      title: "Ngày mua",
      dataIndex: "order_updated_at",
      key: "updated_at",
      render: (date) => {
        const fmt = "HH:mm:ss - dd/MM/yyyy";
        const zonedDate = utcToZonedTime(date, "Etc/UTC");
        return format(zonedDate, fmt, { timeZone: "Etc/UTC" });
      },
    },

    {
      title: "PTTT",
      dataIndex: "paymentMenthod",
      key: "paymentMenthod",
      render: (status) => (
        <span
          style={{
            fontWeight: "bold",
            color: status === 1 ? "blue" : status === 2 ? "blue" : "blue",
          }}
        >
          {status === 2 ? "MOMO" : status === 1 ? "COD" : "VNPAY"}
        </span>
      ),
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
                ? "#33CCFF"
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
          {record.order_status === 0 || record.order_status === 1 ? (
            <Button
              className="cancel-button"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => handleCancelOrder(record)}
            >
              Hủy
            </Button>
          ) : null}
          {/* {record.order_status === 2 || record.order_status === 5 && (
            <Button
              className="reorder-button"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => handleConfirmOrder(record)}
            >
              Mua lại
            </Button>
          )} */}
        </span>
      ),
    },
  ];

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
                onClick={() => {
                  // handleVerticalClick(location.pathname);
                  navigate("");
                }}
                active={location.pathname === "/profile"}
              >
                <Avatar src={user.picture} size="large" />
                &nbsp;
                <span className="username-css"> {user.name}</span>
              </MDBTabsLink>
            </MDBTabsItem>

            {/* Orders Manager */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => {
                  // handleVerticalClick("order");
                  navigate("order");
                }}
                active={location.pathname === "/profile/order"}
              >
                <FontAwesomeIcon icon={faClipboardList} /> Đơn hàng
              </MDBTabsLink>
            </MDBTabsItem>

            {/* Tab thong bao */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => {
                  // handleVerticalClick("tab3");
                  navigate("notification");
                }}
                active={location.pathname === "/profile/notification"}
              >
                <FontAwesomeIcon icon={faBell} /> Thông báo
              </MDBTabsLink>
            </MDBTabsItem>

            {/* Tab quan li thong tin nhan hang */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => {
                  // handleVerticalClick("tab4");
                  navigate("addresses");
                }}
                active={location.pathname === "/profile/addresses"}
              >
                <FontAwesomeIcon icon={faMapLocationDot} /> Sổ địa chỉ
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>

        {/* render */}
        <MDBCol size="9">
          <MDBTabsContent>
            <Routes>
              <Route path="" element={<InfomationLayout />} />
              <Route
                path="order"
                element={
                  <OrderLayout
                    dataTable={dataTable}
                    columns={columns}
                    data={data}
                  />
                }
              />
              <Route path="order/:id" element={<Order />} />
              <Route
                path="notification"
                element={
                  <NotificationsLayout
                    statusPage={handleToInformationsNotification}
                  />
                }
              />
              <Route path="addresses" element={<Layout />} />
            </Routes>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </>
  );
}

const InfomationLayout = (props) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  useEffect(() => {
    // Đặt giá trị mặc định sau khi component được render
    if (user) {
      form.setFieldsValue({
        name: user?.name,
        phone: user?.phone,
      });
    }
  }, [user, form]);

  // Hàm được gọi khi submit update profile
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const id = user.id;
      const url = `${process.env.REACT_APP_API_URL}/auth/update/${id}`;
      const result = await axios.put(url, values, { withCredentials: true });
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
        if (error.response.status === 401) {
          setIsLoading(false);
          NotificationBeenLoggedOut();
        }
        setIsLoading(false);
        message.error("Cập nhật thất bại");
      }, 1000);
    }
  };

  return (
    <>
      <br />
      <div
        style={{
          textAlign: "left",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "15px",
        }}
      >
        <h5>Thông tin tài khoản</h5>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          {/* name */}
          <Form.Item
            name="name"
            label="Họ tên"
            tooltip="Bạn muốn chúng tôi gọi bạn như thế nào."
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên của bạn",
              },
              {
                max: 45,
                message: "Tên không được dài quá 45 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* phone */}
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                pattern: new RegExp(/(0)[3|5|7|8|9]+([0-9]{8})\b/g),
                message: "Vui lòng nhập số điện thoại đúng định dạng",
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
            <Button loading={isLoading} type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const OrderLayout = (props) => {
  const { dataTable, columns, data } = props;
  const [iconsActive, setIconsActive] = useState("tab1");
  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  };

  return (
    <MDBTabsPane style={{ paddingTop: "20px" }} className="tab-2" show={true}>
      <h5 style={{ display: "flex" }}>Đơn hàng</h5>
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
          {dataTable.filter((order) => order.order_status === 0).length > 0 ? (
            <Table
              columns={columns}
              dataSource={dataTable.filter((order) => order.order_status === 0)}
            />
          ) : (
            "Không có đơn hàng nào đang chờ xử lý"
          )}
        </MDBTabsPane>
        <MDBTabsPane show={iconsActive === "tab2"}>
          {dataTable.filter((order) => order.order_status === 1).length > 0 ? (
            <Table
              columns={columns}
              dataSource={data.filter((order) => order.order_status === 1)}
            />
          ) : (
            "Không có đơn hàng nào được xác nhận"
          )}
        </MDBTabsPane>
        <MDBTabsPane show={iconsActive === "tab3"}>
          {dataTable.filter((order) => order.order_status === 3).length > 0 ? (
            <Table
              columns={columns}
              dataSource={dataTable.filter((order) => order.order_status === 3)}
            />
          ) : (
            "Không có đơn hàng nào đang vận chuyển"
          )}
        </MDBTabsPane>
        <MDBTabsPane show={iconsActive === "tab4"}>
          {dataTable.filter((order) => order.order_status === 4).length > 0 ? (
            <Table
              columns={columns}
              dataSource={dataTable.filter((order) => order.order_status === 4)}
            />
          ) : (
            "Không có đơn hàng nào đã được giao"
          )}
        </MDBTabsPane>
        <MDBTabsPane show={iconsActive === "tab5"}>
          {dataTable.filter(
            (order) => order.order_status === 5 || order.order_status === 2
          ).length > 0 ? (
            <Table
              columns={columns}
              dataSource={dataTable.filter(
                (order) => order.order_status === 5 || order.order_status === 2
              )}
            />
          ) : (
            "Không có đơn hàng nào bị hủy"
          )}
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBTabsPane>
  );
};
