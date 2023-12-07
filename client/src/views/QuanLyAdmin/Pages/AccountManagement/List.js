import React, { useEffect, useState, useRef } from "react";
import { Table, Space, Input, Button, Tooltip, message, Tag } from "antd";
import axios from "axios";
import {
  SearchOutlined,
  ReloadOutlined,
  CloseOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import "./styleList.css";
import { NotificationBeenLoggedOut } from "../../../NotificationsForm/Authenticated";

function AccountList() {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [accountList, setAccountList] = useState([]);
  useEffect(() => {
    getAllAccounts();
  }, []);

  const getAllAccounts = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/account-management/list`;
      const results = await axios.get(url, { withCredentials: true });
      if (results.status === 200) {
        const arrCopy = [...results.data];
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
              style={{ margin: "0 10px 0 0" }}
            />
          </Tooltip>
          <Tooltip title="Xóa tài khoản">
            <Button
              onClick={() => handleDeleteAccount(record.id)}
              danger
              icon={<DeleteOutlined />}
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
