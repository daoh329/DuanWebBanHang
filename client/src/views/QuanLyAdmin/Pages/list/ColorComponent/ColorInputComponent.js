import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Select,
    notification,
} from "antd";
import axios from "axios";

function FormInputColor({ name,onUpdated }) {
    const [ol, setol] = useState('')
    // function select element
    const [isLoading, setIsLoading] = useState(false);
 
    useEffect(() => {
        setol(name)
    }, []);

    const onFinish = async (values) => {
        setIsLoading(true);

        try {
            const result = await axios.put(
                `${process.env.REACT_APP_API_URL}/List/update/color`,
                [values.name, ol], {withCredentials: true}
            );

            if (result.status === 200) {
                setTimeout(() => {
                    setIsLoading(false);
                    notification.success({
                        message: "Cập nhật thành công!",
                    });
                }, 2000);

                onUpdated();
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    notification.error({
                        message: "Cập nhật thất bại!",
                    });
                }, 2000);
            }
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
    };

    return (
        <Form
            style={{ maxWidth: 800, textAlign: "start" }}
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <hr />
            <h6 style={{ margin: "20px 0 10px 0" }}>Sửa Màu</h6>
            {/* Màu */}
            <Form.Item
                hasFeedback
                validateDebounce={1000}
                label="Màu"
                name="name"
            >
                <Input placeholder="nhập Màu" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Xác nhận
                </Button>
            </Form.Item>
        </Form>
    );
}

export default FormInputColor ;