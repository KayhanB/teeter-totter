export default function sumLoadsWeights(loads) {
  return loads.reduce((acc, curr) => {
    acc += curr.weight;
    return acc;
  }, 0);
}
