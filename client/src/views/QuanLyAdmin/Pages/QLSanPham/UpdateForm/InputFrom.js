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
  Space,
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
  const errorMessage = "Trường này là bắt buộc";
  const [form] = Form.useForm();
  // đặt giá trị mặc định khi component được mount
  useEffect(() => {
    // Sử dụng setFieldsValue để đặt giá trị mặc định khi component được mount
    if (product) {
      form.setFieldsValue({
        brand: product.brand,
        guarantee: product.configuration.guarantee,
        name: product.name,
        series: product.configuration.series,
        category: product.category,
        release_date: product ? moment(product.release_date) : null,
        demand: product.configuration.demand,
        shortDescription: product.shortDescription,
        configuration: inputs,
      });
    }
  }, [form, inputs, product, categorySubmit]); // useEffect sẽ chạy lại khi form hoặc defaultData thay đổi

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
  // Hàm lấy dữ liệu thể loại
  const getCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/List/category`
      );
      const data = [];
      
      [...response.data.results].forEach((category)=> {
        var obj = {};
        obj["label"] = category.name;
        obj["value"] = category.id;
        data.push(obj);
      })

      setCategories(data);
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
      // Cấu trúc lại configuration
      const configuration = values.configuration;
      values.configuration = {};
      [...configuration].forEach((item) => {
        values.configuration[item.inputName] = item.value;
      });

      // Các field chính
      const mainField = [
        "brand",
        "name",
        "category",
        "quantity",
        "shortDescription",
        "status",
        "main_image",
        "variations",
        "description",
        "release_date",
        "remaining_quantity",
      ];
      for (const fieldName in values) {
        if (!mainField.includes(fieldName) && fieldName !== "configuration") {
          values["configuration"][fieldName] = values[fieldName];
          delete values[fieldName];
        }
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
        values,
        { withCredentials: true }
      );

      // Nếu trạng thái trả về bằng 200
      // thì thông báo thành công và tắt loading button
      if (result.status === 200) {
        // Set độ trễ 0.5s
        return setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
          setModal(false);
          onClick();
        }, 500);
      }
      // Nếu trạng thái trả về khác 200
      // Thông báo thất bại và tắt loading button
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 500);
    } catch (error) {
      // Log ra lỗi, tắt loading button và thông báo thất bại
      console.log(error);
      // set độ trễ 0.5s
      setTimeout(() => {
        if (error.response.status === 401) {
          setIsLoading(false);
          NotificationBeenLoggedOut();
        } else {
          setIsLoading(false);
          notification.error({
            message: "Cập nhật thất bại!",
          });
        }
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
        // ob["inputName"] = {label: formatSpecifications(fieldName), value: fieldName};
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
    if (product?.category && categories.length > 0) {
      const c = categories.find((c) => c.value === product?.category);
      if (c.label.toLowerCase() === "laptop") {
        const arr = [];
        config.laptop_specifications.forEach((item) => {
          const oj = {};
          oj["value"] = item;
          oj["label"] = formatSpecifications(item);
          arr.push(oj);
        });
        setSelectedSpecifications(arr);
      } else {
        const arr = [];
        config.phone_specifications.forEach((item) => {
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
      form={form}
    >
      <hr />
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chung
      </h5>
      <div style={{ padding: "0 15px" }}>
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
            rules={[
              { required: true, message: errorMessage },
              { max: 20, message: "Không được nhập quá 20 kí tự" },
            ]}
          >
            <Input
              placeholder="Nhập thời gian bảo hành"
              style={{ height: "40px" }}
            />
          </Form.Item>
        </Form.Item>

        {/* tên */}
        {/* Series */}
        <Form.Item>
          <Form.Item
            label="Tên"
            name="name"
            style={firstInput}
            rules={[
              { required: true, message: errorMessage },
              { max: 80, message: "Không được nhập quá 80 kí tự" },
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item
            label="Series"
            name="series"
            rules={[{ max: 25, message: "Không được nhập quá 25 kí tự" }]}
            style={lastInput}
          >
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
              options={categories}
            />
          </Form.Item>
          <Form.Item
            name={"release_date"}
            label="Ngày phát hành"
            style={lastInput}
            rules={[
              {
                required: true,
                message: errorMessage,
              },
            ]}
          >
            <DatePicker style={{ height: 40 }} />
          </Form.Item>
        </Form.Item>

        {/* số lượng */}
        {/* số lượng còn lại */}
        {/* <Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            style={firstInput}
            rules={[{ required: true, message: errorMessage }]}
          >
            <InputNumber
              max={1000000}
              min={0}
              style={{width: "100%"}}
              placeholder="Nhập số lượng sản phẩm đang bán"
            />
          </Form.Item>

          <Form.Item
            label="Số lượng còn lại"
            name="remaining_quantity"
            style={lastInput}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  // const price = getFieldsValue(true);
                  const quantity = getFieldValue("quantity");
                  if (value && value > quantity) {
                    return Promise.reject(
                      "Số lượng còn lại không thể lớn hơn số lượng tổng!"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              min={0}
              max={1000000}
              style={{width: "100%"}}
              placeholder="Nhập số lượng sản phẩm còn lại"
            />
          </Form.Item>
        </Form.Item> */}

        {/* nhu cầu */}
        <Form.Item
          label="Nhu cầu"
          name="demand"
          style={{width: "calc(50% - 8px)"}}
          rules={[{ max: 100, message: "Không được nhập quá 100 kí tự" }]}
        >
          <Input placeholder="Nhập nhu cầu sản phẩm" />
        </Form.Item>

        {/* Mô tả ngắn */}
        <Form.Item
          label="Mô tả ngắn"
          name="shortDescription"
          rules={[
            { required: true, message: errorMessage },
            {
              max: 160,
              message: "Không được nhập quá 160 kí tự",
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)" />
        </Form.Item>
      </div>
      {/*  */}
      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin chi tiết
      </h5>
      <div style={{ padding: "0 15px" }}>
        {/* Other information */}
        <Form.List name="configuration">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    style={{ width: "200px", margin: "0" }}
                    name={[name, "inputName"]}
                    rules={[
                      { required: true, message: "Không bỏ trống trường này" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn thông tin"
                      style={{ height: 40 }}
                      showSearch
                      allowClear
                      options={selectedSpecifications}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    style={{ width: "400px", margin: "0" }}
                    rules={[
                      { required: true, message: "Không bỏ trống trường này" },
                      { max: 200, message: "Không được nhập quá 200 kí tự" },
                    ]}
                  >
                    <Input type="text" placeholder="Nhập thông tin" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm trường
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>

      <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
        Thông tin mô tả
      </h5>
      {/* description */}
      <Form.Item style={{ padding: "0 15px" }}>
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

      <Form.Item wrapperCol={{ offset: 20, span: 8 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default InputFrom;
