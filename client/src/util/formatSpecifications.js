export function formatSpecifications(value) {
  switch (value) {
    case "os":
      return "Hệ điều hành";
    case "cpu":
      return "CPU";
    case "ram":
      return "RAM";
    case "memoryStick":
      return "Thẻ nhớ";
    case "screenSize":
      return "Kích thước màn hình";
    case "screenResolution":
      return "Độ phân giải màn hình";
    case "screenTechnology":
      return "Công nghệ màn hình";
    case "mainCamera":
      return "Camera chính";
    case "frontCamera":
      return "Camera Selfie";
    case "pin":
      return "Pin";
    case "chargingTechnology":
      return "Công nghệ sạc";
    case "connector":
      return "Cổng kết nối";
    case "size":
      return "Kích thước";
    case "weight":
      return "Trọng lượng (Kg)";
    case "audioTechnology":
      return "Công nghệ âm thanh";
    case "loudspeaker":
      return "Loa";
    case "sensor":
      return "Cảm biến";
    case "networkConnections":
      return "Kết nối mạng";
    case "waterproof":
      return "Chống nước";
    case "dustproof":
      return "Chống bụi";
    case "accessory":
      return "Phụ kiện";
    case "operatingSystemVersion":
      return "Phiên bản hệ điều hành";
    case "NumberOfCPUCoresAndThreads":
      return "Số lượng nhân và luồng của CPU";
    case "CPUProcessingSpeed":
      return "Tốc độ xử lý của CPU";
    case "ramType":
      return "Loại RAM";
    case "graphicsCard":
      return "Card đồ họa";
    case "graphicsCardMemory":
      return "Bộ nhớ Card màn hình (VRAM)";
    case "batteryLife":
      return "Thời lượng pin";
    case "keyboard":
      return "Bàn phím";
    case "keyboardBacklight":
      return "Đèn nền bàn phím";
    case "touchpad":
      return "Bàn di chuột";
    case "webcam":
      return "Webcam";
    case "opticalDrive":
      return "Ổ đĩa quang";
    case "radiators":
      return "Tản nhiệt";
      case "romType":
      return "Loại ROM";
      case "spinSpeedRom":
      return "Tốc độ quay của ROM (Chỉ HDD)";
    default:
      return value;
  }
}
