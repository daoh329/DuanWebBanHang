import { Button, Modal, Popconfirm, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import InputFrom from "../UpdateForm/InputFrom";
import Products from "../UpdateForm/Products";
import { NotificationBeenLoggedOut, openInfoModalNotPermission } from "../../../../NotificationsForm/Authenticated";
import { getPermission } from "../../../../../util/servicesGlobal";

function ActionButton({ record, getPhieuGiamGia }) {
  const [openModal, setOpenModal] = useState(false);
  const [openModalproduct, setOpenModalproduct] = useState(false);
  const [AddProduct, setAddProduct] = useState(false);
  // Hàm End_date
  async function handleEndDate() {

    // Check permission
    if (await getPermission() === "user") {
      openInfoModalNotPermission();
      return;
    }

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/discount/setEnd/${record.id}`,
        null,
        { withCredentials: true }
      );
      // window.location.reload();
      if (result.status === 200) {
        message.success("kết thúc thành công.");
        return getPhieuGiamGia();
      }
      return message.error("kết thúc thất bại.");
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        } else {
          console.log(error);
          message.error("kết thúc thất bại.");
        }
      }, 500);
    }
  }

  // Hàm mở Modal update
  function handleUpdate() {
    setOpenModal(true);
  }

  // Hàm đóng Modal update
  function handleCancel() {
    setOpenModal(false);
  }

  function handleProduct() {
    setOpenModalproduct(true);
  }
  function handleProductCancel() {
    setOpenModalproduct(false);
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <Button onClick={handleProduct}>Áp dụng sản phẩm</Button>
      <Modal
        open={openModalproduct}
        // title="danh sách sản phẩm áp dụng"
        onCancel={handleProductCancel}
        footer={false}
        style={{ minWidth: "800px" }}
      >
        <div>
          <Products
            setModal={setOpenModalproduct}
            data={record}
          />
        </div>
      </Modal>
      {/* update */}
      <Button onClick={handleUpdate}>Cập nhật</Button>
      <Modal
        open={openModal}
        title="Cập nhật Phiếu Giảm Giá"
        onCancel={handleCancel}
        footer={false}
        style={{ minWidth: "800px" }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InputFrom
            setModal={setOpenModal}
            onClick={getPhieuGiamGia}
            data={record}
          />
        </div>
      </Modal>
      <Popconfirm
        title="Cảnh báo!!!"
        description="Bạn có chắc chắn muốn kết thúc?"
        onConfirm={() => {
          handleEndDate();
        }}
        okText="Xác nhận"
        cancelText="Trở lại"
      >
        <Button danger disabled={(record.end_date < new Date().toISOString())}>
          Kết thúc
        </Button>
      </Popconfirm>
    </div>
  );
}

export default ActionButton;
