import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import PreviewImage from "../ImageComponent/PreviewImage";
import "./StyleImage.css";
import { Modal, Upload } from "antd";

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

function ImageInput(props) {
  const {formik , setMainImage} = props;
  const indexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const checkImage = (event) => {
    if (event.target.files.length === 0) {
      return false;
    }
    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(
        event.target.files[0].type
      )
    ) {
      alert("Vui lòng chọn đúng định dạng ảnh!");
      return false;
    }
    if (event.target.files[0].size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn!");
      return false;
    }
    return true;
  };

  // MAIN_IMAGE
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setMainImage(fileList);
  }, [fileList]);
  
  // nút upload image
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <div className="form-group">
      {/* title */}
      <label className="form-label">Hình ảnh</label>
      {/* image */}
      <div className="image_group">
        {/* images */}
        <Upload
          listType="picture-card"
          accept=".png,.jpeg,.jpg"
          // onPreview={handlePreview}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList);
          }}
          beforeUpload={() => {
            return false;
          }}
          multiple
          name="main_image"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        {/* <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal> */}
        {indexs.map((i) => (
          <div
            key={i}
            style={formik.values.images[i] ? { border: "none" } : {}}
            className="div-image-control"
          >
            <PlusOutlined className="icon-control" />
            <input
              name="images"
              id="images"
              type="file"
              className="image-control"
              accept="image/*"
              onChange={(event) => {
                if (!checkImage(event)) return;
                if (formik.values.images[i]) {
                  const updateImage = [...formik.values.images];
                  updateImage[i] = event.target.files[0];
                  formik.setFieldValue("images", updateImage);
                  return;
                }
                formik.setFieldValue("images", [
                  ...formik.values.images,
                  event.target.files[0],
                ]);
              }}
            />
            {formik.values.images[i] && (
              <PreviewImage
                file={formik.values.images[i]}
                formik={formik}
                index={i}
              />
            )}
          </div>
        ))}
      </div>

      {formik.errors.images && (
        <span className="form-message">{formik.errors.images}</span>
      )}
    </div>
  );
}

export default ImageInput;
