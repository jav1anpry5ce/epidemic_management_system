export default function toLocaldate(date) {
  return String(new Date(date).toGMTString()).substr(
    0,
    new Date(date).toGMTString().length - 13
  );
}
