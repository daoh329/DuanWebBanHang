import { utcToZonedTime, format } from 'date-fns-tz';

export const formatColor = (color) => {
  switch (color.toLowerCase()) {
    case "yellow" || "gold":
      return "Vàng";
    case "red":
      return "Đỏ";
    case "green":
      return "Lục";
    case "blue":
      return "Xanh dương";
    case "black":
      return "Đen";
    case "white":
      return "Trắng";
    case "pink" || "rose":
      return "Hồng";
    case "gray":
      return "Xám";
    case "brown":
      return "Nâu";
    case "orange":
      return "Cam";
    case "purple":
      return "Tím";
    case "silver":
      return "Bạc";

    default:
      return color;
  }
};

export const formatDateToDate = (date) => {
  return format(
    utcToZonedTime(new Date(date), 'Etc/UTC'),
    "dd/MM/yyyy",
    { timeZone: 'Etc/UTC' }
  )
}
