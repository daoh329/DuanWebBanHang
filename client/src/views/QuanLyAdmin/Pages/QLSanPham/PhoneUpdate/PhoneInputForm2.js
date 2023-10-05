import { Button, Form, Modal, Upload, notification } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function PhoneInputForm2({ data }) {
  const product = data;
  const [isLoading, setIsLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState(product.description);

  // Hàm được gọi khi không bị lỗi form
  const onFinish = async (values) => {
    // bật loading button submit
    setIsLoading(true);

    try {
      if (fileList.length !== 0 && description !== product.description) {
        return notification.warning({
          message: "Không có dữ liệu nào được thay đổi!",
        });
      }
      // Tạo FormData lưu dữ liệu
      const formData = new FormData();
      // Nếu có image được chọn
      if (fileList.length !== 0) {
        // đọc qua từ image và push vào formData
        fileList.forEach((file) => {
          formData.append("images", file.originFileObj);
        });
      }

      // Nếu description có sự thay đổi dữ liệu
      if (description !== product.description) {
        // append vào formData
        formData.append("description", description);
      }

      // call API update
      const result = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/update/${product.id}`,
        formData
      );

      if (result.status === 200) {
        return setTimeout(() => {
          setIsLoading(false);
          notification.success({
            message: "Cập nhật thành công!",
          });
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
        setIsLoading(false);
        notification.error({
          message: "Cập nhật thất bại!",
        });
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
      layout="horizontal"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      {...props}
    >
      {/* images */}
      <Upload
        listType="picture-card"
        accept=".png,.jpeg,.jpg"
        onPreview={handlePreview}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList);
        }}
        beforeUpload={() => {
          return false;
        }}
        multiple
        name="images"
      >
        {fileList.length >= 10 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      {/* description */}
      <Form.Item>
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {}}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PhoneInputForm2;
