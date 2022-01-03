import { useEffect } from "react";
import { GameStatuses } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { startGame, pauseGame, increaseSecond } from "../redux/gameSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import makeClockFromSecond from "../utils/makeClockFromSecond";
import "./Panel.css";

function Panel() {
  const dispatch = useDispatch();
  const gameSecond = useSelector(({ game }) => game.second);
  const gameStatus = useSelector(({ game }) => game.status);
  const leftLoadsWeight = useSelector(({ game }) => game.leftLoadsWeight);
  const rightLoadsWeight = useSelector(({ game }) => game.rightLoadsWeight);
  const armAngle = useSelector(({ game }) => game.armAngle);

  useEffect(() => {
    if (gameStatus === GameStatuses.running) {
      window.gameSecondIncreaseInterval = setInterval(() => {
        dispatch(increaseSecond());
      }, 100);
    } else {
      clearInterval(window.gameSecondIncreaseInterval);
    }
  }, [dispatch, gameStatus]);

  const handleGameRunner = () => {
    if (gameStatus === GameStatuses.running) {
      dispatch(pauseGame());
    } else {
      dispatch(startGame());
    }
  };

  return (
    <div className="panel">
      <div className="section top">
        <div className="runner" onClick={handleGameRunner}>
          <FontAwesomeIcon
            icon={
              gameStatus === GameStatuses.running
                ? "stop-circle"
                : "play-circle"
            }
            size="lg"
          />
        </div>
        <div className="time">{makeClockFromSecond(gameSecond)}</div>
      </div>
      <div className="section bottom">
        <div className="load-info">
          <FontAwesomeIcon
            className="load-icon"
            icon="weight-hanging"
            size="3x"
          />
          <span className="load-info-text">{leftLoadsWeight} kg</span>
        </div>
        <div>{Math.round(armAngle)}°</div>
        <div className="load-info">
          <FontAwesomeIcon
            className="load-icon"
            icon="weight-hanging"
            size="3x"
          />
          <span className="load-info-text">{rightLoadsWeight} kg</span>
        </div>
      </div>
    </div>
  );
}

export default Panel;
