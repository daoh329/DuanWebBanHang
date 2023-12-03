import { Button, Form, Modal, Upload, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { differenceWith, isEqual } from "lodash";

import ProductVariations from "./ProductVariations";
import { ArrayCompareArray } from "../../../../../util/servicesGlobal";
import { NotificationBeenLoggedOut } from "../../../../NotificationsForm/Authenticated";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function InputForm2({ data, onClick, setModal }) {
  const product = data;
  const [isLoading, setIsLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [mainImage, setMainImage] = useState([]);
  const [arrVariations, setArrVariations] = useState([
    {
      color: "",
      capacityGroup: [{ price: 0, discount_amount: 0, capacity: 0 }],
      // images: [],
    },
  ]);

  // gán giá trị variations hiện tại vào state arrVariations
  useEffect(() => {
    if (product) {
      var arrUniqueColor = [];
      const arrColor = new Set();
      [...product.variations].forEach((obj) => {
        const color = obj["color"];
        arrColor.add(color);
      });
      arrUniqueColor = Array.from(arrColor);
      var arrVariationsDB = [];
      arrUniqueColor.forEach((color) => {
        const objVariation = {
          color: color,
          capacityGroup: [],
        };
        [...product.variations].forEach((obj) => {
          if (obj["color"] === color) {
            const objCapacityGroup = {
              price: obj.price,
              discount_amount: obj.discount_amount,
              capacity: obj.capacity,
            };
            objVariation.capacityGroup.push(objCapacityGroup);
          }
        });
        arrVariationsDB.push(objVariation);
      });
      // console.log(arrVariationsDB);
      setArrVariations(arrVariationsDB);
    }
  }, [product]);

  // Hàm được gọi khi không bị lỗi form
  const onFinish = async (values) => {
    // bật loading button submit
    setIsLoading(true);
    try {
      // So sánh giá trị variations hiện tại và giá trị variations mới
      const arrVariationsOld = [...product.variations];
      const arrVariationsNew = [...arrVariations];
      var arrNew = [];
      arrVariationsNew.forEach((item) => {
        item.capacityGroup.forEach((itemCapacity) => {
          const objCapacity = {
            color: item.color,
            price: itemCapacity.price,
            discount_amount: itemCapacity.discount_amount,
            capacity: itemCapacity.capacity,
          };
          arrNew.push(objCapacity);
        });
      });
      // Nếu ảnh chính được chọn
      if (mainImage && mainImage.length !== 0) {
        // Thì gán giá trị ảnh chính vào values
        values.main_image = mainImage[0].originFileObj;
      } else {
        delete values.main_image;
      }
      // Nếu giá trị variations mới khác giá trị variations hiện tại
      if (!ArrayCompareArray(arrVariationsOld, arrNew)) {
        // Lấy các variations khác biệt
        const difference = differenceWith(arrNew, arrVariationsOld, isEqual);
        // Gán giá trị variations mới vào values
        values.variations = difference;
      }
      // Nếu giá trị variations mới giống giá trị variations hiện tại và không có ảnh chính đc chọn
      if (
        ArrayCompareArray(arrVariationsOld, arrNew) &&
        mainImage.length === 0
      ) {
        // Thông báo và dừng cập nhật
        setIsLoading(false);
        return notification.warning({
          message: "Không có dữ liệu nào được thay đổi!",
        });
      }

      // call API update
      const result = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/update/${product.id}`,
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (result.status === 200) {
        return setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
          setModal(false);
          onClick();
        }, 2000);
      }
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
      }, 2000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        if (error.reponse.status === 401) {
          setIsLoading(false);
          NotificationBeenLoggedOut();
        } else {
          setIsLoading(false);
          notification.error({
            message: "Cập nhật thất bại!",
          });
        }
      }, 2000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Cập nhật thất bại!",
    });
  };

  //   Tắt modal preview image
  const handleCancel = () => setPreviewOpen(false);

  //   Bật modal preview image
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

  //   nút upload image
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const props = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return (
    <Form
      style={{ maxWidth: 800, textAlign: "start" }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      {...props}
    >
      {/* main image */}
      <br />
      <Form.Item label="Ảnh mặc định" name="main_image">
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
          multiple
        >
          {mainImage.length === 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      {arrVariations &&
        [...arrVariations].map((item, index) => (
          <div key={index}>
            <ProductVariations
              index={index}
              variations={item}
              handlePreview={handlePreview}
              fileList={fileList}
              setFileList={setFileList}
              arrVariations={arrVariations}
              setArrVariations={setArrVariations}
            />
            <br />
          </div>
        ))}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default InputForm2;
