import { useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GameStatuses, LoadGenerationRange } from "../utils/constants";
import {
  addLeftLoad,
  addRightLoad,
  applyUserMove,
  updateLoads,
  increaseLoadDropInterval,
} from "../redux/gameSlice";
import elementAngle from "../utils/elementAngle";
import Load from "../Load";
import { LeverWidth } from "../utils/constants";
import randomInt from "../utils/randomInt";
import generateRandomLoad from "../utils/generateRandomLoad";
import "./LoadArea.css";

function LoadArea({ armRef }) {
  const dispatch = useDispatch();
  const loadDropInterval = useSelector(({ game }) => game.loadDropInterval);
  const gameSecond = useSelector(({ game }) => game.second);
  const gameStatus = useSelector(({ game }) => game.status);
  const leftLoads = useSelector(({ game }) => game.leftLoads);
  const rightLoads = useSelector(({ game }) => game.rightLoads);
  const loadAreaRef = useRef();

  const handleUserKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (key === "ArrowLeft") {
        dispatch(applyUserMove("left"));
      }
      if (key === "ArrowRight") {
        dispatch(applyUserMove("right"));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (gameStatus === GameStatuses.running) {
      window.addEventListener("keydown", handleUserKeyPress);
    } else {
      window.removeEventListener("keydown", handleUserKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress, gameStatus]);

  useEffect(() => {
    if (window.dropLoadsInterval) clearInterval(window.dropLoadsInterval);
    if (gameStatus === GameStatuses.running) {
      window.dropLoadsInterval = setInterval(() => {
        dispatch(
          updateLoads({
            loadAreaBottom: loadAreaRef.current.clientHeight,
            armAngle: elementAngle(armRef.current),
          })
        );
      }, loadDropInterval);
    } else {
      clearInterval(window.dropLoadsInterval);
    }
  }, [dispatch, armRef, gameStatus, loadDropInterval]);

  useEffect(() => {
    const addLoad = () => {
      const randomLoad = generateRandomLoad();
      const initialPosX = randomInt(50, LeverWidth / 2 - 50);
      const initialPosY = 0;
      dispatch(
        addLeftLoad({
          ...randomLoad,
          posX: initialPosX,
          posY: initialPosY,
          isTouchedDown: false,
        })
      );
    };
    if (
      gameStatus === GameStatuses.running &&
      gameSecond % LoadGenerationRange === 0
    ) {
      addLoad();
      dispatch(increaseLoadDropInterval());
    }
  }, [dispatch, loadAreaRef, gameStatus, gameSecond]);

  useEffect(() => {
    const addLoad = () => {
      const randomLoad = generateRandomLoad();
      const initialPosX = randomInt(50, LeverWidth / 2 - 50);
      const initialPosY = -randomLoad.height + loadAreaRef.current.clientHeight;
      dispatch(
        addRightLoad({
          ...randomLoad,
          posX: initialPosX,
          posY: initialPosY,
          isTouchedDown: true,
        })
      );
    };
    if (
      gameStatus === GameStatuses.running &&
      gameSecond % LoadGenerationRange === 0
    ) {
      addLoad();
    }
  }, [dispatch, gameStatus, gameSecond]);

  const LeftLoads = useMemo(() => {
    return leftLoads.map((load) => <Load key={load.id} {...load} />);
  }, [leftLoads]);

  const RightLoads = useMemo(() => {
    return rightLoads.map((load) => <Load key={load.id} {...load} />);
  }, [rightLoads]);

  return (
    <div className="load-area" ref={loadAreaRef}>
      <div className="left">{LeftLoads}</div>
      <div className="right">{RightLoads}</div>
    </div>
  );
}

export default LoadArea;
