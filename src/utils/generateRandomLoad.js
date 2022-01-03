import {
  LoadColors,
  LoadTypes,
  MaxLoadWeight,
  MinLoadWeight,
} from "./constants";
import randomInt from "./randomInt";
import uniqId from "./uniqId";

const scale = 22;

const edgesByArea = (area) => {
  const edgeSize = Math.sqrt(area) * scale;
  return {
    height: edgeSize,
    width: edgeSize,
  };
};

export default function generateRandomLoad() {
  const loadTypes = Object.keys(LoadTypes).map((type) => type);
  const weight = randomInt(MinLoadWeight, MaxLoadWeight);
  const type = LoadTypes[loadTypes[randomInt(0, loadTypes.length - 1)]];
  const color = LoadColors[randomInt(0, LoadColors.length - 1)];
  let { height, width } = edgesByArea(weight);

  if (type === LoadTypes.rectangle) {
    width = width * 0.8;
    height = width * 1.2;
  }

  return {
    id: uniqId(),
    type,
    weight,
    color,
    height,
    width,
  };
}
