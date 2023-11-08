import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  message,
  notification,
} from "antd";
import axios from "axios";
import { formatCurrency } from "../../../../../util/FormatVnd";
import { PlusOutlined } from "@ant-design/icons";
import { formatCapacity } from "../../../../../util/formatCapacity";

const { Option } = Select;

function LaptopInputFrom({ data, onClick, setModal }) {
  const product = data;
  // function select element
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [colorSubmit, setColorSubmit] = useState(product.color);
  const [capacities, setCapacities] = useState([]);
  const [capacitySubmit, setCapacitySubmit] = useState([
    { capacity: "", capacity_price: 0 },
  ]);

  useEffect(() => {
    getBrandsList();
    getColorsList();
    getCapacitiesList();
    if (product.capacities) {
      setCapacitySubmit(product.capacities);
    }
  }, [product]);

  const getBrandsList = async () => {
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

  // function call api get colors
  const getColorsList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/colors`)
      .then((response) => {
        setColors(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // function call api get capacity list
  const getCapacitiesList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/product/capacity`)
      .then((response) => {
        setCapacities(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      var checkValuesChange = false;
      const fieldsConfiguraton = [
        "M2_slot_type_supported",
        "accessory",
        "connector",
        "cpu",
        "demand",
        "guarantee",
        "keyboard",
        "mass",
        "maximum_number_of_storage_ports",
        "os",
        "output_port",
        "part_number",
        "pin",
        "ram",
        "rom",
        "screen",
        "series",
        "vga",
        "wireless_connectivity",
      ];
      // kiểm tra nếu "" thì set là undefined
      // (undefined không được đưa lên server)
      values.configuration = values.configuration || {};
      for (const fieldName in values) {
        if (!values[fieldName]) {
          if (
            values[fieldName] === undefined &&
            fieldsConfiguraton.includes(fieldName)
          ) {
            values.configuration[fieldName] = product.configuration[fieldName];
          } else if (values[fieldName] === "" || values[fieldName] === 0) {
            if (fieldsConfiguraton.includes(fieldName)) {
              if (
                product.configuration[fieldName] === undefined ||
                values[fieldName] === product.configuration[fieldName]
              ) {
                values[fieldName] = undefined;
              } else {
                checkValuesChange = true;
              }
            } else {
              if (values[fieldName] == product[fieldName]) {
                values[fieldName] = undefined;
              } else {
                checkValuesChange = true;
              }
            }
          }
        } else if (values[fieldName]) {
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
      if (colorSubmit.toString() !== product.color.toString()) {
        values["color"] = colorSubmit;
        checkValuesChange = true;
      } else {
        values["color"] = product.color;
      }

      // sử lí mảng capacity
      values["capacity"] = values["capacity"] || [];
      if (capacitySubmit[0].capacity && capacitySubmit[0].capacity_price > 0) {
        if (capacitySubmit !== product.capacities) {
          values["capacity"] = capacitySubmit;
          checkValuesChange = true;
        }
      } else {
        setIsLoading(false);
        message.warning("Vui lòng điền đầy đủ thông tin dung lượng sản phẩm");
        return;
      }

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

      if (result.status === 200) {
        return setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
          setModal(false);
          onClick();
        }, 2000);
      }
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
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

  // select color
  const handleChange = (value) => {
    setColorSubmit(value);
  };

  // select Capacity
  const handleInputChange = (index, key, value) => {
    const updatedRomInfo = [...capacitySubmit];
    updatedRomInfo[index][key] = value;
    setCapacitySubmit(updatedRomInfo);
  };

  const handleAddRom = () => {
    setCapacitySubmit([...capacitySubmit, { capacity: "", capacity_price: 0 }]);
  };

  const handleRemoveRom = (index) => {
    const updatedRomInfo = [...capacitySubmit];
    updatedRomInfo.splice(index, 1);
    setCapacitySubmit(updatedRomInfo);
  };

  // function open modal
  const [isOpenModalCapcity, setIsOpenModalCapcity] = useState(false);

  const handleCancel = () => {
    setIsOpenModalCapcity(false);
  };

  const openModalAddCapacity = () => {
    setIsOpenModalCapcity(true);
  };

  // function logic modal
  // modal capacity
  // const [isLoading, setIsLoading] = useState(false);
  const onFinishCapacity = async (values) => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/List/add/capacity`,
        values
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
        }, 2000);
        setIsOpenModalCapcity(false)
        getCapacitiesList();
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

      {/* Giá giảm */}
      <Form.Item
        label={`Giá giảm (Max: ${formatCurrency(product.price)})`}
        name="discount"
      >
        <InputNumber
          max={product ? product.price : 0}
          min={0}
          defaultValue={product ? product.discount : null}
          style={{ width: "100%" }}
          placeholder="Nhập giá đã giảm"
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

      {/* Part number */}
      <Form.Item label="Part_number" name="part_number">
        <Input
          defaultValue={product ? product.configuration.part_number : null}
          placeholder="Nhập part number sản phẩm"
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

      {/* demand */}
      <Form.Item label="Nhu cầu" name="demand">
        <Input
          defaultValue={product ? product.configuration.demand : null}
          placeholder="Nhập nhu cầu sử dụng sản phẩm"
        />
      </Form.Item>

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

      {/* capacity */}
      <div className="form-group">
        <label className="form-label">Dung lượng (ROM): </label>
        <table>
          <thead>
            <tr>
              <th>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <span>Dung lượng ROM: &nbsp;</span>
                  <Button
                    onClick={openModalAddCapacity}
                    icon={<PlusOutlined />}
                    style={{
                      margin: "0 10px 0 0",
                      border: "none",
                      background: "none",
                    }}
                  />
                </div>
              </th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {capacitySubmit &&
              capacitySubmit.map((capacity, index) => (
                <tr key={index}>
                  <td>
                    <select
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        handleInputChange(index, "capacity", e.target.value)
                      }
                    >
                      {[...capacities].map((cpct, index) => (
                        <option
                          key={index}
                          value={cpct?.capacity ? cpct?.capacity : ""}
                          selected={
                            capacity.capacity == cpct.capacity ? true : false
                          }
                        >
                          {formatCapacity(cpct.capacity)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      value={capacity.capacity_price}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "capacity_price",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="capacity-btn-delete-row"
                      onClick={() => handleRemoveRom(index)}
                      type="button"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          type="button"
          className="capacity-btn-add-row"
          onClick={handleAddRom}
        >
          Thêm ROM
        </button>
      </div>
      <Modal
        title="Thêm lựa chọn cho dung lượng"
        open={isOpenModalCapcity}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          onFinish={onFinishCapacity}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name={"capacity"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập dữ liệu rồi tiếp tục!",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập dung lượng"
              type="number"
              min={0}
              style={{ borderRadius: "3px", width: "100%" }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 19, span: 4 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* CPU */}
      <Form.Item label="CPU" name="cpu">
        <Input
          defaultValue={product ? product.configuration?.cpu : null}
          placeholder="Nhập thông số CPU sản phẩm"
        />
      </Form.Item>

      {/* màn hình */}
      <Form.Item label="Màn hình" name="screen">
        <Input
          defaultValue={product ? product.configuration?.screen : null}
          placeholder="Nhập thông tin màn hình"
        />
      </Form.Item>

      {/* ram */}
      <Form.Item label="RAM" name="ram">
        <Input
          defaultValue={product ? product.configuration?.ram : null}
          placeholder="Nhập dung lượng ram"
        />
      </Form.Item>

      {/* vga */}
      <Form.Item label="Đồ họa" name="vga">
        <Input
          defaultValue={product ? product.configuration?.vga : null}
          placeholder="Nhập thông tin card đồ họa"
        />
      </Form.Item>

      {/* số cổng lưu trữ tối đa */}
      <Form.Item
        label="Số cổng lưu trữ tối đa"
        name="maximum_number_of_storage_ports"
      >
        <Input
          defaultValue={
            product
              ? product.configuration?.maximum_number_of_storage_ports
              : null
          }
          placeholder="Nhập số lượng cổng lưu trữ tối đa"
        />
      </Form.Item>

      {/* Kiểu khe M.2 hỗ trợ */}
      <Form.Item label="Kiểu khe M.2 hỗ trợ" name="M2_slot_type_supported">
        <Input
          defaultValue={
            product ? product.configuration?.M2_slot_type_supported : null
          }
          placeholder="Nhập kiểu khe M.2 hỗ trợ"
        />
      </Form.Item>

      {/* Cổng xuất hình */}
      <Form.Item label="Cổng xuất hình" name="output_port">
        <Input
          defaultValue={product ? product.configuration?.output_port : null}
          placeholder="Nhập thông tin cổng xuất hình"
        />
      </Form.Item>

      {/* Cổng kết nối */}
      <Form.Item label="Cổng kết nối" name="connector">
        <Input
          defaultValue={product ? product.configuration?.connector : null}
          placeholder="Nhập thông tin cổng kết nối"
        />
      </Form.Item>

      {/* Kết nối không dây */}
      <Form.Item label="Kết nối không dây" name="wireless_connectivity">
        <Input
          defaultValue={
            product ? product.configuration?.wireless_connectivity : null
          }
          placeholder="Nhập thông tin công nghệ kết nối không dây"
        />
      </Form.Item>

      {/* Bàn phím */}
      <Form.Item label="Bàn phím" name="keyboard">
        <Input
          defaultValue={product ? product.configuration?.keyboard : null}
          placeholder="Nhập thông tin bàn phím"
        />
      </Form.Item>

      {/* Hệ điều hành */}
      <Form.Item label="Hệ điều hành" name="os">
        <Input
          defaultValue={product ? product.configuration?.os : null}
          placeholder="Nhập thông tin hệ điều hành"
        />
      </Form.Item>

      {/* Pin */}
      <Form.Item label="Pin" name="pin">
        <Input
          defaultValue={product ? product.configuration?.pin : null}
          placeholder="Nhập thông tin pin sản phẩm"
        />
      </Form.Item>

      {/* Khối lượng */}
      <Form.Item label="Khối lượng" name="mass">
        <Input
          defaultValue={product ? product.configuration?.mass : null}
          placeholder="Nhập khối lượng sản phẩm"
        />
      </Form.Item>

      {/* Phụ kiện đi kèm */}
      <Form.Item label="Phụ kiện đi kèm" name="accessory">
        <Input
          defaultValue={product ? product.configuration?.accessory : null}
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

export default LaptopInputFrom;
