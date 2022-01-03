export default function randomInt(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}
