import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import "./Stylye.css";
import ItemLayout from "./ItemAddress/Layout.js";
import axios from "axios";
import ReceiverInformationModal from "./ItemAddress/Modal/receiverInformationModal";

function Layout() {
  // Lấy id user
  const idUser = localStorage.getItem("idUser");

  //   Các biết cục bộ
  const [receiverInformation, setReceiverInformation] = useState([]);
  // open modal
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (idUser) {
      getDeliveryAddress();
    }
  }, []);

  if (!idUser) return;

  // Hàm lấy thông tin địa chỉ nhận hàng của người dùng
  const getDeliveryAddress = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/delivery-address/${idUser}`
      );
      // sử lí address mặc định luôn render phía trên
      var address = result.data;
      address.sort((a, b) => a.setdefault - b.setdefault);
      setReceiverInformation(address);
    } catch (error) {
      console.log(error);
    }
  };

  function handleOpenModal() {
    setOpen(true);
  }

  function handleCancelModal() {
    setOpen(false);
  }

  function countAddress() {
    return receiverInformation.length;
  }

  return (
    <div className="address-style">
      <h5>Sổ địa chỉ</h5>
      <div className="add-group">
        <div onClick={handleOpenModal} className="add-control">
          <PlusOutlined style={{ marginRight: "5px", fontSize: "18px" }} />
          <span className="text">Thêm địa chỉ mới</span>
        </div>
      </div>
      <ReceiverInformationModal
        countAddress={countAddress()}
        getValues={getDeliveryAddress}
        action={"add"}
        open={open}
        cancel={handleCancelModal}
      />

      <div className="update-delete-group">
        {receiverInformation &&
          receiverInformation
            .slice()
            .reverse()
            .map((value) => (
              <ItemLayout
                key={value.id}
                getValues={getDeliveryAddress}
                data={value}
              />
            ))}
      </div>
    </div>
  );
}

export default Layout;
