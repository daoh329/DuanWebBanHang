export function formatCapacity(capacity) {
  if (capacity >= 1024) {
    const roundedCapacity = Math.round(capacity / 1024);
    if (capacity % 1024 === 0) {
      return roundedCapacity + "TB";
    } else {
      return (capacity / 1024).toFixed(1) + "TB";
    }
  } else {
    return capacity + "GB";
  }
}
