import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, notification, Spin } from "antd";
import { NotificationBeenLoggedOut } from "../../NotificationsForm/Authenticated";

function NewDiscountCode() {
    const [discountType, setDiscountType] = useState("vnd");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formik = useFormik({
        initialValues: {
            content: "",
            value_vnd: 0,
            value_percent: 0,
            start_date: "",
            end_date: "",
        },
        validationSchema: Yup.object().shape({
            content: Yup.string().required("Vui lòng nhập nội dung mã giảm giá!"),
            value_vnd: Yup.number().min(0, "Giá trị VND không thể nhỏ hơn 0!"),
            value_percent: Yup.number().min(0, "Phần trăm giảm giá không thể nhỏ hơn 1!").max(100, "Phần trăm giảm giá không thể lớn hơn 100!"),
            start_date: Yup.date().required("Vui lòng chọn ngày bắt đầu!"),
            end_date: Yup.date().required("Vui lòng chọn ngày kết thúc!").min(Yup.ref("start_date"), "Ngày kết thúc phải sau ngày bắt đầu!"),
        }),
        onSubmit: async (values) => {
            setIsModalOpen(true);
            const url = `${process.env.REACT_APP_API_URL}/discount/add`;
            try {
                const res = await axios.post(url, values, { withCredentials: true });
                if (res.status === 200) {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.success({
                            message: "Thành công",
                            description: "Mã giảm giá đã được lưu thành công!",
                        });
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.error({
                            message: "Lỗi",
                            description: "Có lỗi xảy ra khi lưu dữ liệu!",
                        });
                    }, 1000);
                }
            } catch (e) {
                // Nếu lỗi chưa đăng nhập
                if (e.response.data.message === "Unauthorized") {
                    setTimeout(() => {
                        setIsModalOpen(false);
                        NotificationBeenLoggedOut();
                    }, 500);
                } else {
                    // Các lỗi khác
                    setTimeout(() => {
                        setIsModalOpen(false);
                        notification.error({
                            message: "Lỗi",
                            description: "Có lỗi xảy ra khi lưu dữ liệu!",
                        });
                    }, 1000);
                }
            }
        },
    });

    useEffect(() => {
    }, []);

    const handleDiscountTypeChange = () => {
        if (discountType === 'vnd') {
            setDiscountType('percent');
            formik.setValues({ ...formik.values, value_percent: 0 });
        } else {
            setDiscountType('vnd');
            formik.setValues({ ...formik.values, value_vnd: 0 });
        }
    };
    return (
        <div className="container-content">
            <div className="page-group">
                <form
                    className="form"
                    id="form-create-discount-code"
                    onSubmit={formik.handleSubmit}
                >
                    <h3 style={{ fontWeight: "bold" }}>Thêm mã giảm giá</h3>

                    <div className="form-group">
                        <label className="form-label">Nội dung</label>
                        <input
                            type="text"
                            name="content"
                            id="content"
                            className="form-control"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Value Hiện tại:
                            <button style={{padding:"0px 5px",marginleft:"20px"}} type="button" onClick={handleDiscountTypeChange}>
                                {discountType === "vnd" ? "VND" : "%"}
                            </button>
                        </label>
                        <input
                            type="number"
                            name={discountType === "vnd" ? "value_vnd" : "value_percent"}
                            id={discountType === "vnd" ? "value_vnd" : "value_percent"}
                            className="form-control"
                            value={
                                discountType === "vnd"
                                    ? formik.values.value_vnd
                                    : formik.values.value_percent
                            }
                            max={discountType === "percent" ? 100 : undefined}
                            onChange={formik.handleChange}
                        />
                    </div>


                    <div className="form-group">
                        <label className="form-label">Ngày bắt đầu</label>
                        <input
                            type="datetime-local"
                            name="start_date"
                            id="start_date"
                            className="form-control"
                            value={formik.values.start_date}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ngày kết thúc</label>
                        <input
                            type="datetime-local"
                            name="end_date"
                            id="end_date"
                            className="form-control"
                            value={formik.values.end_date}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-submit-form">
                        Xác nhận
                    </button>
                    <Modal open={isModalOpen} footer={null} closeIcon={null}>
                        <Spin tip="Đang tải lên..." spinning={true}>
                            <div style={{ minHeight: "50px" }} className="content" />
                        </Spin>
                    </Modal>

                </form>
            </div>
        </div>
    );
}
export default NewDiscountCode;