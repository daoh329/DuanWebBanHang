
import { Modal, Button } from "antd";

const {info} = Modal;

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

export const openInfoModalNotPermission = () => {
  info({
    title: "Thông báo",
    content: "Bạn không có quyền thực hiện hành động này",
    footer: (
      <div style={{display:'flex', justifyContent: "center", alignItems: "center"}}>
        <Button
        onClick={() => window.location.reload()}
        style={{ borderRadius: "2px", margin: "20px 0 0 0"}}
        type="primary"
      >
        Đóng
      </Button>
      </div>
      
    ),
  });
};