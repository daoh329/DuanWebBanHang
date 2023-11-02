import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  notification,
} from "antd";
import axios from "axios";
import { formatCurrency } from "../../../../../util/FormatVnd";

const { Option } = Select;

function PhoneInputFrom({ data, onClick, setModal }) {
  // tạo biến chứa thông tin sản phẩm được cập nhật
  const product = data;
  // Tạo state toàn cục
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [colorSubmit, setColorSubmit] = useState(product.color);

  // Hàm lấy dữ liệu thương hiệu (get csdl)
  const getBrands = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/brands`)
      .then((response) => {
        const datas = response.data;
        setBrands(datas);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Hàm lấy dữ liệu màu sắc (get csdl)
  const getColors = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/colors`)
      .then((response) => {
        setColors(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Lấy brands và colors khi lần đầu chạy
  useEffect(() => {
    getBrands();
    getColors();
  }, []);

  // Hàm được gọi khi form hoàn thành
  const onFinish = async (values) => {
    // bật loading button
    setIsLoading(true);
    try {
      // kiểm tra nếu "" thì set là undefined
      // (undefined không được đưa lên server)
      var checkValuesChange = false;

      // tạo tên field cho thuộc tính configuration
      const fieldsConfiguraton = [
        "screen",
        "resolution",
        "rom",
        "os",
        "ram",
        "chip",
        "pin",
        "charging_port",
        "sim_type",
        "mobile_network",
        "rear_camera",
        "front_camera",
        "wifi",
        "gps",
        "bluetooth",
        "headphone_jack",
        "size",
        "mass",
        "accessory",
        "guarantee",
        "series",
      ];

      // Tạo thuộc tính configuration
      values.configuration = values.configuration || {};
      // Lặp qua từng field của values
      for (const fieldName in values) {
        //TH1: Nếu dữ dữ liệu của field hiện tại không được nhập hoăc bị xóa đy
        if (!values[fieldName]) {
          // TH1.1: Dữ liệu của field không được nhập và thuộc configuration
          if (
            values[fieldName] === undefined &&
            fieldsConfiguraton.includes(fieldName)
          ) {
            // Thực hiện gán giá trị mặc định cho field đó
            values.configuration[fieldName] = product.configuration[fieldName];
          }
          // TH1.2: Dữ liệu của field bị xóa
          else if (values[fieldName] === "") {
            // Thực hiện gán giá trị của field đó thành undefined
            // (undefined sẽ không được submit lên server)
            values[fieldName] = undefined;
          }
        }
        // TH2: Nếu field có giá trị mới (giá trị field bị thay đổi)
        else if (values[fieldName]) {
          // Nếu field đó thuộc configuaration
          if (fieldsConfiguraton.includes(fieldName)) {
            // kiểm tra xem giá trị field đó có khác mặc định không?
            if (values[fieldName] == product.configuration[fieldName]) {
              // Nếu không khác
              // gán giá trị cho field đó vào thuộc tính configuration
              values.configuration[fieldName] = values[fieldName];
              // Xóa thuộc tính đó khỏi values (tránh trùng lặp gây thừa dữ liệu)
              delete values[fieldName];
            } else {
              // Nếu dữ liệu khác mặc định
              // Đặt là có dữ liệu thay đổi
              checkValuesChange = true;
              // gán giá trị cho field đó vào thuộc tính configuration
              values.configuration[fieldName] = values[fieldName];
              // Xóa thuộc tính đó khỏi values (tránh trùng lặp gây thừa dữ liệu)
              delete values[fieldName];
            }
          } else {
            // Nếu có giá trị thay đổi trong form thì đặt thành true
            // ( = true sẽ tiếp tục call API)
            if (fieldName !== "configuration") {
              checkValuesChange = true;
            }
          }
        }
      }

      values["color"] = values["color"] || [];
      if (colorSubmit != product.color) {
        values["color"] = colorSubmit;
      } else {
        values["color"] = product.color;
      }

      // Nếu không có dữ liệu trong form thay đổi (checkValuesChange === false)
      // Bật thông báo, tắt loading button và dừng call API
      if (!checkValuesChange) {
        setIsLoading(false);
        return notification.warning({
          message: "Không có dữ liệu thay đổi",
        });
      }

      // call API update
      const result = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/update/${product.id}`,
        values
      );

      // Nếu trạng thái trả về bằng 200
      // thì thông báo thành công và tắt loading button
      if (result.status === 200) {
        // Set độ trễ 2s
        return setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
          setModal(false);
          onClick();
        }, 2000);
      }
      // Nếu trạng thái trả về khác 200
      // Thông báo thất bại và tắt loading button
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
    } catch (error) {
      // Log ra lỗi, tắt loading button và thông báo thất bại
      console.log(error);
      // set độ trễ 2s
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
    }
  };

  // Hàm được gọi khi form bị lỗi
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Hàm được gọi khi input color thay đổi
  const handleChange = (value) => {
    // Đặt giá trị cho state colorSubmit
    setColorSubmit(value);
  };

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <hr />
      <h6 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chung
      </h6>
      {/* thương hiệu */}
      <Form.Item label="Thương hiệu" name="brand">
        <Select defaultValue={product.brand} placeholder="Chọn thương hiệu">
          {brands &&
            brands.map((brand) => (
              <Select.Option key={brand.name} value={brand.name}>
                {brand.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      {/* bảo hành */}
      <Form.Item label="Bảo hành" name="guarantee">
        <Input
          defaultValue={product ? product.configuration.guarantee : null}
          placeholder="Nhập thời gian bảo hành"
        />
      </Form.Item>

      {/* tên */}
      <Form.Item label="Tên" name="name">
        <Input
          defaultValue={product ? product.name : null}
          placeholder="Nhập tên sản phẩm"
        />
      </Form.Item>

      {/* Giá */}
      <Form.Item label="Giá" name="price">
        <InputNumber
          defaultValue={product ? product.price : null}
          style={{ width: "100%" }}
          placeholder="Nhập giá sản phẩm"
        />
      </Form.Item>

      {/* Giá đã giảm */}
      <Form.Item
        label={`Giá đã giảm (Max: ${formatCurrency(product.price)})`}
        name="discount"
      >
        <InputNumber
          max={product.price}
          defaultValue={product ? product.discount : null}
          style={{ width: "100%" }}
          placeholder="Nhập giá sản phẩm đã giảm"
        />
      </Form.Item>

      {/* Mô tả ngắn */}
      <Form.Item label="Mô tả ngắn" name="shortDescription">
        <Input.TextArea
          defaultValue={product ? product.shortDescription : null}
          placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)"
        />
      </Form.Item>

      {/* Series */}
      <Form.Item label="Series" name="series">
        <Input
          defaultValue={product ? product.configuration.series : null}
          placeholder="Nhập Series sản phẩm"
        />
      </Form.Item>

      {/* colors */}
      <div className="form-group">
        <label>Màu sắc</label>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn màu sắc"
            value={colorSubmit}
            onChange={handleChange}
            optionLabelProp="label"
            size="large"
          >
            {colors &&
              colors.map((color, index) => (
                <Option key={index} value={color.name} label={color.name}>
                  <Space>{color.name}</Space>
                </Option>
              ))}
          </Select>
        </div>
      </div>

      {/* số lượng */}
      <Form.Item label="Số lượng" name="quantity">
        <InputNumber
          defaultValue={product ? product.quantity : null}
          placeholder="Nhập số lượng sản phẩm đang bán"
        />
      </Form.Item>

      {/* số lượng còn lại */}
      <Form.Item label="Số lượng còn lại" name="remaining_quantity">
        <InputNumber
          defaultValue={product ? product.remaining_quantity : null}
          placeholder="Nhập số lượng sản phẩm còn lại"
        />
      </Form.Item>

      {/* ====================================== */}
      <hr />
      <h6 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chi tiết
      </h6>

      {/* chip */}
      <Form.Item label="Chip" name="chip">
        <Input
          defaultValue={product ? product.configuration.chip : null}
          placeholder="Nhập thông số cpu sản phẩm"
        />
      </Form.Item>

      {/* màn hình */}
      <Form.Item label="Màn hình" name="screen">
        <Input
          defaultValue={product ? product.configuration.screen : null}
          placeholder="Nhập thông tin màn hình"
        />
      </Form.Item>

      {/* ram */}
      <Form.Item label="RAM" name="ram">
        <Input
          defaultValue={product ? product.configuration.ram : null}
          placeholder="Nhập dung lượng ram"
        />
      </Form.Item>

      {/* resolution */}
      <Form.Item label="Độ phân giải" name="resolution">
        <Input
          defaultValue={product ? product.configuration.resolution : null}
          placeholder="Nhập thông tin độ phân giải màn hình"
        />
      </Form.Item>

      {/* rom */}
      <Form.Item label="Bộ nhớ" name="rom">
        <Input
          defaultValue={product ? product.configuration.rom : null}
          placeholder="Nhập dung lượng bộ nhớ lưu trữ"
        />
      </Form.Item>

      {/* Cổng sạc */}
      <Form.Item label="Cổng sạc" name="charging_port">
        <Input
          defaultValue={product ? product.configuration.charging_port : null}
          placeholder="Nhập thông tin cổng sạc"
        />
      </Form.Item>

      {/* Kiểu sim */}
      <Form.Item label="Kiểu sim" name="sim_type">
        <Input
          defaultValue={product ? product.configuration.sim_type : null}
          placeholder="Nhập kiểu sim hỗ trợ"
        />
      </Form.Item>

      {/* mobile_network */}
      <Form.Item label="Mạng di động" name="mobile_network">
        <Input
          defaultValue={product ? product.configuration.mobile_network : null}
          placeholder="Nhập thông tin mạng di động"
        />
      </Form.Item>

      {/* rear_camera */}
      <Form.Item label="Camera sau" name="rear_camera">
        <Input
          defaultValue={product ? product.configuration.rear_camera : null}
          placeholder="Nhập thông tin camera sau"
        />
      </Form.Item>

      {/* front_camera */}
      <Form.Item label="Camera trước" name="front_camera">
        <Input
          defaultValue={product ? product.configuration.front_camera : null}
          placeholder="Nhập thông tin camera trước"
        />
      </Form.Item>

      {/* wifi */}
      <Form.Item label="Wifi" name="wifi">
        <Input
          defaultValue={product ? product.configuration.wifi : null}
          placeholder="Nhập thông tin wifi"
        />
      </Form.Item>

      {/* Hệ điều hành */}
      <Form.Item label="Hệ điều hành" name="os">
        <Input
          defaultValue={product ? product.configuration.os : null}
          placeholder="Nhập thông tin hệ điều hành"
        />
      </Form.Item>

      {/* gps */}
      <Form.Item label="Gps" name="gps">
        <Input
          defaultValue={product ? product.configuration.gps : null}
          placeholder="Nhập thông tin gps"
        />
      </Form.Item>

      {/* bluetooth */}
      <Form.Item label="Bluetooth" name="bluetooth">
        <Input
          defaultValue={product ? product.configuration.bluetooth : null}
          placeholder="Nhập thông tin bluetooth"
        />
      </Form.Item>

      {/* headphone_jack */}
      <Form.Item label="Tai nghe" name="headphone_jack">
        <Input
          defaultValue={product ? product.configuration.headphone_jack : null}
          placeholder="Nhập thông tin tai nghe"
        />
      </Form.Item>

      {/* size */}
      <Form.Item label="Kích thước" name="size">
        <Input
          defaultValue={product ? product.configuration.size : null}
          placeholder="Nhập thông tin kích thước"
        />
      </Form.Item>

      {/* Pin */}
      <Form.Item label="Pin" name="pin">
        <Input
          defaultValue={product ? product.configuration.pin : null}
          placeholder="Nhập thông tin pin sản phẩm"
        />
      </Form.Item>

      {/* Khối lượng */}
      <Form.Item label="Khối lượng" name="mass">
        <Input
          defaultValue={product ? product.configuration.mass : null}
          placeholder="Nhập khối lượng sản phẩm"
        />
      </Form.Item>

      {/* Phụ kiện đi kèm */}
      <Form.Item label="Phụ kiện đi kèm" name="accessory">
        <Input
          defaultValue={product ? product.configuration.accessory : null}
          placeholder="Nhập các phụ kiện đi kèm của sản phẩm"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PhoneInputFrom;
