import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import axios from "axios";

function LaptopInputFrom({ idProduct }) {
  // function select element
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBrands = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/brands`)
      .then((response) => {
        const datas = response.data.results;
        setBrands(datas);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getBrands();
  }, []);

  // const onChange = (value) => {
  //   console.log(`selected ${value}`);
  // };

  const onFinish = async (values) => {
    setIsLoading(true);

    try {
      const result = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/update/${idProduct}`,
        values
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
        }, 2000);
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
      // labelCol={{ span: 8 }}
      // wrapperCol={{ span: 16 }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <hr />
      <h6 style={{ margin: "20px 0 10px 0" }}>Thông tin chung</h6>
      {/* thương hiệu */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Thương hiệu"
        name="brand"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn thương hiệu của sản phẩm!",
          },
        ]}
      >
        <Select>
          {brands.map((brand) => (
            <Select.Option key={brand.name} value={brand.name}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* bảo hành */}
      <Form.Item label="Bảo hành" name="guarantee">
        <Input />
      </Form.Item>

      {/* tên */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
      >
        <Input />
      </Form.Item>

      {/* Giá */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Giá"
        name="price"
        rules={[
          { required: true, message: "Vui lòng nhập trường này!" },
          { type: "number", min: 0, message: "'Giá' không phải là số hợp" },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Mô tả ngắn"
        name="shortDescription"
        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Series" name="series_laptop">
        <Input />
      </Form.Item>

      <Form.Item label="Part_number" name="part_number">
        <Input />
      </Form.Item>

      <Form.Item label="Màu" name="color">
        <Input />
      </Form.Item>

      <Form.Item label="Nhu cầu" name="demand">
        <Input />
      </Form.Item>

      <Form.Item label="Số lượng" name="quantity">
        <InputNumber />
      </Form.Item>

      {/* ====================================== */}
      <hr />
      <h6 style={{ margin: "20px 0 10px 0" }}>Thông tin chi tiết</h6>

      {/* CPU */}
      <Form.Item label="CPU" name="cpu">
        <Input />
      </Form.Item>

      {/* màn hình */}
      <Form.Item label="Màn hình" name="screen">
        <Input />
      </Form.Item>

      {/* ram */}
      <Form.Item label="RAM" name="ram">
        <Input />
      </Form.Item>

      {/* vga */}
      <Form.Item label="Đồ họa" name="vga">
        <Input />
      </Form.Item>

      {/* rom */}
      <Form.Item label="Bộ nhớ" name="rom">
        <Input />
      </Form.Item>

      {/* số cổng lưu trữ tối đa */}
      <Form.Item
        label="Số cổng lưu trữ tối đa"
        name="maximum_number_of_storage_ports"
      >
        <Input />
      </Form.Item>

      {/* Kiểu khe M.2 hỗ trợ */}
      <Form.Item label="Kiểu khe M.2 hỗ trợ" name="M2_slot_type_supported">
        <Input />
      </Form.Item>

      {/* Cổng xuất hình */}
      <Form.Item label="Cổng xuất hình" name="output_port">
        <Input />
      </Form.Item>

      {/* Cổng kết nối */}
      <Form.Item label="Cổng kết nối" name="connector">
        <Input />
      </Form.Item>

      {/* Kết nối không dây */}
      <Form.Item label="Kết nối không dây" name="wireless_connectivity">
        <Input />
      </Form.Item>

      {/* Bàn phím */}
      <Form.Item label="Bàn phím" name="keyboard">
        <Input />
      </Form.Item>

      {/* Hệ điều hành */}
      <Form.Item label="Hệ điều hành" name="os">
        <Input />
      </Form.Item>

      {/* Pin */}
      <Form.Item label="Pin" name="pin">
        <Input />
      </Form.Item>

      {/* Khối lượng */}
      <Form.Item label="Khối lượng" name="mass">
        <Input />
      </Form.Item>

      {/* Phụ kiện đi kèm */}
      <Form.Item label="Phụ kiện đi kèm" name="accessory">
        <Input />
      </Form.Item>

      {/* Trạng thái */}
      <Form.Item name="status" valuePropName="checked">
        <Checkbox>Trạng thái</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LaptopInputFrom;
