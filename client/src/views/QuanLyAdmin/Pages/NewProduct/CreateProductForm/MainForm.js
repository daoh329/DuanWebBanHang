import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  notification,
  Space,
  Card,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductVariations from "./ProductVariations";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { formatSpecifications } from "../../../../../util/formatSpecifications";
import config from "../../../../../config";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";

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
  // const [arrVariations, setArrVariations] = useState([
  //   {
  //     color: "",
  //     capacityGroup: [
  //       {
  //         price: 0,
  //         discount_amount: 0,
  //         capacity: 0,
  //         quantity_variant: 1,
  //       },
  //     ],
  //     images: [],
  //   },
  // ]);
  const [description, setDescription] = useState("");

  //   images and colors
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

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
        setSelectedSpecifications(config.laptop_specifications);
      } else {
        setSelectedSpecifications(config.phone_specifications);
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
      // values["variations"] = arrVariations;
      values["description"] = description;

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
      ];

      // Đưa các trường thuộc configuration vào trường configuration
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
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Thành công",
            description: "Sản phẩm đã được tạo thành công!",
          });
        }, 500);
      }

      setIsLoading(false);
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          setIsLoading(false);
          NotificationBeenLoggedOut();
        } else {
          setIsLoading(false);
          console.log(error);
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi tạo sản phẩm!",
          });
        }
      }, 500);
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

  const getInitialValues = () => [
    {
      capacityGroup: [
        {
          price: null,
          discount_amount: null,
          capacity: null,
          quantity_variant: null,
        },
      ],
      color: null,
      images: [],
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form
        style={{ maxWidth: 1000, textAlign: "start", minWidth: 800 }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        initialValues={{
          status: true,
          variations: getInitialValues(),
        }}
        // autoComplete="off"
      >
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
          Thông tin chung
        </h5>
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "10px",
          }}
        >
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
                { max: 20, message: "Không được nhập quá 20 kí tự" },
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
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
                { max: 80, message: "Không được nhập quá 80 kí tự" },
              ]}
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
              rules={[{ max: 25, message: "Không được nhập quá 25 kí tự" }]}
            >
              <Input
                placeholder="Nhập Series sản phẩm"
                style={{ height: 40 }}
              />
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
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày phát hành",
                },
              ]}
            >
              <DatePicker style={{ height: 40 }} />
            </Form.Item>
          </Form.Item>

          {/* demand */}
          {/* số lượng */}
          <Form.Item style={{ margin: 0 }}>
            <Form.Item
              label="Nhu cầu"
              name="demand"
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
              }}
              rules={[{ max: 100, message: "Không được nhập quá 100 kí tự" }]}
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
                max={1000000}
                placeholder="Nhập số lượng sản phẩm đang bán"
                style={{ height: 40 }}
                min={0}
              />
            </Form.Item>
          </Form.Item>

          {/* Mô tả ngắn */}
          <Form.Item
            label="Mô tả ngắn (Tối đa 160 kí tự)"
            name="shortDescription"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả ngắn của sản phẩm",
              },
              {
                max: 160,
                message: "Không được nhập quá 160 kí tự",
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
        </div>

        <br />
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
          Thêm các phân loại của sản phẩm
        </h5>
        {/* product variations */}
        <ProductVariations />

        {/* Other information */}
        <br />
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>
          Thông tin khác (Tùy chọn)
        </h5>
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
                    >
                      {selectedSpecifications &&
                        selectedSpecifications.map((specification, index) => (
                          <Select.Option key={index} value={specification}>
                            {formatSpecifications(specification)}
                          </Select.Option>
                        ))}
                    </Select>
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

        <br />
        <h5 style={{ margin: "20px 0 10px 0", fontWeight: "bold" }}>Mô tả</h5>
        {/* description */}
        <div>
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
        </div>
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
