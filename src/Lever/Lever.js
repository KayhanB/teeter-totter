import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameStatuses } from "../utils/constants";
import { setArmAngle, updateTargetArmAngle } from "../redux/gameSlice";
import elementAngle from "../utils/elementAngle";
import { LeverWidth } from "../utils/constants";
import "./Lever.css";

function Lever({ armRef }) {
  const dispatch = useDispatch();
  const armAngleChangeDuration = useSelector(
    ({ game }) => game.armAngleChangeDuration
  );
  const leftLoadsWeight = useSelector(({ game }) => game.leftLoadsWeight);
  const rightLoadsWeight = useSelector(({ game }) => game.rightLoadsWeight);
  const gameStatus = useSelector(({ game }) => game.status);
  const targetArmAngle = useSelector(({ game }) => game.targetArmAngle);

  useEffect(() => {
    dispatch(updateTargetArmAngle());
  }, [dispatch, leftLoadsWeight, rightLoadsWeight]);

  useEffect(() => {
    if (window.armAngleUpdateInterval)
      clearInterval(window.armAngleUpdateInterval);
    if (gameStatus === GameStatuses.running) {
      const currentAngle = elementAngle(armRef.current);
      if (currentAngle !== targetArmAngle) {
        const intervalTime =
          (armAngleChangeDuration * 1000) / targetArmAngle - currentAngle;

        window.armAngleUpdateInterval = setInterval(() => {
          const currentAngle = elementAngle(armRef.current);
          dispatch(setArmAngle(currentAngle));
          if (currentAngle === targetArmAngle) {
            clearInterval(window.armAngleUpdateInterval);
          }
        }, intervalTime);
      }
    } else {
      clearInterval(window.armAngleUpdateInterval);
    }
  }, [dispatch, armAngleChangeDuration, gameStatus, targetArmAngle, armRef]);

  useEffect(() => {
    if (gameStatus === GameStatuses.paused) {
      const currentAngle = elementAngle(armRef.current);
      const armStyle = armRef.current.style;
      armStyle.transform = `rotate(${currentAngle}deg)`;
    }
  }, [armRef, gameStatus]);

  useEffect(() => {
    if (gameStatus === GameStatuses.ended) {
      const armStyle = armRef.current.style;
      armStyle.transform = `rotate(0deg)`;
      armStyle.transitionDuration = `0s`;
    }
  }, [armRef, gameStatus]);

  useEffect(() => {
    if (gameStatus === GameStatuses.running) {
      const armStyle = armRef.current.style;
      armStyle.transform = `rotate(${targetArmAngle}deg)`;
      armStyle.transitionDuration = `${armAngleChangeDuration}s`;
    }
  }, [armRef, gameStatus, targetArmAngle, armAngleChangeDuration]);

  return (
    <div className="lever" style={{ width: LeverWidth }}>
      <div ref={armRef} className="arm" />
      <div className="fulcrum" />
    </div>
  );
}

export default Lever;
