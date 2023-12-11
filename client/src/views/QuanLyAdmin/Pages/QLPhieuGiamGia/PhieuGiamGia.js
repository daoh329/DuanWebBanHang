/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { format } from "date-fns";
import axios from "axios";
import ActionButton from "./ActionComponent/ActionButton";

function discount() {
  const [discount, setdiscount] = useState([]);

  useEffect(() => {
    getPhieuGiamGia();
  }, []);

  const getPhieuGiamGia = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/discount/get`)
      .then((res) => {
        [...res.data].forEach((item) => {
          item.key = item.id;
        })
        setdiscount(res.data);
      })
      .catch((error) => console.log(error));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "nội dung", dataIndex: "content", key: "content" },
    { title: "Trị giá", key: "value",
    render:(value)=>{
      return (!(value.value_vnd==0))?value.value_vnd:`${value.value_percent}%`
    }},
 
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",  
      key: "start_date",
      render: (start_date) =>
        <div>
          <p style={{ margin: "0" }}>
            {format(new Date(start_date), "HH:mm")}
          </p>
          <p style={{ margin: "0" }}>
            {format(new Date(start_date), "dd/MM/yyyy")}
          </p>
        </div>
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) =>
        <div>
          <p style={{ margin: "0" }}>
            {format(new Date(end_date), "HH:mm")}
          </p>
          <p style={{ margin: "0" }}>
            {format(new Date(end_date), "dd/MM/yyyy")}
          </p>
        </div>
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
      <Table columns={columns} dataSource={discount} />
    </div>
  );
}

export default discount;
