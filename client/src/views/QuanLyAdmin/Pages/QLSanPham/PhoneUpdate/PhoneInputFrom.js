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

const { Option } = Select;

function PhoneInputFrom({ data, onClick, setModal }) {
  // tạo biến chứa thông tin sản phẩm được cập nhật
  const product = data;
  // Tạo state toàn cục
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [colorSubmit, setColorSubmit] = useState(product.color);
  const [capacities, setCapacities] = useState([]);
  const [capacitySubmit, setCapacitySubmit] = useState([
    { capacity: "", capacity_price: 0 },
  ]);
  const [categories, setCategories] = useState([]);
  const [categorySubmit, setCategorySubmit] = useState(product.category);

  // logic orther informations
  const [inputs, setInputs] = useState([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState("");
  const phone_specifications = [
    "os",
    "cpu",
    "ram",
    "memoryStick",
    "screenSize",
    "screenResolution",
    "screenTechnology",
    "mainCamera",
    "frontCamera",
    "pin",
    "chargingTechnology",
    "connector",
    "size",
    "weight",
    "audioTechnology",
    "loudspeaker",
    "sensor",
    "networkConnections",
    "waterproof",
    "dustproof",
  ];
  const laptop_specifications = [
    "os",
    "operatingSystemVersion",
    "cpu",
    "NumberOfCPUCoresAndThreads",
    "CPUProcessingSpeed",
    "ram",
    "ramType",
    "screenSize",
    "screenResolution",
    "screenTechnology",
    "graphicsCard",
    "graphicsCardMemory",
    "connector",
    "pin",
    "batteryLife",
    "keyboard",
    "keyboardBacklight",
    "touchpad",
    "loudspeaker",
    "audioTechnology",
    "webcam",
    "networkConnections",
    "waterproof",
    "dustproof",
    "opticalDrive",
    "radiators",
  ];

  // Lấy brands và colors khi lần đầu chạy
  useEffect(() => {
    getBrandsList();
    getColorsList();
    getCapacitiesList();
    getCategoryList();
    if (product.capacities) {
      setCapacitySubmit(product.capacities);
    }
  }, [product]);

  useEffect(() => {
    if (product.category && categories) {
      const c = categories.filter((item) => item.name === product.category);
      setCategorySubmit(c[0]?.id);
    }
  }, [product, categories]);

  // Hàm lấy dữ liệu thương hiệu (get csdl)
  const getBrandsList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/brands`
      );
      setBrands(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  // Hàm lấy dữ liệu màu sắc (get csdl)
  const getColorsList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/colors`
      );
      setColors(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/category`
      );
      setCategories(response.data.results);
    } catch (e) {
      console.log(e);
    }
  };

  // function call api get capacity list
  const getCapacitiesList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/List/capacity`)
      .then((response) => {
        setCapacities(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          else if (values[fieldName] == "" || values[fieldName] == 0) {
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

      // color
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

  // select Capacity
  const handleInputChange = (index, key, value) => {
    const updatedRomInfo = [...capacitySubmit];
    updatedRomInfo[index][key] = value;
    setInputs(updatedRomInfo);
  };

  // Tạo mảng chứa các thông số kĩ thuật (specifications)
  useEffect(() => {
    if (product) {
      const arr = [];
      const arrDelete = ["guarantee", "series", "demand"];
      for (let fieldName in product.configuration) {
        let ob = {};
        ob["inputName"] = fieldName;
        ob["value"] = product.configuration[fieldName].trim();
        if (!arrDelete.includes(fieldName)) {
          arr.push(ob);
        }
      }
      setInputs(arr);
    }
  }, [product]);

  useEffect(() => {
    if (categorySubmit && categories.length > 0) {
      const c = categories.find((c) => c.id === categorySubmit);
      if (c.name === "Laptop") {
        const arr = [];
        laptop_specifications.forEach((item) => {
          const oj = {};
          oj["value"] = item;
          oj["label"] = formatSpecifications(item);
          arr.push(oj);
        });
        setSelectedSpecifications(arr);
      } else {
        const arr = [];
        phone_specifications.forEach((item) => {
          const oj = {};
          oj["value"] = item;
          oj["label"] = formatSpecifications(item);
          arr.push(oj);
        });
        setSelectedSpecifications(arr);
      }
    }
  }, [categorySubmit, categories]);

  // logic add field
  const handleAddInput = () => {
    setInputs([...inputs, { value: "", inputName: "" }]);
  };
  const handleRemoveElement = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  // style
  const firstInput = {
    margin: "0",
    display: "inline-block",
    width: "calc(50% - 8px)",
  };
  const lastInput = {
    margin: "0 8px",
    display: "inline-block",
    width: "calc(50% - 8px)",
  };

  console.log("inputs", inputs);
  // console.log("selectedSpecifications:" , selectedSpecifications);

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{
        brand: product.brand,
        guarantee: product.configuration.guarantee,
        name: product.name,
        series: product.configuration.series,
        category: categorySubmit,
        release_date: product ? moment(product.release_date) : null,
      }}
    >
      <hr />
      <h6 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chung
      </h6>
      <Form.Item>
        {/* thương hiệu */}
        <Form.Item label="Thương hiệu" name="brand" style={firstInput}>
          <Select placeholder="Chọn thương hiệu" style={{ height: "40px" }}>
            {brands &&
              brands.map((brand) => (
                <Select.Option key={brand.name} value={brand.name}>
                  {brand.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        {/* bảo hành */}
        <Form.Item label="Bảo hành" name="guarantee" style={lastInput}>
          <Input
            placeholder="Nhập thời gian bảo hành"
            style={{ height: "40px" }}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        {/* tên */}
        <Form.Item label="Tên" name="name" style={firstInput}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        {/* Series */}
        <Form.Item label="Series" name="series" style={lastInput}>
          <Input placeholder="Nhập Series sản phẩm" />
        </Form.Item>
      </Form.Item>

      {/* Loại sản phẩm */}
      {/* Ngày phát hành */}
      <Form.Item>
        <Form.Item
          label="Loại sản phẩm"
          name="category"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn loại sản phẩm",
            },
          ]}
          style={firstInput}
        >
          <Select placeholder="Chọn loại sản phẩm" style={{ height: 40 }}>
            {categories &&
              [...categories].map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={"release_date"}
          label="Ngày phát hành"
          style={lastInput}
        >
          <DatePicker style={{ height: 40 }} />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        {/* số lượng */}
        <Form.Item label="Số lượng" name="quantity" style={firstInput}>
          <InputNumber
            defaultValue={product ? product.quantity : null}
            placeholder="Nhập số lượng sản phẩm đang bán"
          />
        </Form.Item>

        {/* số lượng còn lại */}
        <Form.Item
          label="Số lượng còn lại"
          name="remaining_quantity"
          style={lastInput}
        >
          <InputNumber
            defaultValue={product ? product.remaining_quantity : null}
            placeholder="Nhập số lượng sản phẩm còn lại"
          />
        </Form.Item>
      </Form.Item>

      {/* Mô tả ngắn */}
      <Form.Item label="Mô tả ngắn" name="shortDescription">
        <Input.TextArea
          defaultValue={product ? product.shortDescription : null}
          placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)"
        />
      </Form.Item>

      {/* ====================================== */}
      <hr />
      <h6 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chi tiết
      </h6>

      {/* Other information */}
      {inputs.map((input, index) => (
        <Form.Item key={index}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(25% - 8px)",
              margin: "0",
            }}
          >
            <Select
              placeholder="Chọn thông tin"
              onChange={(value) => handleInputChange(index, "inputName", value)}
              style={{ height: 40 }}
              showSearch
              allowClear
              defaultValue={input.inputName}
              options={selectedSpecifications}
            />
          </Form.Item>

          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input
              type="text"
              placeholder="Nhập thông tin"
              value={input.value}
              onChange={(e) =>
                handleInputChange(index, "value", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(10% - 8px)",
              margin: "0 8px",
            }}
          >
            <Button
              onClick={() => handleRemoveElement(index)}
              icon={<MinusCircleOutlined />}
              style={{
                border: "none",
                background: "none",
                margin: "3px 0 0 0",
              }}
            />
          </Form.Item>
        </Form.Item>
      ))}
      <Form.Item>
        <Button onClick={handleAddInput} type="dashed" icon={<PlusOutlined />}>
          Thêm thẻ
        </Button>
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
