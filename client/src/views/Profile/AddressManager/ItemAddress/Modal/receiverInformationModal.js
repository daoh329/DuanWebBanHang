import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  message,
  notification,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { Option } = Select;

function ReceiverInformationModal({
  data,
  action,
  open,
  cancel,
  getValues,
  countAddress,
}) {
  const user = JSON.parse(localStorage.getItem("user"))

  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [receiverInformation, setReceiverInformation] = useState(data);
  const [form] = Form.useForm();

  useEffect(() => {
    setReceiverInformation(data);
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      setCity(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // select city
  const handleCityChange = (value) => {
    const selectedCity = city.find((city) => city.Name === value);
    setSelectedCity(selectedCity);
    setSelectedDistrict(null);
  };

  //select district
  const handleDistrictChange = (value) => {
    const selectedDistrict = selectedCity.Districts.find(
      (district) => district.Name === value
    );
    setSelectedDistrict(selectedDistrict);
  };
  //select ward
  const handleWardChange = (value) => {
    const selectedWard = selectedDistrict.Wards.find(
      (ward) => ward.Name === value
    );
    setSelectedWard(selectedWard);
  };

  // Hàm được gọi khi submit và không có lỗi form (add)
  const onFinishInsert = async (values) => {
    // Bật loading button submit
    setIsLoading(true);

    // Tạo trường id account cho values
    values["idUser"] = values["idUser"] || "";
    values["idUser"] = user.id;

    // Nếu địa chỉ hiện tại là địa chỉ đầu tiên thì gắn là mặc định
    if (countAddress === 0) {
      values["setdefault"] = values["setdefault"] || "";
      values["setdefault"] = 1;
    } else if (values.setdefault === true) {
      values["setdefault"] = values["setdefault"] || "";
      values["setdefault"] = 1;
    } else if (values.setdefault === false || values.setdefault === undefined) {
      values["setdefault"] = values["setdefault"] || "";
      values["setdefault"] = 0;
    }

    // try/catch check error
    try {
      // Tạo đường dẫn API
      const url = `${process.env.REACT_APP_API_URL}/auth/add-delivery-address`;
      // Call API
      const result = await axios.post(url, values);

      // Thông báo thành công nếu status === 200
      if (result.status === 200) {
        return setTimeout(() => {
          setIsLoading(false);
          // reset các field của form và tắt modal
          form.resetFields();
          // gọi hàm get address
          getValues();
          // Tắt modal
          cancel();
          notification.success({
            message: "Thành công!",
          });
        }, 1000);
      }

      // Thông báo thất bại nếu status !== 200
      return setTimeout(() => {
        setIsLoading(false);
        notification.warning({
          message: "Thất bại!",
        });
      }, 1000);
    } catch (error) {
      // Thông báo thất bại nếu lỗi
      setTimeout(() => {
        console.log(error);
        setIsLoading(false);
        notification.error({
          message: "Thất bại!",
        });
      }, 1000);
    }
  };

  // Hàm được gọi khi submit và không có lỗi form (update)
  const onFinishUpdate = async (values) => {
    // Bật loading button submit
    setIsLoading(true);
    // Biến kiểm tra sự thay đổi dữ liệu
    var checkValue = false;
    try {
      // Nếu không đúng kiểu hành động thì dừng lại
      if (action !== "update") return;
      // Lặp qua các trường dữ liệu của form
      for (const fieldName in values) {
        // Nếu có dữ liệu là rỗng thì chuyển hết thành undefined
        if (
          values[fieldName] === "" ||
          values[fieldName] === receiverInformation[fieldName]
        ) {
          values[fieldName] = undefined;
        }
        // Nếu địa chỉ đã là mặc định thì không cần cập nhật (setdefault => undefined)
        if (
          fieldName === "setdefault" &&
          values[fieldName] === true &&
          receiverInformation[fieldName] === 1
        ) {
          values[fieldName] = undefined;
        }
        // nếu trường có dữ liệu
        if (values[fieldName]) {
          // Đặt checkValue = true để call api cập nhật
          checkValue = true;
          // Đổi setdefault từ true -> 1
          if (fieldName === "setdefault") {
            if (values[fieldName] === true) {
              values[fieldName] = 1;
            }
          }
        }
      }

      // Nếu không có dữ liệu nào thay đổi thì dừng cập nhật và thông báo
      if (!checkValue) {
        return setTimeout(() => {
          setIsLoading(false);
          message.warning("Không có dữ liệu được thay đổi");
        }, 1000);
      }
      // Call API Update
      const url = `${process.env.REACT_APP_API_URL}/auth/update-delivery-address/${receiverInformation.id}`;
      const result = await axios.put(url, values);

      // Nếu status === 200 -> thông báo thành công
      if (result.status === 200) {
        return setTimeout(() => {
          setIsLoading(false);
          // gọi hàm get address
          getValues();
          // Tắt modal
          cancel();
          notification.success({
            message: "Cập nhật thành công",
          });
        }, 1000);
      }
      setTimeout(() => {
        setIsLoading(false);
        notification.warning({
          message: "Cập nhật thất bại",
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập thật thất bại",
        });
      }, 1000);
    }
  };

  // Hàm được gọi khi submit và form bị lỗi
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleCancel() {
    cancel();
    form.resetFields();
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      style={{ top: 20 }}
      footer={[
        <Button
          htmlType="submit"
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={form.submit}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <h5>Thông tin người nhận hàng</h5>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={action === "add" ? onFinishInsert : onFinishUpdate}
        onFinishFailed={onFinishFailed}
        initialValues={
          receiverInformation && {
            name: receiverInformation.name,
            phone: receiverInformation.phone,
            email: receiverInformation.email,
            city: receiverInformation.city,
            district: receiverInformation.district,
            commune: receiverInformation.commune,
            street: receiverInformation.street,
          }
        }
      >
        {/* Tên */}
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Tên không được bỏ trống" }]}
        >
          <Input placeholder="Nhập tên người nhận" />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được bỏ trống" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại người nhận" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Email không được bỏ trống" }]}
        >
          <Input placeholder="Nhập email người nhận" />
        </Form.Item>

        <Divider />
        {/* Tỉnh/Thành phố */}
        <Form.Item
          label="Tỉnh/Thành phố"
          name="city"
          rules={[
            { required: true, message: "Tỉnh/Thành phố không được bỏ trống" },
          ]}
        >
          <Select placeholder="Chọn" onChange={handleCityChange}>
            {city.map((city) => (
              <Option key={city.Id} value={city.Name}>
                {city.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Quận/huyện */}
        <Form.Item
          name="district"
          label="Quận/huyện"
          rules={[
            { required: true, message: "Quận/huyện không được bỏ trống" },
          ]}
        >
          <Select placeholder="Chọn" onChange={handleDistrictChange}>
            {selectedCity &&
              selectedCity.Districts.map((district) => (
                <Option key={district.Id} value={district.Name}>
                  {district.Name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="commune"
          label="Xã/Phường"
          rules={[{ required: true, message: "Xã/Phường không được bỏ trống" }]}
        >
          <Select placeholder="Chọn" onChange={handleWardChange}>
            {selectedDistrict &&
              selectedDistrict.Wards.map((ward) => (
                <Option key={ward.Id} value={ward.Name}>
                  {ward.Name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="street"
          label="Địa chỉ cụ thể"
          rules={[
            { required: true, message: "Địa chỉ cụ thể không được bỏ trống" },
          ]}
        >
          <Input placeholder="Số nhà,ngõ,tên đường..." />
        </Form.Item>
        <Form.Item
          name="setdefault"
          valuePropName="checked"
          wrapperCol={{ offset: 15, span: 8 }}
        >
          <Checkbox
            defaultChecked={
              receiverInformation && receiverInformation.setdefault === 1
                ? true
                : false
            }
            disabled={
              receiverInformation && receiverInformation.setdefault === 1
                ? true
                : false
            }
          >
            Đặt làm mặc định
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ReceiverInformationModal;
