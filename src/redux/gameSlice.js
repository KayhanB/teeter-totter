import { createSlice } from "@reduxjs/toolkit";
import { Difficulty, GameStatuses, LeverWidth } from "../utils/constants";
import sumLoadsWeights from "../utils/sumLoadsWeights";

const initialState = {
  second: 0,
  status: GameStatuses.waiting,
  leftLoads: [],
  leftLoadsWeight: 0,
  rightLoads: [],
  rightLoadsWeight: 0,
  loadDropInterval: 20,
  armAngleChangeDuration: 5,
  armAngle: 0,
  targetArmAngle: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    increaseSecond: (state) => {
      state.second = parseFloat((state.second + 0.1).toFixed(2));
    },
    startGame: (state) => {
      state.status = GameStatuses.running;
    },
    pauseGame: (state) => {
      state.status = GameStatuses.paused;
    },
    resetGame: () => {
      return { ...initialState, status: GameStatuses.running };
    },
    endGame: (state) => {
      state.status = GameStatuses.ended;
    },
    addRightLoad: (state, action) => {
      state.rightLoads.push(action.payload);
    },
    addLeftLoad: (state, action) => {
      state.leftLoads.push(action.payload);
    },
    updateLoads: (state, action) => {
      const armLength = LeverWidth / 2;
      const armAngle = action.payload.armAngle;
      const loadAreaBottom = action.payload.loadAreaBottom;

      const leftLoads = state.leftLoads.map((load, i) => {
        const loadArmLength = armLength - load.posX;
        const targetPosY =
          loadAreaBottom -
          load.height -
          loadArmLength * Math.sin(armAngle * (Math.PI / 180));

        if (load.posY < targetPosY) {
          load.posY += 1;
          // load.isTouchedDown = false; // kutular kola deydikten sonra kol açısının aşağı yönde değişim hızı kutuların düşüş hızından fazla olduğunda tekrar düşen kutuların kontrol edilebilmesini sağlıyor
          return load;
        }
        const targetPosX =
          load.posX +
          Math.tan(armAngle * (Math.PI / 180)) / (loadAreaBottom - targetPosY);

        load.posX = targetPosX;
        load.posY = targetPosY;
        load.rotate = armAngle;
        load.isTouchedDown = true;
        return load;
      });
      state.leftLoads = leftLoads;
      state.leftLoadsWeight = sumLoadsWeights(
        leftLoads.filter((load) => load.isTouchedDown)
      );
      // ################################################
      const rightLoads = state.rightLoads.map((load, i) => {
        const loadArmLength = armLength - (armLength - load.posX - load.width);
        const targetPosY =
          loadAreaBottom -
          load.height +
          loadArmLength * Math.sin(armAngle * (Math.PI / 180));
        load.posY = targetPosY;
        load.rotate = armAngle;

        const targetPosX =
          load.posX +
          Math.tan(armAngle * (Math.PI / 180)) / (loadAreaBottom - targetPosY);
        load.posX = targetPosX;
        return load;
      });

      state.rightLoads = rightLoads;
      state.rightLoadsWeight = sumLoadsWeights(rightLoads);
    },
    applyUserMove: (state, action) => {
      const armLength = LeverWidth / 2;
      const movementSize = 10;
      state.leftLoads = state.leftLoads.map((load, i) => {
        if (!load.isTouchedDown) {
          if (action.payload === "left" && load.posX >= movementSize) {
            load.posX -= movementSize;
          }
          if (
            action.payload === "right" &&
            load.posX < armLength - load.width
          ) {
            load.posX += movementSize;
          }
          return { ...load };
        }
        return load;
      });
    },
    increaseLoadDropInterval: (state) => {
      if (state.loadDropInterval) {
        const loadDropDifficulty = Difficulty;
        state.loadDropInterval -= loadDropDifficulty;
      }
    },
    updateTargetArmAngle: (state) => {
      const armLength = LeverWidth / 2;

      const leftArmTorque = state.leftLoads.reduce((acc, curr) => {
        if (curr.isTouchedDown) {
          acc +=
            (armLength - curr.posX) *
            curr.weight *
            Math.sin(90 * (Math.PI / 180));
        }
        return acc;
      }, 0);

      const rightArmTorque = state.rightLoads.reduce((acc, curr) => {
        if (curr.isTouchedDown) {
          acc +=
            (armLength - curr.posX) *
            curr.weight *
            Math.sin(90 * (Math.PI / 180));
        }
        return acc;
      }, 0);
      const torqueDifficulty = 100 / Difficulty;
      state.targetArmAngle =
        (rightArmTorque - leftArmTorque) / torqueDifficulty;
    },
    setArmAngle: (state, action) => {
      state.armAngle = action.payload;
    },
  },
});

export const {
  setArmAngle,
  addRightLoad,
  addLeftLoad,
  increaseSecond,
  startGame,
  pauseGame,
  resetGame,
  updateLoadsPositions,
  applyUserMove,
  updateLoads,
  updateTargetArmAngle,
  increaseLoadDropInterval,
  endGame,
} = gameSlice.actions;

export default gameSlice.reducer;
