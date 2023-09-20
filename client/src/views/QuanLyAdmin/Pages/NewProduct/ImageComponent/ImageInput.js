import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import PreviewImage from "../ImageComponent/PreviewImage";
import "./StyleImage.css";

function ImageInput({ formik }) {
  const [indexs, setIndexs] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

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

  return (
    <div className="form-group">
      {/* title */}
      <label className="form-label">Hình ảnh</label>
      {/* image */}
      <div className="image_group">
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
