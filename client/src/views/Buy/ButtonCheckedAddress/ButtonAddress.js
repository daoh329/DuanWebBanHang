import { Modal } from "antd";
import React, { useState } from "react";
import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ReceiverInformationModal from "../../Profile/AddressManager/ItemAddress/Modal/receiverInformationModal";

function ButtonAddress({ value, checked, onClick, index, getValues }) {
  const user = JSON.parse(localStorage.getItem("user"))

  const [isModalOpenShow, setIsModalOpenShow] = useState(false);

  const navigate = useNavigate();

  // modal
  const showModalUpdate = (value) => {
    setIsModalOpenShow(true);
  };

  const handleCancel = () => {
    setIsModalOpenShow(false);
  };

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Bạn chưa đăng nhập?",
      icon: <ExclamationCircleFilled />,
      content: "Hãy đăng nhập để sửa dụng tính năng này!",
      onOk() {
        navigate("/login");
      },
      onCancel() {},
    });
  };

  return (
    <div
      key={index}
      onClick={() => onClick(index)}
      className="address-show"
      style={checked ? { borderColor: "blue" } : {}}
    >
      {/* icon checked */}
      {checked && (
        <div className="address-show-checked">
          <CheckOutlined className="address-show-checked-icon" />
        </div>
      )}

      <div className="address-control">
        {/* show name */}
        <div className="address-control-name">
          <span>{value.name}</span>
          <EditOutlined
            onClick={user ? () => showModalUpdate(value) : showConfirm}
            className="address-control-edit-icon"
          />
        </div>
        {/* show phone */}
        <div className="address-control-phone">{value.phone}</div>
        {/* show address details*/}
        <div className="address-control-details">
          {value.street + ", "}
          {value.commune + ", "}
          {value.district + ", "}
          {value.city}
        </div>
      </div>

      <ReceiverInformationModal
        open={isModalOpenShow}
        cancel={handleCancel}
        getValues={getValues}
        action={"update"}
        data={value}
      />
    </div>
  );
}

export default ButtonAddress;
