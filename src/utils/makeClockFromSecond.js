export default function makeClockFromSecond(second) {
  second = parseInt(second);
  let s = second % 60;
  let m = (second - s) / 60;
  m = m < 10 ? `0${m}` : `${m}`;
  s = s < 10 ? `0${s}` : `${s}`;
  return `${m}:${s}`;
}
