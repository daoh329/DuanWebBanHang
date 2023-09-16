import { useState } from "react";
import "./style.css";
import { CloseOutlined } from "@ant-design/icons";

function PreviewImage({ file, formik, index }) {
  const [preView, setPreView] = useState({});
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreView(reader.result);
    };
  }

  const handleDeleteImage = () => {
    const updateImage = [...formik.values.images];
    updateImage.splice(index, 1);
    formik.setFieldValue("images", updateImage);
  };
  return (
    <div className="preview_image_group">
      <CloseOutlined onClick={handleDeleteImage} className="close_image_icon" />
      <img className="preview_image_control" src={preView} alt="" />
    </div>
  );
}

export default PreviewImage;
