import { Button, Modal, Popconfirm, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import InputFrom from "../UpdateForm/InputFrom";
import InputFrom2 from "../UpdateForm/InputForm2";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";

function ActionButton({ record, getProduct }) {
  const [openModal, setOpenModal] = useState(false);
  const [isOpenEditImageAndDescription, setIsOpenEditImageAndDescription] =
    useState(false);

  // Hàm disable và enable sản phẩm
  async function handleDisableAndEnable() {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/disable-and-enable`,
        { id: record.id, status: record.status },
        { withCredentials: true }
      );
      // window.location.reload();
      if (result.status === 200) {
        message.success("Vô hiệu hóa thành công.");
        return getProduct();
      }
      return message.error("Vô hiệu hóa thất bại.");
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        }else {
          console.log(error);
          message.error("Vô hiệu hóa thất bại.");
        }
      },500);

    }
  }

  // Hàm mở Modal update
  async function handleUpdate() {
    setOpenModal(true);
  }

  // Hàm đóng Modal update
  function handleCancel() {
    setOpenModal(false);
  }

  // Hàm xóa sản phẩm
  async function handleDelete() {
    // /product/delete/:id
    try {
      const result = await axios.delete(
        `${process.env.REACT_APP_API_URL}/product/delete/${record.id}`,
        { withCredentials: true }
      );
      if (result.status === 200) {
        message.success("Đã xóa sản phẩm.");
        return getProduct();
      }
      return message.success("Đã xóa sản phẩm.");
    } catch (error) {
      setTimeout(() => {
        if (error.response.status === 401) {
          NotificationBeenLoggedOut();
        } else {
          console.log(error);
          message.error("Xóa sản phẩm thất bại.");
        }
      }, 500);
    }
  }

  // Hàm mở modal sửa image and description
  function handleOpenEditImage() {
    setIsOpenEditImageAndDescription(true);
  }

  // Hàm đóng modal sửa image and description
  function handleCloseEditImage() {
    setIsOpenEditImageAndDescription(false);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {/* enable & disable */}
      {record.status === 1 ? (
        <Popconfirm
          title="Cảnh báo!!!"
          description="Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này?"
          onConfirm={handleDisableAndEnable}
          okText="Xác nhận"
          cancelText="Trở lại"
        >
          <Button danger>Vô hiệu hóa</Button>
        </Popconfirm>
      ) : (
        <Popconfirm
          title="Cảnh báo!!!"
          description="Bạn có chắc chắn muốn kích hoạt sản phẩm này?"
          onConfirm={handleDisableAndEnable}
          okText="Xác nhận"
          cancelText="Trở lại"
        >
          <Button>Kích hoạt</Button>
        </Popconfirm>
      )}
      {/* update */}
      <Button onClick={handleUpdate}>Cập nhật</Button>
      <Modal
        open={openModal}
        title="Cập nhật sản phẩm"
        onCancel={handleCancel}
        footer={false}
        style={
          isOpenEditImageAndDescription
            ? { minWidth: "800px" }
            : { minWidth: "800px" }
        }
      >
        {/* edit phone */}
        {!isOpenEditImageAndDescription && (
          <div>
            <Button
              onClick={handleOpenEditImage}
              style={{ marginBottom: "10px" }}
            >
              Cập nhật hình ảnh, giá và khuyến mại
            </Button>
            <InputFrom
              setModal={setOpenModal}
              onClick={getProduct}
              data={record}
            />
          </div>
        )}
        {isOpenEditImageAndDescription && (
          <div>
            <Button
              onClick={handleCloseEditImage}
              style={{ marginBottom: "10px" }}
            >
              Trở lại
            </Button>
            <InputFrom2
              setModal={setOpenModal}
              onClick={getProduct}
              data={record}
            />
          </div>
        )}
      </Modal>
      {/* delete */}
      <Popconfirm
        title="Cảnh báo!!!"
        description="Bạn có chắc chắn muốn XÓA sản phẩm này?"
        onConfirm={handleDelete}
        okText="Xóa"
        cancelText="Trở lại"
      >
        <Button>Xóa</Button>
      </Popconfirm>
    </div>
  );
}

export default ActionButton;
