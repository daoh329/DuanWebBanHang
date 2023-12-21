import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  DatePicker,
  Spin,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
// import 'dayjs/locale/vi';
import customParseFormat from "dayjs/plugin/customParseFormat";

import { getPermissionCurrent } from "../../../../../util/servicesGlobal";
import {
  NotificationBeenLoggedOut,
  openInfoModalNotPermission,
} from "../../../../NotificationsForm/Authenticated";

dayjs.extend(customParseFormat);
// dayjs.locale('vi')
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD HH:mm";

function InputFrom({ data, onClick, setModal }) {
  const discountCode = data;

  const [form] = Form.useForm();

  const [discountType, setDiscountType] = useState(
    !(parseInt(discountCode.value_vnd) === 0) ? "vnd" : "persent"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Hàm được gọi khi form hoàn thành
  const onFinishUpdate = async (value) => {
    // Check permission
    if ((await getPermissionCurrent()) === "user") {
      openInfoModalNotPermission();
      return;
    }

    setIsLoading(true);
    const values = {
      ...value,
      value_percent: value.value_percent ? value.value_percent : 0,
      value_vnd: value.value_vnd ? value.value_vnd : 0,
      start_date: value.rangeDate[0].format("YYYY-MM-DD HH:mm"),
      end_date: value.rangeDate[1].format("YYYY-MM-DD HH:mm"),
    };
    delete values.rangeDate;
    const url = `${process.env.REACT_APP_API_URL}/discount/update/${discountCode.id}`;
    try {
      const res = await axios.put(url, values, { withCredentials: true });
      if (res.status === 200) {
        setTimeout(() => {
          onClick();
          setModal();
          setIsLoading(false);
          notification.success({
            message: "Thành công",
            description: "Phiếu giảm giá đã được lưu thành công!",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
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
          setIsLoading(false);
          NotificationBeenLoggedOut();
        }, 500);
      } else {
        // Các lỗi khác
        setTimeout(() => {
          setIsLoading(false);
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi lưu dữ liệu!",
          });
        }, 1000);
      }
    }
  };

  // Hàm được gọi khi form bị lỗi
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const valueVnd = {
    code: discountCode.code,
    value_vnd: discountCode.value_vnd,
    rangeDate: [
      dayjs(discountCode.start_date, dateFormat),
      dayjs(discountCode.end_date, dateFormat),
    ],
  };

  const valuePersent = {
    code: discountCode.code,
    value_percent: discountCode.value_percent,
    rangeDate: [
      dayjs(discountCode.start_date, dateFormat),
      dayjs(discountCode.end_date, dateFormat),
    ],
  };

  return (
    <div>
      <Form
        style={{
          maxWidth: 1000,
          textAlign: "start",
          minWidth: 800,
          margin: "0 5%",
        }}
        layout="vertical"
        onFinish={onFinishUpdate}
        onFinishFailed={onFinishFailed}
        form={form}
        initialValues={discountType === "vnd" ? valueVnd : valuePersent}
      >
        <Form.Item
          label="Mã"
          name="code"
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
          }}
        >
          <Input placeholder="Nhập mã" />
        </Form.Item>
        <Form.Item
          label="Giá trị"
          style={{ marginRight: "20px" }}
          name={discountType === "vnd" ? "value_vnd" : "value_percent"}
          id={discountType === "vnd" ? "value_vnd" : "value_percent"}
        >
          <InputNumber
            addonAfter={
              <Button type="primary" onClick={() => {}} disabled={true}>
                {discountType === "vnd" ? "VND" : "%"}
              </Button>
            }
            placeholder="Nhập Giá Trị"
            type="number"
            min={discountType === "percent" ? 0 : undefined}
            max={discountType === "percent" ? 100 : undefined}
          />
        </Form.Item>

        <Form.Item label="Thời gian áp dụng" name="rangeDate">
          <RangePicker showTime format={dateFormat} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>

        <Modal open={isLoading} footer={null} closeIcon={null}>
          <Spin tip="Đang tải lên..." spinning={true}>
            <div style={{ minHeight: "50px" }} className="content" />
          </Spin>
        </Modal>
      </Form>
    </div>
  );
}

export default InputFrom;
