
export function confiStatusOrder(status) {
    if (status === 0) return "Chưa xác nhận";
    if (status === 1) return "Đã xác nhận";
    if (status === 2) return "Đã hủy";
    if (status === 3) return "Đang vận chuyển";
    if (status === 4) return "Đã giao thành công";
    if (status === 5) return "Giao không thành công";   
}