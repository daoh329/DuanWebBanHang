import React, { useState } from "react";
import "./Profile.css";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol,
  MDBIcons,
} from "mdb-react-ui-kit";
import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";

//hỗ trợ icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faClipboardList,faBell } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function Profile() {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  const [verticalActive, setVerticalActive] = useState("tab1");

  const handleVerticalClick = (value: String) => {
    if (value === verticalActive) {
      return;
    }

    setVerticalActive(value);
  };

  const [iconsActive, setIconsActive] = useState('tab1');

  const handleIconsClick = (value: string) => {
    if (value === iconsActive) {
      return;
    }

    setIconsActive(value);
  };
  return (
    <>
      <MDBRow>
        <MDBCol size="3">
          <MDBTabs className="flex-column text-center">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab1")}
                active={verticalActive === "tab1"}
              >
                <FontAwesomeIcon icon={faUser} /> Cá nhân
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab2")}
                active={verticalActive === "tab2"}
              >
                <FontAwesomeIcon icon={faClipboardList} /> Quản lý đơn hàng
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleVerticalClick("tab3")}
                active={verticalActive === "tab3"}
              >
                  <FontAwesomeIcon icon={faBell} /> Thông báo
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>
        <MDBCol size="9">
          <MDBTabsContent>
            <MDBTabsPane show={verticalActive === "tab1"}>
              {/*  */}
              <div className="css-gjf6g1 snipcss-NrJii">
                <div className="css-z54kij">
                  <div className="css-hveu7a">
                    <div
                      className="teko-row css-1o3gs9x style-QHQSn"
                      id="style-QHQSn"
                    >
                      <div
                        className="teko-col teko-col-8 css-gr7r8o style-rBeFA"
                        id="style-rBeFA"
                      >
                        <div className="teko-card css-jjszbd">
                          <div className="teko-card-body css-0">
                            <div
                              className="teko-row teko-row-space-between css-1o3gs9x"
                              data-allytip="true"
                              style={{}}
                            >
                              <div type="title" className="css-vdbely">
                                Thông tin tài khoản
                              </div>
                            </div>

                            <Form
                              {...formItemLayout}
                              form={form}
                              name="register"
                              onFinish={onFinish}
                              initialValues={{ prefix: "84" }}
                              style={{ maxWidth: 600 }}
                            >
                              <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                  {
                                    type: "email",
                                    message:
                                      "Định dạng E-mail không chính xác!",
                                  },
                                  {
                                    required: true,
                                    message: "Vui lòng nhập E-mail!",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>

                              {/* name */}
                              <Form.Item
                                name="nickname"
                                label="Tên người dùng"
                                tooltip="Bạn muốn chúng tôi gọi bạn như thế nào."
                              >
                                <Input />
                              </Form.Item>

                              {/* phone */}
                              <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập số điện thoại!",
                                  },
                                ]}
                              >
                                <Input
                                  addonBefore={prefixSelector}
                                  style={{
                                    width: "100%",
                                  }}
                                />
                              </Form.Item>
                              {/* Thành phố */}
                              <Form.Item name="TP" label="Thành Phố">
                                <Input />
                              </Form.Item>
                              {/* Huyện */}
                              <Form.Item name="HUYEN" label="Huyện">
                                <Input />
                              </Form.Item>
                              {/* Xã */}
                              <Form.Item name="XA" label="Xã">
                                <Input />
                              </Form.Item>
                              {/* capcha */}
                              <Form.Item
                                label="Captcha"
                                extra="Chúng tôi phải chắc chắn bạn là con người."
                              >
                                <Row gutter={8}>
                                  <Col span={12}>
                                    <Form.Item
                                      name="captcha"
                                      noStyle
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập captcha bất kì!",
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Button>Get captcha</Button>
                                  </Col>
                                </Row>
                              </Form.Item>

                              <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                  Cập nhật
                                </Button>
                              </Form.Item>
                            </Form>
                            {/*  */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*  */}
            </MDBTabsPane>

            <MDBTabsPane className="tab-2" show={verticalActive === "tab2"}>
            <h6 style={{display:'flex'}}>Quản lý đơn hàng</h6>
          <MDBTabs className='mb-3'>
          
        <MDBTabsItem>
           
          <MDBTabsLink onClick={() => handleIconsClick('tab1')} active={iconsActive === 'tab1'}>
            
          Chờ xử lý
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleIconsClick('tab2')} active={iconsActive === 'tab2'}>
           Đã xác nhận
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleIconsClick('tab3')} active={iconsActive === 'tab3'}>
          Đã hoàn thành
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={iconsActive === 'tab1'}>Tab 1 content</MDBTabsPane>
        <MDBTabsPane show={iconsActive === 'tab2'}>Tab 2 content</MDBTabsPane>
        <MDBTabsPane show={iconsActive === 'tab3'}>Tab 3 content</MDBTabsPane>
      </MDBTabsContent>




            </MDBTabsPane>

            <MDBTabsPane show={verticalActive === "tab3"}>
            <h6 style={{display:'flex'}}>Thông báo dành cho bạn</h6>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </>
  );
}
