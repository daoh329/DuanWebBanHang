import {
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  Upload,
  notification,
  Space,
  Card,
  Divider,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatCapacity } from "../../../../../util/formatCapacity";
import {
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

function ProductVariations(props) {
  const [colors, setColors] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getColorsList();
  }, []);

  useEffect(() => {
    getCapacitiesList();
  }, []);

  // function call api get colors
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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

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
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/List/add/capacity`,
        values,
        { withCredentials: true }
      );

      if (result.status === 200) {
        setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
          setIsOpenModalCapcity(false);
          getCapacitiesList();
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
    console.log(errorInfo);
    // message.error("Thêm thất bại");
  };

  return (
    <>
      <Modal
        title="Thêm lựa chọn cho dung lượng (Tối đa: 100000)"
        open={isOpenModalCapcity}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          onFinish={onFinish}
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
              max={100000}
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

      <Form.List
        name="variations"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(
                  new Error("Phải có ít nhất một biến thể")
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                size="small"
                title={`Phân loại sản phẩm (${name + 1})`}
                key={key}
                extra={
                  name + 1 !== 1 ? (
                    <CloseOutlined
                      onClick={() => {
                        remove(name);
                      }}
                    />
                  ) : null
                }
              >
                {/* colors*/}
                <Form.Item
                  {...restField}
                  label="Màu sắc"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                  }}
                  name={[name, "color"]}
                  rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
                >
                  <Select
                    placeholder="Chọn màu sắc"
                    optionLabelProp="label"
                    style={{ height: 40 }}
                    allowClear //cho phép xóa
                    showSearch //cho phép tìm kiếm
                  >
                    {colors &&
                      colors.map((color, index) => (
                        <Select.Option
                          key={index}
                          value={color.name}
                          label={color.name}
                        />
                      ))}
                  </Select>
                </Form.Item>

                {/* images */}
                <Form.Item
                  label="Hình ảnh sản phẩm cho màu sắc (Tối đa : 10 hình ảnh)"
                  {...restField}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hình ảnh tương ứng",
                    },
                  ]}
                  name={[name, "images"]}
                >
                  <Upload
                    listType="picture-card"
                    accept=".png,.jpeg,.jpg"
                    // onPreview={handlePreview}
                    onChange={({ fileList: newFileList }) => {
                      // Chuyển sang định dạng file originFileObj để upload lên server
                      const fileListNew = newFileList.map(
                        (file) => file.originFileObj
                      );
                      setFileList(fileListNew);
                    }}
                    beforeUpload={() => {
                      return false;
                    }}
                    multiple
                  >
                    {fileList.length >= 10 ? null : uploadButton}
                  </Upload>
                </Form.Item>

                {/* Capacity Group */}
                {/* Nest Form.List */}
                <Form.List
                  name={[name, "capacityGroup"]}
                  rules={[
                    {
                      validator: async (_, names) => {
                        if (!names || names.length < 1) {
                          return Promise.reject(
                            new Error("Phải có ít nhất một phân loại theo màu!")
                          );
                        }
                      },
                    },
                  ]}
                >
                  {(capacityGroup, subOpt, { errors }) => (
                    <div
                      style={{
                        display: "flex",
                        rowGap: 16,
                        flexDirection: "column",
                      }}
                    >
                      {capacityGroup.map(
                        ({ key: subKey, name: subName, ...restSubField }) => (
                          <Card
                            size="small"
                            style={{ background: "#E2E4E7" }}
                            title={`Phân loại dung lượng theo màu (${
                              subName + 1
                            })`}
                            key={subKey}
                            extra={
                              capacityGroup.length > 1 ? (
                                <CloseOutlined
                                  onClick={() => {
                                    subOpt.remove(subName);
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Form.Item style={{ margin: "0" }}>
                              {/* capacity */}
                              <Form.Item
                                {...restSubField}
                                label={" Dung lượng (ROM)"}
                                style={{
                                  display: "inline-block",
                                  width: "calc(50% - 8px)",
                                  margin: 0,
                                }}
                                name={[subKey, "capacity"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng chọn dung lượng",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Chọn dung lượng (ROM)"
                                  optionLabelProp="label"
                                  style={{ height: 40 }}
                                  allowClear //cho phép xóa
                                  showSearch //cho phép tìm kiếm
                                >
                                  {capacities &&
                                    capacities.map((capacity, index) => (
                                      <Option
                                        key={index}
                                        value={capacity.capacity}
                                        label={formatCapacity(
                                          capacity.capacity
                                        )}
                                      >
                                        <Space>
                                          {formatCapacity(capacity.capacity)}
                                        </Space>
                                      </Option>
                                    ))}
                                </Select>
                              </Form.Item>

                              {/* btn add capacity */}
                              <Form.Item>
                                <Button
                                  onClick={openModalAddCapacity}
                                  icon={<PlusOutlined />}
                                  style={{
                                    margin: "0 10px 0 0",
                                    border: "none",
                                    background: "none",
                                  }}
                                >
                                  Thêm lựa chọn cho dung lượng (ROM)
                                </Button>
                              </Form.Item>
                            </Form.Item>

                            {/* Giá */}
                            {/* Giá giảm */}
                            <Form.Item>
                              <Form.Item
                                {...restSubField}
                                label="Giá"
                                style={{
                                  display: "inline-block",
                                  width: "calc(50% - 8px)",
                                  margin: 0,
                                }}
                                name={[subName, "price"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập giá cho biến thể",
                                  },
                                ]}
                              >
                                <InputNumber
                                  max={1000000000}
                                  style={{ width: "100%" }}
                                  placeholder="Nhập giá sản phẩm"
                                  min={0}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restSubField}
                                label={`Giá giảm (Không vượt quá giá sản phẩm)`}
                                style={{
                                  display: "inline-block",
                                  width: "calc(50% - 8px)",
                                  margin: "0 8px",
                                }}
                                name={[subName, "discount_amount"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập giá giảm (Nếu có)",
                                  },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      // const price = getFieldsValue(true);
                                      const price = getFieldValue(["variations", name, "capacityGroup", subName, "price"])
                                      if (value && value > price) {
                                        return Promise.reject(
                                          "Giá giảm không thể lớn hơn giá chính!"
                                        );
                                      }
                                      return Promise.resolve();
                                    },
                                  }),
                                ]}
                              >
                                <InputNumber
                                  min={0}
                                  style={{ width: "100%" }}
                                  placeholder="Nhập giá giảm"
                                />
                              </Form.Item>
                            </Form.Item>

                            {/* Số lượng nhập */}
                            <Form.Item
                              label="Số lượng"
                              style={{
                                display: "inline-block",
                                width: "calc(50% - 8px)",
                                margin: "0",
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập số lượng",
                                },
                              ]}
                              name={[subName, "quantity_variant"]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                max={10000}
                                placeholder="Nhập số lượng sản phẩm"
                                min={0}
                              />
                            </Form.Item>
                            {/* Gach chan */}
                            <Divider />
                          </Card>
                        )
                      )}
                      {/* <Form.ErrorList errors={errors} /> */}
                      <p style={{ color: "red", margin: "10px 0 0 0 " }}>
                        {errors}
                      </p>
                      {/* btn Thêm loại dung lượng */}
                      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                        <Button
                          type="primary"
                          ghost
                          onClick={() => subOpt.add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm loại dung lượng
                        </Button>
                      </Form.Item>
                    </div>
                  )}
                </Form.List>
              </Card>
            ))}
            {/* btn add subField */}
            <Form.Item wrapperCol={{ offset: 7, span: 10 }}>
              <Button
                type="primary"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm phân loại sản phẩm
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </>
  );
}

export default ProductVariations;
