import React, { useEffect, useState } from "react";
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
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment"; // Import thư viện moment để xử lý ngày tháng

// import { formatCurrency } from "../../../../../util/FormatVnd";
import { formatCapacity } from "../../../../../util/formatCapacity";
import { formatSpecifications } from "../../../../../util/formatSpecifications";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ObjectCompareObject } from "../../../../../util/servicesGlobal";
import config from "../../../../../config";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";

function InputFrom({ data, onClick, setModal }) {
  // tạo biến chứa thông tin sản phẩm được cập nhật
  const discountCode = data;

  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [discountType, setDiscountType] = useState(
    !(discountCode.value_vnd == 0) ? "vnd" : "persent"
  );
  const [isLoading, setIsLoading] = useState(false);
  // Tạo state toàn cục
  const [content, setContent] = useState(discountCode.content);
  const [value_percent, setValue_percent] = useState(
    discountCode.value_percent
  );
  const [Value_vnd, setValue_vnd] = useState(discountCode.value_vnd);
  const [start_date, setStart_date] = useState(discountCode.start_date);
  const [end_date, setEnd_date] = useState(discountCode.end_date);
  // logic orther informations
  const [inputs, setInputs] = useState([]);
  const errorMessage = "Trường này là bắt buộc";

  // Lấy brands và colors khi lần đầu chạy
  useEffect(() => {}, []);

  // Hàm được gọi khi form hoàn thành
  const onFinishUpdate = async (fieldsValue) => {
    const values = {
      start_date: fieldsValue["start_date"].format("YYYY-MM-DD HH:mm"),
      end_date: fieldsValue["end_date"].format("YYYY-MM-DD HH:mm"),
    };
  };

  // Hàm được gọi khi form bị lỗi
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const valueVnd = {
    content: discountCode.content,
    value_vnd: discountCode.value_vnd,
    rangeDate: [moment(discountCode.start_date), moment(discountCode.end_date)],
  };
  const valuePersent = {
    content: discountCode.content,
    value_percent: discountCode.value_percent,
    rangeDate: [moment(discountCode.start_date), moment(discountCode.end_date)],
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
          <RangePicker showTime format="YYYY-MM-DD HH:mm" />
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
