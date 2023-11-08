export function formatCapacity(capacity) {
  if (capacity >= 1024) {
    return Math.round(capacity / 1024) + "TB";
  } else {
    return capacity + "GB";
  }
}
