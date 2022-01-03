import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endGame, resetGame, startGame } from "../redux/gameSlice";
import { GameStatuses, MaxArmAngle } from "../utils/constants";
import "./Operator.css";

function Operator(params) {
  const dispatch = useDispatch();
  const gameStatus = useSelector(({ game }) => game.status);
  const armAngle = useSelector(({ game }) => game.armAngle);
  const isGameOver = armAngle >= MaxArmAngle || armAngle <= -MaxArmAngle;
  useEffect(() => {
    if (isGameOver) {
      dispatch(endGame());
    }
  }, [dispatch, isGameOver]);

  const GameOver = useMemo(() => {
    return (
      <>
        <h1 className="title game-over-title">Game Over</h1>
        <button
          className="button restart-button"
          onClick={() => dispatch(resetGame())}
        >
          Restart
        </button>
      </>
    );
  }, [dispatch]);

  const GamePaused = useMemo(() => {
    return (
      <>
        <h1 className="title">Game Paused</h1>
        <button
          className="button continue-button"
          onClick={() => dispatch(startGame())}
        >
          Continue
        </button>
      </>
    );
  }, [dispatch]);

  const StartGame = useMemo(() => {
    return (
      <>
        <h1 className="title game-start-message">
          Your task is balance to teeter totter
        </h1>
        <h5 className="subtitle">
          If you exceed the maximum angle of {MaxArmAngle} degrees, it's game
          over.
        </h5>
        <button
          className="button start-button"
          onClick={() => dispatch(startGame())}
        >
          Start Game
        </button>
      </>
    );
  }, [dispatch]);

  if (gameStatus === GameStatuses.ended && isGameOver) {
    return (
      <div className="operator">
        <div className="content">{GameOver}</div>
      </div>
    );
  }

  if (gameStatus === GameStatuses.paused) {
    return (
      <div className="pause-operator">
        <div className="content game-paused-content">{GamePaused}</div>
      </div>
    );
  }

  if (gameStatus === GameStatuses.waiting) {
    return (
      <div className="operator">
        <div className="content">{StartGame}</div>
      </div>
    );
  }
  return null;
}

export default Operator;
