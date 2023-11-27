import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  notification,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductVariations from "./ProductVariations";
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { formatSpecifications } from "../../../../../util/formatSpecifications";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function MainForm() {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecifications, setSelectedSpecifications] = useState("");
  const [arrVariations, setArrVariations] = useState([
    {
      color: "",
      capacityGroup: [{ price: 0, discount_amount: 0, capacity: 0 }],
      images: [],
    },
  ]);
  const [inputs, setInputs] = useState([]);
  const [description, setDescription] = useState("");
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
    "romType",
    "spinSpeedRom",
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
    "weight",
  ];

  //   images and colors
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [mainImage, setMainImage] = useState([]);

  useEffect(() => {
    setClientReady(true);
    getBrandsList();
  }, []);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const c = categories.find((c) => c.id === selectedCategory);
      if (c.name === "Laptop") {
        setSelectedSpecifications(laptop_specifications);
      } else {
        setSelectedSpecifications(phone_specifications);
      }
    }
  }, [selectedCategory, categories]);

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

  // function selected category
  const handleSelectedCategory = (value) => {
    setSelectedCategory(value);
  };

  // function call api create product
  const onFinish = async (values) => {
    // Bật loading button submit
    setIsLoading(true);
    // format release_date
    values["release_date"] = values["release_date"].format("YYYY-MM-DD");

    try {
      // Xóa các trường images, color, capacity, main_image, price, discount
      delete values.images;
      delete values.color;
      delete values.capacity;
      delete values.main_image;
      delete values.price;
      delete values.discount;

      // Tạo các trường cần thiết
      values["main_image"] = mainImage[0].originFileObj;
      values["variations"] = arrVariations;
      values["description"] = description;
      values["configuration"] = {};

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
      ];

      for (const fieldName in values) {
        if (!mainField.includes(fieldName) && fieldName !== "configuration") {
          values["configuration"][fieldName] = values[fieldName];
          delete values[fieldName];
        }
      }

      // call API update
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/Add`,
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (result.status === 200) {
        setIsLoading(false);
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được tạo thành công!",
        });
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tạo sản phẩm!",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed: ", errorInfo);
  };

  // Tắt modal preview image
  const handleCancel = () => setPreviewOpen(false);

  // Bật modal preview image
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  // nút upload image
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // logic variation
  const remove = (index) => {
    const updatedRomInfo = [...arrVariations];
    updatedRomInfo.splice(index, 1);
    setArrVariations(updatedRomInfo);
  };

  const add = () => {
    setArrVariations([
      ...arrVariations,
      {
        color: "",
        capacityGroup: [{ price: 0, discount_amount: 0, capacity: 0 }],
        images: [],
      },
    ]);
  };

  // logic add field
  const handleAddInput = () => {
    setInputs([...inputs, { value: "", inputName: "" }]);
  };

  const handleRemoveElement = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
  };

  const handleInputChange = (index, prop, value) => {
    const newInputs = [...inputs];
    newInputs[index][prop] = value;
    setInputs(newInputs);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form
        style={{ maxWidth: 1000, textAlign: "start", minWidth: 800 }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        initialValues={{ status: true }}
        // autoComplete="off"
      >
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
          Thông tin chung
        </h5>
        {/* thương hiệu */}
        {/* bảo hành */}
        <Form.Item style={{ margin: 0 }}>
          <Form.Item
            label="Thương hiệu"
            name="brand"
            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Select placeholder="Chọn thương hiệu" style={{ height: 40 }}>
              {brands &&
                brands.map((brand) => (
                  <Select.Option key={brand.name} value={brand.name}>
                    {brand.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Thời gian bảo hành"
            name="guarantee"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian bảo hành" },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input
              placeholder="Nhập thời gian bảo hành"
              style={{ height: 40 }}
            />
          </Form.Item>
        </Form.Item>

        {/* tên */}
        {/* Series */}
        <Form.Item style={{ margin: 0 }}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input placeholder="Nhập tên sản phẩm" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item
            label="Series"
            name="series"
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input placeholder="Nhập Series sản phẩm" style={{ height: 40 }} />
          </Form.Item>
        </Form.Item>

        {/* Loại sản phẩm */}
        {/* Ngày phát hành */}
        <Form.Item style={{ margin: 0 }}>
          <Form.Item
            label="Loại sản phẩm"
            name="category"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại sản phẩm",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
          >
            <Select
              placeholder="Chọn loại sản phẩm"
              style={{ height: 40 }}
              onChange={handleSelectedCategory}
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
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <DatePicker style={{ height: 40 }} />
          </Form.Item>
        </Form.Item>

        {/* số lượng */}
        {/* demand */}
        <Form.Item style={{ margin: 0 }}>
          <Form.Item
            label="Nhu cầu"
            name="demand"
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
          >
            <Input
              placeholder="Nhập nhu cầu sử dụng sản phẩm"
              style={{ height: 40 }}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng sản phẩm" },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <InputNumber
              placeholder="Nhập số lượng sản phẩm đang bán"
              style={{ height: 40 }}
              min={0}
            />
          </Form.Item>
        </Form.Item>

        {/* Mô tả ngắn */}
        <Form.Item
          label="Mô tả ngắn"
          name="shortDescription"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả ngắn của sản phẩm",
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả chung của sản phẩm (Được hiển thị trên sản phẩm)" />
        </Form.Item>

        {/* main image */}
        <Form.Item
          label="Hình ảnh mặc định"
          name="main_image"
          rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
        >
          <Upload
            listType="picture-card"
            accept=".png,.jpeg,.jpg"
            onPreview={handlePreview}
            onChange={({ fileList: newFileList }) => {
              setMainImage(newFileList);
            }}
            beforeUpload={() => {
              return false;
            }}
          >
            {mainImage.length === 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        {/* modal preview image */}
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        {/* product variations */}
        <>
          <br />
          <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
            Biến thể của sản phẩm
          </h5>
          {arrVariations.map((variation, index) => (
            <Card
              size="small"
              title={`Biến thể ${index + 1}`}
              key={index}
              style={{ marginBottom: 8 }}
              extra={
                <CloseOutlined
                  onClick={() => {
                    remove(index);
                  }}
                />
              }
            >
              <ProductVariations
                index={index}
                variations={variation}
                handlePreview={handlePreview}
                fileList={fileList}
                setFileList={setFileList}
                arrVariations={arrVariations}
                setArrVariations={setArrVariations}
              />
            </Card>
          ))}
        </>
        {/* btn add variations */}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Thêm biến thể
          </Button>
        </Form.Item>

        {/* Other information */}
        <br />
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
          Thông tin khác (Tùy chọn)
        </h5>
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
                // value={input.inputName}
                onChange={(value) =>
                  handleInputChange(index, "inputName", value)
                }
                style={{ height: 40 }}
                showSearch
                allowClear
              >
                {selectedSpecifications &&
                  selectedSpecifications.map((specification) => (
                    <Select.Option value={specification}>
                      {formatSpecifications(specification)}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name={input.inputName}
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
          <Button
            onClick={handleAddInput}
            type="dashed"
            icon={<PlusOutlined />}
          >
            Thêm thẻ
          </Button>
        </Form.Item>

        <br />
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>Mô tả</h5>
        {/* description */}
        <Form.Item name="description">
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
              // console.log({ event, editor, data });
            }}
          />
        </Form.Item>

        {/* status */}
        <Form.Item
          name="status"
          valuePropName="checked"
          wrapperCol={{ offset: 20, span: 5 }}
        >
          <Checkbox>Trạng thái</Checkbox>
        </Form.Item>

        {/* btn submit */}
        <Form.Item shouldUpdate wrapperCol={{ offset: 20, span: 5 }}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={
                !clientReady ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Tạo sản phẩm
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default MainForm;
