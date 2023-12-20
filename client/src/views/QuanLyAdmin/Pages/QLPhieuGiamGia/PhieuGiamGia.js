/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Tooltip } from "antd";
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import ActionButton from "./ActionComponent/ActionButton";
import { getPermissionCurrent } from "../../../../util/servicesGlobal";
import { openInfoModalNotPermission } from "../../../NotificationsForm/Authenticated";
import { formatCurrency } from "../../../../util/FormatVnd";


function discount() {
  const [discount, setdiscount] = useState([]);
  const [isReloading, setIsReloading] = useState(false);

  // get all discout_code
  useEffect(() => {
    getPhieuGiamGia();
  }, []);

  const getPhieuGiamGia = async () => {
    setIsReloading(true);
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }
    await axios
      .get(`${process.env.REACT_APP_API_URL}/discount/get`)
      .then((res) => {
        [...res.data].forEach((item) => {
          item.key = item.id;
        });
        setdiscount(res.data);
        setIsReloading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsReloading(false);
      });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Trị giá",
      key: "value",
      render: (value) => (
        <p style={{ margin: "0" }}>
          {!(value.value_vnd == 0)
            ? formatCurrency(value.value_vnd)
            : `${value.value_percent}%`}
        </p>
      ),
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => (
        <div>
          <p style={{ margin: "0" }}>{dayjs(start_date).utcOffset(0).format("HH:mm")}</p>
          <p style={{ margin: "0" }}>
            {dayjs(start_date).utcOffset(0).format("DD/MM/YYYY")}
          </p>
        </div>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => (
        <div>
          <p style={{ margin: "0" }}>{dayjs(end_date).utcOffset(0).format("HH:mm")}</p>
          <p style={{ margin: "0" }}>
            {dayjs(end_date).utcOffset(0).format("DD/MM/YYYY")}
          </p>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <ActionButton getPhieuGiamGia={getPhieuGiamGia} record={record} />
      ),
    },
  ];

  return (
    <div>
      <br />
      <h1>Quản lý phiếu giảm giá</h1>
      <Tooltip title="Làm mới">
        <Button
          onClick={getPhieuGiamGia}
          style={{ margin: "0 0 10px 0" }}
          icon={<ReloadOutlined />}
        />
      </Tooltip>
      <Table columns={columns} dataSource={discount} loading={isReloading} />
    </div>
  );
}

export default discount;
