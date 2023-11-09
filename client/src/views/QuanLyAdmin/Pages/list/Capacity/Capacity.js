import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Capacity() {
  const [capacities, setCapacities] = useState([]);

  useEffect(() => {
    getCapacity();
  }, []);

  // function call api get capacity list
  const getCapacity = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/capacity`)
      .then((response) => {
        setCapacities(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = async (value) => {
    try {
        const results = await axios.post(`${process.env.REACT_APP_API_URL}/List/delete/Capacity/${value}`);
        if (results.status === 200) {
            getCapacity();
        }
      } catch (error) {
        console.log(error);
      }
  };

  const columns = [
    { title: "Tên danh mục", dataIndex: "capacity", key: "capacity" },
    {
      title: "Hành động",
      dataIndex: "capacity",
      key: "action",
      render: (capacity, record) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Popconfirm
            title="Cảnh báo!!!"
            description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
            onConfirm={() => handleDelete(capacity)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div style={{ padding: "0 100px 0 50px" }}>
      <h3 style={{ fontWeight: "bold" }}>Capacity</h3>
      <Table columns={columns} dataSource={capacities} />
    </div>
  );
}

export default Capacity;
