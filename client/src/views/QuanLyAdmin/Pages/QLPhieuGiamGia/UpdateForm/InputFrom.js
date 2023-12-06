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

const { Option } = Select;

function InputFrom({ data, onClick, setModal }) {
  // tạo biến chứa thông tin sản phẩm được cập nhật
  const discountCode = data;

  const [isLoading, setIsLoading] = useState(false);
  // Tạo state toàn cục
  const [content, setContent] = useState(discountCode.content);
  const [value_percent, setValue_percent] = useState(discountCode.value_percent);
  const [Value_vnd, setValue_vnd] = useState(discountCode.value_vnd);
  const [start_date, setStart_date] = useState(discountCode.start_date);
  const [end_date, setEnd_date] = useState(discountCode.end_date);
  // logic orther informations
  const [inputs, setInputs] = useState([]);
  const errorMessage = "Trường này là bắt buộc";

  // Lấy brands và colors khi lần đầu chạy
  useEffect(() => {}, []);

  // Hàm được gọi khi form hoàn thành
  const onFinishUpdate = async (values) => {};

  // Hàm được gọi khi form bị lỗi
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      layout="vertical"
      onFinish={onFinishUpdate}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{
        content:discountCode.content,
        value_percent:discountCode.value_percent,
        value_vnd:discountCode.value_vnd,
        start_date:discountCode.start_date,
        end_date:discountCode.end_date
      }}
    >
      <hr />
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chung
      </h5>

      <Form.Item wrapperCol={{ offset: 20, span: 8 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default InputFrom;
