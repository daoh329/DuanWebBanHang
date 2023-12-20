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
  Tag,
} from "antd";
import { SyncOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";

import {
  NotificationBeenLoggedOut,
  openInfoModalNotPermission,
} from "../../../NotificationsForm/Authenticated";
import "./style.css";
import { getPermissionCurrent, getUser } from "../../../../util/servicesGlobal";

function NewDiscountCode() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [discountType, setDiscountType] = useState("vnd");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [start_date, setStart_date] = useState();
  const [end_date, setEnd_date] = useState();

  const [changeCode, setChangeCode] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    if (changeCode && changeCode === changeCode.toUpperCase()) {
      const delay = 1500; // 1 giây
      setIsFetching(true);
      const timeoutId = setTimeout(() => {
        setDebouncedValue(changeCode);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setIsFetching(false);
    }
  }, [changeCode]);

  useEffect(() => {
    const fetchShortDescription = async () => {
      try {
        if (debouncedValue) {
          // Gửi yêu cầu kiểm tra tên lên máy chủ
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/discount/check-unique`,
            { code: debouncedValue },
            { withCredentials: true }
          );
          // Xử lý kết quả, ví dụ: hiển thị thông báo
          if (response.status === 200) {
            if (response.data.message === "Already exist") {
              setErrorCode("Mã đã tồn tại");
            } else {
              setErrorCode("");
            }
          } else {
            console.log(response.status);
          }
          setIsFetching(false);
        }
      } catch (error) {
        console.log(error);
        setErrorCode("Có lỗi xảy ra");
      }
    };

    fetchShortDescription();
  }, [debouncedValue]);

  const onFinish = async (value) => {
    // Check permission
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }

    if (errorCode) {
      return;
    }

    // setIsModalOpen(true);
    const values = {
      ...value,
      value_percent: value.value_percent ? value.value_percent : 0,
      value_vnd: value.value_vnd ? value.value_vnd : 0,
      start_date: value.rangeDate[0].format("YYYY-MM-DD HH:mm"),
      end_date: value.rangeDate[1].format("YYYY-MM-DD HH:mm"),
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

  // Hàm validate
  const validateInput = (_, value) => {
    // Bạn có thể thay đổi biểu thức chính quy tại đây
    const regex = /^[0-9A-Z]+$/;

    if (!value || regex.test(value)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Chỉ được nhập số hoặc chữ in hoa."));
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
            label={
              <>
                Mô tả ngắn ({changeCode.length}/20) &nbsp;
                {isFetching && (
                  <Tag
                    icon={<SyncOutlined style={{ fontSize: "18px" }} spin />}
                    color="processing"
                  >
                    Đang kiểm tra
                  </Tag>
                )}
                {!isFetching && errorCode && (
                  <Tag color="error">{errorCode}</Tag>
                )}
              </>
            }
            name="code"
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
            rules={[
              { required: true, message: "Trường này là bắt buộc" },
              { max: 20, message: "Không nhập quá 20 kí tự" },
              { validator: validateInput },
            ]}
          >
            <Input
              value={changeCode}
              onChange={(e) => setChangeCode(e.target.value)}
              placeholder="Mã phiếu giảm"
            />
          </Form.Item>
          <Form.Item
            label="Giá trị"
            style={{ marginRight: "20px" }}
            name={discountType === "vnd" ? "value_vnd" : "value_percent"}
            id={discountType === "vnd" ? "value_vnd" : "value_percent"}
            rules={[
              { required: true, message: "Trường này là bắt buộc" },
            ]}
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
          <Form.Item label="Thời gian áp dụng" name="rangeDate" rules={[{required: true, message: "Trường này là bắt buộc"}]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Button disabled={errorCode} type="primary" htmlType="submit">
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
