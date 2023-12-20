// soundUtils.js
import { Howl } from 'howler';

export const playNotificationSound = (soundFile) => {
  const sound = new Howl({
    src: [soundFile],
    volume: 0.5, // Điều chỉnh âm lượng theo nhu cầu
  });

  // Chạy âm thanh
  sound.play();
};
