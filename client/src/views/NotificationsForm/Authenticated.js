
import { Modal, Button } from "antd";

export const NotificationBeenLoggedOut = () => {
    Modal.warning({
      title: "Bạn chưa đăng nhập",
      content: "Vui lòng đăng nhập để tiếp tục!",
      footer: (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            display: "flex",
            justifyContent: "right",
          }}
        >
          {/* <Button onClick={() => window.location.href = "/"} style={{ marginRight: "10px" }}>
            Về trang chủ
          </Button> */}
          <Button
            type="primary"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập
          </Button>
        </div>
      ),
    });
};