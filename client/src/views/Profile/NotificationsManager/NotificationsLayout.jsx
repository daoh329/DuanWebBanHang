import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton, Tag } from "antd";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { FileDoneOutlined, FileExcelOutlined } from "@ant-design/icons";
import axios from "axios";
import { updateNotification } from "../../../redux/notificationsSlice";

const count = 4;

function NotificationsLayout() {
  const data = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  //   const dataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;



  const handleReadAll = async () => {
    if (data.length === 0) return;

    try {
      const arrId = [];
      data.forEach((notification) => {
        if (notification.is_read === 0) {
          //Thêm id thông báo vào array
          arrId.push(notification.id);
        }
      });
      // return nếu không có thông báo nào chưa được đọc
      if (arrId.length === 0) return;

      const api = `${process.env.REACT_APP_API_URL}/auth/read-notifications`;
      // gọi api cập nhật trạng thái thông báo tại db
      const results = await axios.put(api, arrId);

      if (results.status === 200) {
        arrId.forEach((id) => {
          const data = {
            id,
            newStates: 1,
          };
          // Cập nhật trạng thái thông báo tại redux
          dispatch(updateNotification(data));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notifications-container">
      {/* title */}
      <div className="notifications-title">
        <p className="notifications-title-content">Thông báo của bạn</p>
        <p onClick={handleReadAll} className="notificatons-title-read-all">
          Đánh dấu tất cả đã đọc
        </p>
      </div>
      {/* content */}
      <List
        itemLayout="horizontal"
        dataSource={data}
        className="notifications-list"
        renderItem={(item) => (
          <List.Item id="notifications-list-item">
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "white" }}
                    size={64}
                    icon={
                        item.type === "Xác nhận đơn hàng" ?
                    <FileDoneOutlined style={{ color: "green" }} />
                    : <FileExcelOutlined style={{ color: "red" }} />
                }
                  />
                }
                title={
                  item.is_read === 0 ? (
                    <p className="notification-title">
                      {item.title} <Tag color="red">Chưa đọc</Tag>
                    </p>
                  ) : (
                    <p
                      className="notification-title"
                      style={{ color: "#A9A9A9" }}
                    >
                      {item.title}
                    </p>
                  )
                }
                description={
                  item.is_read === 0 ? (
                    <p
                      className="notification-description"
                      style={{ color: "black" }}
                    >
                      {item.content}
                    </p>
                  ) : (
                    <p
                      className="notification-description"
                      style={{ color: "#A9A9A9" }}
                    >
                      {item.content}
                    </p>
                  )
                }
              />
          </List.Item>
        )}
      />
    </div>
  );
}

export default NotificationsLayout;
