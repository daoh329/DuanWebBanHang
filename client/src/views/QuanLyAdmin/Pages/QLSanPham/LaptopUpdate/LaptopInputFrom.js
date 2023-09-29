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

function LaptopInputFrom({ Product }) {
  const idProduct = Product.id;
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
        <Select placeholder="Chọn thương hiệu">
          {brands.map((brand) => (
            <Select.Option key={brand.name} value={brand.name}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* bảo hành */}
      <Form.Item label="Bảo hành" name="guarantee">
        <Input placeholder="Nhập thời gian bảo hành"/>
      </Form.Item>

      {/* tên */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
      >
        <Input placeholder="Nhập tên sản phẩm"/>
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
        <InputNumber style={{ width: "100%" }} placeholder="Nhập giá sản phẩm"/>
      </Form.Item>

        {/* Mô tả ngắn */}
      <Form.Item
        hasFeedback
        validateDebounce={1000}
        label="Mô tả ngắn"
        name="shortDescription"
        rules={[{ required: true, message: "Vui lòng nhập trường này!" }]}
      >
        <Input.TextArea placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)"/>
      </Form.Item>

{/* Series */}
      <Form.Item label="Series" name="series_laptop">
        <Input placeholder="Nhập Series sản phẩm"/>
      </Form.Item>

{/* Part number */}
      <Form.Item label="Part_number" name="part_number">
        <Input placeholder="Nhập part number sản phẩm"/>
      </Form.Item>

      <Form.Item label="Màu" name="color">
        <Input placeholder="Nhập màu sắc sản phẩm"/>
      </Form.Item>

      <Form.Item label="Nhu cầu" name="demand">
        <Input placeholder="Nhập nhu cầu sử dụng sản phẩm"/>
      </Form.Item>

      <Form.Item label="Số lượng" name="quantity">
        <InputNumber placeholder="Nhập số lượng sản phẩm đang bán"/>
      </Form.Item>

      {/* ====================================== */}
      <hr />
      <h6 style={{ margin: "20px 0 10px 0" }}>Thông tin chi tiết</h6>

      {/* CPU */}
      <Form.Item label="CPU" name="cpu">
        <Input placeholder="Nhập thông số CPU sản phẩm"/>
      </Form.Item>

      {/* màn hình */}
      <Form.Item label="Màn hình" name="screen">
        <Input placeholder="Nhập thông tin màn hình"/>
      </Form.Item>

      {/* ram */}
      <Form.Item label="RAM" name="ram">
        <Input placeholder="Nhập dung lượng ram"/>
      </Form.Item>

      {/* vga */}
      <Form.Item label="Đồ họa" name="vga">
        <Input placeholder="Nhập thông tin card đồ họa"/>
      </Form.Item>

      {/* rom */}
      <Form.Item label="Bộ nhớ" name="rom">
        <Input placeholder="Nhập dung lượng bộ nhớ lưu trữ"/>
      </Form.Item>

      {/* số cổng lưu trữ tối đa */}
      <Form.Item
        label="Số cổng lưu trữ tối đa"
        name="maximum_number_of_storage_ports"
      >
        <Input placeholder="Nhập số lượng cổng lưu trữ tối đa"/>
      </Form.Item>

      {/* Kiểu khe M.2 hỗ trợ */}
      <Form.Item label="Kiểu khe M.2 hỗ trợ" name="M2_slot_type_supported">
        <Input placeholder="Nhập kiểu khe M.2 hỗ trợ"/>
      </Form.Item>

      {/* Cổng xuất hình */}
      <Form.Item label="Cổng xuất hình" name="output_port">
        <Input placeholder="Nhập thông tin cổng xuất hình"/>
      </Form.Item>

      {/* Cổng kết nối */}
      <Form.Item label="Cổng kết nối" name="connector">
        <Input placeholder="Nhập thông tin cổng kết nối"/>
      </Form.Item>

      {/* Kết nối không dây */}
      <Form.Item label="Kết nối không dây" name="wireless_connectivity">
        <Input placeholder="Nhập thông tin công nghệ kết nối không dây"/>
      </Form.Item>

      {/* Bàn phím */}
      <Form.Item label="Bàn phím" name="keyboard">
        <Input placeholder="Nhập thông tin bàn phím"/>
      </Form.Item>

      {/* Hệ điều hành */}
      <Form.Item label="Hệ điều hành" name="os">
        <Input placeholder="Nhập thông tin hệ điều hành"/>
      </Form.Item>

      {/* Pin */}
      <Form.Item label="Pin" name="pin">
        <Input placeholder="Nhập thông tin pin sản phẩm"/>
      </Form.Item>

      {/* Khối lượng */}
      <Form.Item label="Khối lượng" name="mass">
        <Input placeholder="Nhập khối lượng sản phẩm"/>
      </Form.Item>

      {/* Phụ kiện đi kèm */}
      <Form.Item label="Phụ kiện đi kèm" name="accessory">
        <Input placeholder="Nhập các phụ kiện đi kèm của sản phẩm"/>
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
