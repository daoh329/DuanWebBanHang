import {
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  Upload,
  notification,
  Space,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatCapacity } from "../../../../../util/formatCapacity";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function ProductVariations(props) {
  const { index, handlePreview, fileList, arrVariations, setArrVariations } =
    props;
  const [colors, setColors] = useState([]);
  const [capacities, setCapacities] = useState([]);

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

  const handleInputChange = (index, key, value) => {
    if (key === "images") {
    }
    const updatedVariations = [...arrVariations];
    updatedVariations[index][key] = value;
    setArrVariations(updatedVariations);
  };

  const handleSubFieldChange = (fieldIndex, subFieldIndex, key, value) => {
    const updatedVariations = [...arrVariations];
    updatedVariations[fieldIndex].capacityGroup[subFieldIndex][key] = value;
    setArrVariations(updatedVariations);
  };

  const addSubField = () => {
    const updatedVariations = [...arrVariations];
    updatedVariations[index].capacityGroup.push({
      price: 0,
      discount_amount: 0,
      capacity: 0,
    });
    setArrVariations(updatedVariations);
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
        values
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

      {/* colors*/}
      <h5>Màu sắc</h5>
      <Form.Item
        label="Màu sắc"
        style={{
          display: "inline-block",
          width: "calc(50% - 8px)",
        }}
      >
        <Select
          placeholder="Chọn màu sắc"
          optionLabelProp="label"
          style={{ height: 40 }}
          onChange={(value) => handleInputChange(index, "color", value)}
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
        label="Hình ảnh sản phẩm cho màu sắc"
        rules={[{ required: true, message: "Vui lòng chọn dung lượng (ROM)" }]}
      >
        <Upload
          listType="picture-card"
          accept=".png,.jpeg,.jpg"
          onPreview={handlePreview}
          onChange={({ fileList: newFileList }) => {
            // Chuyển sang định dạng file originFileObj để upload lên server
            const fileList = newFileList.map((file) => file.originFileObj);
            handleInputChange(index, "images", fileList);
          }}
          beforeUpload={() => {
            return false;
          }}
          multiple
        >
          {fileList.length >= 10 ? null : uploadButton}
        </Upload>
      </Form.Item>
      
      <h5>Dung lượng</h5>
      {arrVariations[index].capacityGroup.map((item, i) => (
        <div key={i}>
          <CapacityGroup
            capacities={capacities}
            fieldIndex={index}
            subFieldIndex={i}
            openModalAddCapacity={openModalAddCapacity}
            handleSubFieldChange={handleSubFieldChange}
          />
        </div>
      ))}
      {/* btn add subField */}
      <Form.Item style={{ margin: "8px 0 0 0" }} wrapperCol={{ offset: 11, span: 4 }}>
        <Button
          icon={<PlusOutlined />}
          onClick={addSubField}
          type="primary"
          shape="round"
        />
      </Form.Item>
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
  } = props;

  return (
    <>
      <br />
      {/* capacity */}
      <hr/>
      <Form.Item style={{ margin: 0 }}>
        <Form.Item
          label={"Dung lượng (ROM) "+ subFieldIndex}
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
          >
            {capacities &&
              capacities.map((capacity, index) => (
                <Option
                  key={index}
                  value={capacity.capacity}
                  label={formatCapacity(capacity.capacity)}
                >
                  <Space>{formatCapacity(capacity.capacity)}</Space>
                </Option>
              ))}
          </Select>
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
          label="Giá"
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
          />
        </Form.Item>
        <Form.Item
          label={`Giá giảm (Tùy chọn)`}
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
          />
        </Form.Item>
      </Form.Item>
    </>
  );
}

export default ProductVariations;
