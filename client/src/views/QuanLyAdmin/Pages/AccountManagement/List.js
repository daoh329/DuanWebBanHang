import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Space,
  Input,
  Button,
  Tooltip,
  message,
  Tag,
  notification,
  Modal,
} from "antd";
import axios from "axios";
import {
  SearchOutlined,
  ReloadOutlined,
  CloseOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import "./styleList.css";
import { NotificationBeenLoggedOut } from "../../../NotificationsForm/Authenticated";

function AccountList() {
  const user = useSelector((state) => state.user);

  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [accountList, setAccountList] = useState([]);
  useEffect(() => {
    if (user) {
      getAllAccounts();
    }
  }, [user]);

  const getAllAccounts = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/account-management/list`;
      const results = await axios.get(url, { withCredentials: true });
      if (results.status === 200) {
        var arrCopy = [];
        if (user.permission === "superadmin") {
          arrCopy = [...results.data].filter(
            (item) => !(item.id === user.id) && item.permission !== "superadmin"
          );
        }else{
          arrCopy = [...results.data].filter(
            (item) => !(item.id === user.id) && item.permission !== "superadmin" && item.permission !== "admin"
          );
        }
        
        arrCopy.forEach((item) => {
          item.key = item.id;
        });
        setAccountList(arrCopy);
      } else {
        console.log(results);
      }
    } catch (error) {
      console.log(error);
      if (error.reponse.status === 401) {
        NotificationBeenLoggedOut();
      }
    }
  };

  // logic filter
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Hàm search filter
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined style={{ color: "#fff" }} />}
            size="small"
            style={{ width: 90 }}
          />
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
            icon={<ReloadOutlined />}
          />
          <Button
            type="link"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => {
              close();
            }}
          />
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const handleLockAccount = (accoutId) => {
    message.info("Tính năng sẽ được hoàn thiện trong thời gian tới");
    // console.log("accoutId: ", accoutId);
  };

  const handleDeleteAccount = (accoutId) => {
    message.info("Tính năng sẽ được hoàn thiện trong thời gian tới");
    // console.log("accoutId: ", accoutId);
  };

  const { confirm } = Modal;

  const handleUpPermission = async (accountId) => {
    confirm({
      title: "Chý ý",
      icon: <ExclamationCircleFilled />,
      content:
        "Bạn có chắc chắn muốn nâng quyền hạn của tài khoản này lên admin?",
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      async onOk() {
        if (user.permission === "superadmin") {
          try {
            const url = `${process.env.REACT_APP_API_URL}/account-management/up-permission`;
            const results = await axios.put(
              url,
              { accountId },
              { withCredentials: true }
            );

            if (results?.status === 200) {
              notification.success({
                message: "Thành công",
              });
            } else {
              console.log(results);
              notification.error({
                message: "Cấp quyền thất bại",
              });
            }
          } catch (error) {
            console.log(error);
            notification.error({
              message: "Cấp quyền thất bại",
            });
          }
          // reload accounts infomation
          getAllAccounts();
        } else {
          notification.info({
            message: "Bạn không có đủ quyền để thực hiện nâng quyền",
          });
        }
      },
    });
  };

  const handleDownPermission = async (accountId) => {
    confirm({
      title: "Chý ý",
      icon: <ExclamationCircleFilled />,
      content:
        "Bạn có chắc chắn muốn nâng quyền hạn của tài khoản này lên admin?",
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      async onOk() {
        if (user.permission === "superadmin") {
          try {
            const url = `${process.env.REACT_APP_API_URL}/account-management/down-permission`;
            const results = await axios.put(
              url,
              { accountId },
              { withCredentials: true }
            );

            if (results?.status === 200) {
              notification.success({
                message: "Thành công",
              });
            } else {
              console.log(results);
              notification.error({
                message: "Cấp quyền thất bại",
              });
            }
          } catch (error) {
            console.log(error);
            notification.error({
              message: "Cấp quyền thất bại",
            });
          }
          // reload accounts infomation
          getAllAccounts();
        } else {
          notification.info({
            message: "Bạn không có đủ quyền để thực hiện nâng quyền",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "18%",
      ...getColumnSearchProps("name"),
      render: (name, record) => (
        <Tooltip title={name}>
          <p className="table-text-column">{name}</p>
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "22%",
      ...getColumnSearchProps("email"),
      render: (email, record) => (
        <Tooltip title={email}>
          <p className="table-text-column">{email}</p>
        </Tooltip>
      ),
    },
    {
      title: "Quyền",
      dataIndex: "permission",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Người dùng", value: "user" },
      ],
      width: "8%",
      onFilter: (value, record) => record.permission.indexOf(value) === 0,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "isLocked",
      width: "10%",
      render: (isLocked) => (
        <Tag color={isLocked === 0 ? "success" : "error"}>
          {isLocked === 0 ? "Đang hoạt động" : "Đang bị khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      // width: "10%",
      render: (_, record) => (
        <div>
          <Tooltip
            title={
              record?.isLocked === 0 ? "Khóa tài khoản" : "Mở khóa tài khoản"
            }
          >
            <Button
              onClick={() => handleLockAccount(record.id)}
              icon={
                record?.isLocked === 0 ? <UnlockOutlined /> : <LockOutlined />
              }
              style={{ margin: "0 10px 0 0", borderRadius: "2px" }}
            />
          </Tooltip>
          <Tooltip title="Xóa tài khoản">
            <Button
              style={{ margin: "0 10px 0 0", borderRadius: "2px" }}
              onClick={() => handleDeleteAccount(record.id)}
              danger
              icon={<DeleteOutlined />}
            />
          </Tooltip>
          <Tooltip
            title={
              record.permission === "user"
                ? "Cấp quyền admin"
                : "Bỏ quyền admin"
            }
          >
            <Button
              style={{ borderRadius: "2px" }}
              onClick={() =>
                record.permission === "user"
                  ? handleUpPermission(record.id)
                  : handleDownPermission(record.id)
              }
              type="primary"
              icon={
                record.permission === "user" ? (
                  <UserAddOutlined />
                ) : (
                  <UserDeleteOutlined />
                )
              }
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // reload data
  const start = () => {
    setIsLoadingTable(true);
    setTimeout(() => {
      getAllAccounts();
      setIsLoadingTable(false);
    }, 500);
  };

  return (
    <div className="account-container">
      <div>
        <h5>Danh sách tài khoản</h5>
        <Space wrap className="action">
          <Tooltip title="Làm mới">
            <Button onClick={start} icon={<ReloadOutlined />} />
          </Tooltip>
        </Space>
      </div>
      <Table
        bordered={true}
        dataSource={accountList}
        columns={columns}
        loading={isLoadingTable}
      />
    </div>
  );
}
export default AccountList;
