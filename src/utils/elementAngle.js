export default function elementAngle(el) {
  if(!el) return
  const elTransform = window.getComputedStyle(el).transform;
  if (elTransform === "none") return 0;
  let values = elTransform.split("(")[1];
  values = values.split(")")[0];
  values = values.split(",");
  const a = values[0];
  const b = values[1];
  const scale = Math.sqrt(a * a + b * b);
  const sin = b / scale;
  return Math.asin(sin) * (180 / Math.PI);
}
