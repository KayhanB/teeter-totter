import { LoadTypes } from "../utils/constants";

function Load({ type, weight, color, height, width, posY, posX, rotate = 0 }) {
  const sharedStyle = {
    fontSize: height / 3.2,
    height,
    width,
    position: "absolute",
    top: posY,
    left: posX,
    fontWeight: 700,
    backgroundColor: color,
    transform: `rotate(${rotate}deg)`,
    textWrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
  };

  const loadStyles = {
    [LoadTypes.circle]: {
      ...sharedStyle,
      borderRadius: "50%",
    },
    [LoadTypes.rectangle]: {
      ...sharedStyle,
    },
    [LoadTypes.triangle]: {
      ...sharedStyle,
      backgroundColor: "transparent",
      borderTop: 0,
      borderLeft: `${sharedStyle.width / 2}px solid transparent`,
      borderRight: `${sharedStyle.width / 2}px solid transparent`,
      borderBottom: `${sharedStyle.height}px solid ${color}`,
      fontSize: sharedStyle.fontSize * 0.8,
      textWrapper: {
        ...sharedStyle.textWrapper,
        height: sharedStyle.height,
      },
    },
  };

  return (
    <div style={loadStyles[type]}>
      <div style={loadStyles[type].textWrapper}>
        <span>{weight} kg</span>
      </div>
    </div>
  );
}

export default Load;
