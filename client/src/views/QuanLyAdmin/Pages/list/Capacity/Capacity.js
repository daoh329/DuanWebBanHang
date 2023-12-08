import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";

function Capacity() {
  const [capacities, setCapacities] = useState([]);

  useEffect(() => {
    getCapacity();
  }, []);

  // function call api get capacity list
  const getCapacity = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/List/capacity`, {
        withCredentials: true,
      })
      .then((response) => {
        const arrCopy = [...response.data.results];
        for (let i = 0; i < arrCopy.length; i++) {
          arrCopy[i].key = i + 1;
        }
        setCapacities(arrCopy);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = async (value) => {
    try {
      const results = await axios.post(
        `${process.env.REACT_APP_API_URL}/List/delete/Capacity/${value}`,
        null,
        { withCredentials: true }
      );
      if (results.status === 200) {
        message.success("Xóa thành công");
        getCapacity();
      }
    } catch (error) {
      if (error.response.status === 401) {
        NotificationBeenLoggedOut();
      } else {
        console.log(error);
        message.error("Xóa thất bại");
      }
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
            description="Bạn có chắc chắn muốn xóa?"
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
    <div style={{ padding: "0 100px 0 50px" , backgroundColor:'white', borderRadius:'5px', marginTop:'10px'}}>
      <h3 style={{ fontWeight: "bold", paddingTop:'10px' }}>Capacity</h3>
      <Table columns={columns} dataSource={capacities} />
    </div>
  );
}

export default Capacity;
