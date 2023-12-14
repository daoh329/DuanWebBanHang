import React, { useEffect, useState } from "react";
import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { getPermission } from "../../../../../util/servicesGlobal";
import { openInfoModalNotPermission } from "../../../../NotificationsForm/Authenticated";

function FormInputCategory({ name, onUpdated }) {
  const [ol, setol] = useState("");
  // function select element
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setol(name);
  }, []);

  const onFinish = async (values) => {
    // Check permission
    if ((await getPermission()) === "user") {
      openInfoModalNotPermission();
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.put(
        `${process.env.REACT_APP_API_URL}/List/update/category`,
        [values.name, ol],
        { withCredentials: true }
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
        }, 2000);

        onUpdated();
      } else {
        setTimeout(() => {
          setIsLoading(false);
          notification.error({
            message: "Cập nhật thất bại!",
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      initialValues={{ remember: true }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* <hr /> */}
      {/* <h6 style={{ margin: "20px 0 10px 0" }}>Sửa thể loại</h6> */}
      {/* Danh mục */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        // label="Danh mục"
        name="name"
      >
        <Input placeholder="Nhập thể loại" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormInputCategory;
