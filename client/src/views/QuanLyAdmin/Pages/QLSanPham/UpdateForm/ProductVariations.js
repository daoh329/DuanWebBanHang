import {
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  notification,
  Divider,
  Space,
  Card,
  Upload,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatCapacity } from "../../../../../util/formatCapacity";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

function ProductVariations() {
  // const { index, arrVariations, setArrVariations, variations } = props;
  const [colors, setColors] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [fileList, setFileList] = useState([]);
  // const [variationsData, setVariationsData] = useState([]);
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
      const c = response.data.results;
      const arr = [];
      [...c].forEach((item) => {
        const obj = {
          value: item.name,
          label: item.name,
        };
        arr.push(obj);
      });
      setColors(arr);
    } catch (e) {
      console.log(e);
    }
  };

  // function call api get capacity list
  const getCapacitiesList = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/List/capacity`)
      .then((response) => {
        const c = response.data.results;
        const arr = [];
        [...c].forEach((item) => {
          const obj = {
            value: item.capacity,
            label: formatCapacity(item.capacity),
          };
          arr.push(obj);
        });
        setCapacities(arr);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Tải lên</div>
  //   </div>
  // );

  // const handleInputChange = (index, key, value) => {
  //   const updatedVariations = [...arrVariations];
  //   updatedVariations[index][key] = value;
  //   setArrVariations(updatedVariations);
  // };

  // const handleSubFieldChange = (fieldIndex, subFieldIndex, key, value) => {
  //   const updatedVariations = [...arrVariations];
  //   updatedVariations[fieldIndex].capacityGroup[subFieldIndex][key] = value;
  //   setArrVariations(updatedVariations);
  // };

  const addSubField = () => {
    // const updatedVariations = [...arrVariations];
    // updatedVariations[index].capacityGroup.push({
    //   price: 0,
    //   discount_amount: 0,
    //   capacity: 0,
    // });
    // setArrVariations(updatedVariations);
  };

  const removeSubField = (indexToRemove) => {
    // const updatedVariations = [...arrVariations];
    // updatedVariations[index].capacityGroup.splice(indexToRemove, 1); // Xóa 1 phần tử từ vị trí indexToRemove
    // setArrVariations(updatedVariations); // Cập nhật state hoặc mảng gốc của bạn
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

  // nút upload image
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Modal
        title="Thêm lựa chọn cho dung lượng"
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
        {(variations, { add, remove }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {variations.map(({ key, name, ...restField }) => (
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
                  disabled  
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
                {/* <Form.Item
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
                </Form.Item> */}

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
                                  disabled
                                  placeholder="Chọn dung lượng (ROM)"
                                  optionLabelProp="label"
                                  style={{ height: 40 }}
                                  allowClear //cho phép xóa
                                  showSearch //cho phép tìm kiếm
                                />
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
                                label="Giá (VND)"
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
                                      const price = getFieldValue([
                                        "variations",
                                        name,
                                        "capacityGroup",
                                        subName,
                                        "price",
                                      ]);

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
                                  max={1000000000}
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
                                placeholder="Nhập số lượng sản phẩm"
                                min={0}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Số lượng còn lại (Không vượt quá số lượng gốc)"
                              style={{
                                display: "inline-block",
                                width: "calc(50% - 8px)",
                                margin: "0 8px",
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập số còn lại",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    // const price = getFieldsValue(true);
                                    const quantity = getFieldValue([
                                      "variations",
                                      name,
                                      "capacityGroup",
                                      subName,
                                      "quantity_variant",
                                    ]);
                                    
                                    if (value && value > quantity) {
                                      return Promise.reject(
                                        "Số lượng còn lại không thể lớn hơn số lượng gốc!"
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                              name={[subName, "remaining_quantity_variant"]}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
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

// component capacity group form
function CapacityGroup(props) {
  const {
    capacities,
    fieldIndex,
    subFieldIndex,
    openModalAddCapacity,
    handleSubFieldChange,
    removeSubField,
    capacityGroupDefault,
  } = props;

  return (
    <>
      {/* capacity */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h6>{subFieldIndex + 1}</h6>
        <Button
          disabled
          onClick={() => removeSubField(subFieldIndex)}
          icon={<MinusCircleOutlined />}
        >
          Xóa
        </Button>
      </div>

      <Form.Item style={{ margin: 0 }}>
        <Form.Item
          label={"Dung lượng (ROM)"}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: 0,
          }}
        >
          <Select
            placeholder="Chọn dung lượng (ROM)"
            optionLabelProp="label"
            style={{ height: 40 }}
            onChange={(value) =>
              handleSubFieldChange(fieldIndex, subFieldIndex, "capacity", value)
            }
            allowClear //cho phép xóa
            showSearch //cho phép tìm kiếm
            value={capacityGroupDefault.capacity}
            options={capacities}
            disabled
          ></Select>
        </Form.Item>
        {/* btn add capacity */}
        <Form.Item>
          <Button
            onClick={openModalAddCapacity}
            icon={<PlusOutlined />}
            style={{ margin: "0 10px 0 0", border: "none", background: "none" }}
          >
            Thêm dung lượng (ROM)
          </Button>
        </Form.Item>
      </Form.Item>

      {/* Giá */}
      {/* Giá giảm */}
      <Form.Item style={{ margin: "0" }}>
        <Form.Item
          label="Giá (VND)"
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: 0,
          }}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá sản phẩm"
            min={0}
            onChange={(value) =>
              handleSubFieldChange(fieldIndex, subFieldIndex, "price", value)
            }
            value={capacityGroupDefault.price}
          />
        </Form.Item>
        <Form.Item
          label={`Giá giảm (VND)`}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: "0 8px",
          }}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá giảm"
            onChange={(value) =>
              handleSubFieldChange(
                fieldIndex,
                subFieldIndex,
                "discount_amount",
                value
              )
            }
            value={capacityGroupDefault.discount_amount}
          />
        </Form.Item>
      </Form.Item>
      <hr />
      {/* <br /> */}
    </>
  );
}

export default ProductVariations;
