import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

import "./Style.css";
import ReceiverInformationModal from "./Modal/receiverInformationModal";

function Layout({ data, getValues }) {
  const [value, setValue] = useState(data);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    setValue(data);
  }, [data]);

  function handleOpenModal() {
    setOpen(true);
  }

  function handleCancelModal() {
    setOpen(false);
  }

  async function handleDelete() {
    try {
      const id = value.id;
      const url = `${process.env.REACT_APP_API_URL}/auth/delete-delivery-address/${id}`;
      const result = await axios.delete(url, {withCredentials: true});

      if (result.status === 200) {
        getValues();
        return message.success("Xóa thành công");
      }
      return message.warning("Xóa thất bại");
    } catch (error) {
      console.log(error);
      message.error("Xóa thất bại");
    }
  }

  return (
    <div className="item-container">
      <div className="item-content">
        <div className="information-group">
          <div className="item-name">
            <div style={{ marginRight: "8px" }}>{value.name}</div>
            {value.setdefault === 1 && (
              <div className="item-default-text">MẶC ĐỊNH</div>
            )}
          </div>
          <div className="item-address">
            Địa chỉ:{" "}
            {value.street +
              ", " +
              value.commune +
              ", " +
              value.district +
              ", " +
              value.city}
          </div>
          <div className="item-phone">Điện thoại: {value.phone}</div>
        </div>
        <div className="action-group">
          <div onClick={handleOpenModal} className="action-button-update">
            Chỉnh sửa
          </div>
          <ReceiverInformationModal
            getValues={getValues}
            data={value}
            action={"update"}
            open={open}
            cancel={handleCancelModal}
          />

          {value.setdefault !== 1 && (
            <div onClick={handleDelete} className="action-button-delete">
              Xóa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
