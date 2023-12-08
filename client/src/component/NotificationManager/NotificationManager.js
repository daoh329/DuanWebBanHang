import axios from "axios";

async function CreateNotification(user_id, order_id, type, title, content) {
  try {
    if (!user_id) throw new Error("Thiếu id người dùng");
    if (!order_id) throw new Error("Thiếu id đơn hàng");
    if (!type) throw new Error("Thiếu loại thông báo");
    if (!title) throw new Error("Thiếu tiêu đề thông báo");
    if (!content) throw new Error("Thiếu nội dung thông báo");
    const data = {
      user_id,
      order_id,
      type,
      title,
      content,
    };
    const api = `${process.env.REACT_APP_API_URL}/auth/create-notification`;
    const results = await axios.post(api, data, {withCredentials: true});

    if (results.status !== 200) {
      throw new Error("Lỗi tạo thông báo");
    }
  } catch (error) {
    console.log(error);
  }
}



export { CreateNotification };
