import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
  notification,
  DatePicker,
  Spin,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { NotificationBeenLoggedOut } from "../../../NotificationsForm/Authenticated";
import "./style.css";

function NewDiscountCode() {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [discountType, setDiscountType] = useState("vnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [start_date, setStart_date] = useState();
  const [end_date, setEnd_date] = useState();

  useEffect(() => {}, []);
  const onFinish = async (value) => {
    setIsModalOpen(true);
    const values = {
        ...value,
        start_date: value.rangeDate[0],
        end_date: value.rangeDate[1],
      };
      delete values.rangeDate;
            const url = `${process.env.REACT_APP_API_URL}/discount/add`;
            try {
                const res = await axios.post(url, values, { withCredentials: true });
                if (res.status === 200) {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.success({
                            message: "Thành công",
                            description: "Mã giảm giá đã được lưu thành công!",
                        });
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.error({
                            message: "Lỗi",
                            description: "Có lỗi xảy ra khi lưu dữ liệu!",
                        });
                    }, 1000);
                }
            } catch (e) {
                // Nếu lỗi chưa đăng nhập
                if (e.response.data.message === "Unauthorized") {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        NotificationBeenLoggedOut();
                    }, 500);
                } else {
                    // Các lỗi khác
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.error({
                            message: "Lỗi",
                            description: "Có lỗi xảy ra khi lưu dữ liệu!",
                        });
                    }, 1000);
                }
            }
  };
  const onFinishFailed = async (err) => {
    console.log(err);
  };
  return (
    <div className="container-type-product">
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form
          style={{ maxWidth: 1000, textAlign: "start", minWidth: 800 }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item
            label="Nội dung phiếu"
            name="content"
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
          >
            <Input placeholder="Nhập Nội dung phiếu" />
          </Form.Item>
          <Form.Item
            label="Giá trị"
            style={{ marginRight: "20px" }}
            name={discountType === "vnd" ? "value_vnd" : "value_percent"}
            id={discountType === "vnd" ? "value_vnd" : "value_percent"}
          >
            <InputNumber
              addonAfter={
                <Button
                  type="primary"
                  onClick={() => {
                    discountType === "vnd"
                      ? setDiscountType("percent")
                      : setDiscountType("vnd");
                  }}
                >
                  {discountType === "vnd" ? "VND" : "%"}
                </Button>
              }
              type="number"
              min={discountType === "percent" ? 0 : undefined}
              max={discountType === "percent" ? 100 : undefined}
            />
          </Form.Item>
          <Form.Item label="Thời gian áp dụng" name="rangeDate">
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Xác nhận
          </Button>
          <Modal open={isModalOpen} footer={null} closeIcon={null}>
            <Spin tip="Đang tải lên..." spinning={true}>
              <div style={{ minHeight: "50px" }} className="content" />
            </Spin>
          </Modal>
        </Form>
      </div>
    </div>
  );
}
export default NewDiscountCode;
