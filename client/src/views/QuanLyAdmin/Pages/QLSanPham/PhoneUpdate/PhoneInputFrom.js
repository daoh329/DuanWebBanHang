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
  const [description, setDescription] = useState(product.description);

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
  const errorMessage = "Trường này là bắt buộc";

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
  const onFinishUpdate = async (values) => {
    // bật loading button
    setIsLoading(true);
    try {
      // xử lí ngày phát hành
      // format release_date
      values["release_date"] = values["release_date"].format("YYYY-MM-DD");
      // format release_date of old product
      const d = new Date(product.release_date);
      product.release_date = moment(d).format("YYYY-MM-DD");
      // Tạo và sử lí configuration
      // chuyển đổi định dạng configuration ({inputName: "", value : ""} => {inputName: value})
      var arrayDataRawConfiguration = {};
      inputs.forEach((item) => {
        const oj = {
          ...arrayDataRawConfiguration,
          [item.inputName]: item.value,
        };
        arrayDataRawConfiguration = oj;
      });
      values["configuration"] = arrayDataRawConfiguration;
      // Đưa các thông tin còn lại của configuaration vào configuaration
      if (values.demand) {
        values["configuration"]["demand"] = values["demand"];
        delete values["demand"];
      }
      if (values.guarantee) {
        values["configuration"]["guarantee"] = values["guarantee"];
        delete values["guarantee"];
      }
      if (values.series) {
        values["configuration"]["series"] = values["series"];
        delete values["series"];
      }
      // Lọc và xóa những trường dữ liệu không thay đổi
      for (let fieldName in values) {
        if (
          values[fieldName] === product[fieldName] &&
          fieldName !== "configuaration"
        ) {
          delete values[fieldName];
        }
        if (fieldName === "configuration") {
          if (
            ObjectCompareObject(values.configuration, product.configuration)
          ) {
            delete values[fieldName];
          }
        }
      }

      // console.log(ObjectCompareObject(values.configuration, product.configuration));
      // console.log(values.configuration);
      // console.log(product.configuration);

      // Nếu description có sự thay đổi dữ liệu
      if (description !== product.description) {
        // Thêm vào values
        values["description"] = description;
      }

      // console.log("product: ", product);
      // console.log("values: ", values);
      // return;

      // Nếu values không có dữ liệu thì dừng và show thông báo
      if (Object.keys(values).length === 0) {
        message.warning("Không có dữ liệu thay đổi!");
        setIsLoading(false);
        return;
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

  // select Capacity
  const handleInputChange = (index, key, value) => {
    // return;
    const updatedRomInfo = [...inputs];
    updatedRomInfo[index][key] = value;
    setInputs(updatedRomInfo);
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

  // console.log("inputs", inputs);
  // console.log("product", product);
  // console.log("selectedSpecifications:" , selectedSpecifications);

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      layout="vertical"
      onFinish={onFinishUpdate}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{
        brand: product.brand,
        guarantee: product.configuration.guarantee,
        name: product.name,
        series: product.configuration.series,
        category: categorySubmit,
        release_date: product ? moment(product.release_date) : null,
        quantity: product.quantity,
        remaining_quantity: product.remaining_quantity,
        demand: product.configuration.demand,
        shortDescription: product.shortDescription,
      }}
    >
      <hr />
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chung
      </h5>
      <Form.Item>
        {/* thương hiệu */}
        <Form.Item
          label="Thương hiệu"
          name="brand"
          style={firstInput}
          rules={[{ required: true, message: errorMessage }]}
        >
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
        <Form.Item
          label="Bảo hành"
          name="guarantee"
          style={lastInput}
          rules={[{ required: true, message: errorMessage }]}
        >
          <Input
            placeholder="Nhập thời gian bảo hành"
            style={{ height: "40px" }}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        {/* tên */}
        <Form.Item
          label="Tên"
          name="name"
          style={firstInput}
          rules={[{ required: true, message: errorMessage }]}
        >
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
              message: errorMessage,
            },
          ]}
          style={firstInput}
        >
          <Select
            disabled
            placeholder="Chọn loại sản phẩm"
            style={{ height: 40 }}
          >
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
        <Form.Item
          label="Số lượng"
          name="quantity"
          style={firstInput}
          rules={[{ required: true, message: errorMessage }]}
        >
          <InputNumber placeholder="Nhập số lượng sản phẩm đang bán" />
        </Form.Item>

        {/* số lượng còn lại */}
        <Form.Item
          label="Số lượng còn lại"
          name="remaining_quantity"
          style={lastInput}
        >
          <InputNumber placeholder="Nhập số lượng sản phẩm còn lại" />
        </Form.Item>
      </Form.Item>

      {/* nhu cầu */}
      <Form.Item label="Nhu cầu" name="demand">
        <Input placeholder="Nhập nhu cầu sản phẩm" />
      </Form.Item>

      {/* Mô tả ngắn */}
      <Form.Item
        label="Mô tả ngắn"
        name="shortDescription"
        rules={[{ required: true, message: errorMessage }]}
      >
        <Input.TextArea placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)" />
      </Form.Item>

      {/* ====================================== */}
      <hr />
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chi tiết
      </h5>

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
              value={input.inputName}
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

      <hr />
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin mô tả
      </h5>
      {/* description */}
      <Form.Item>
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {}}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
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
