import { useRef } from "react";
import Panel from "./Panel/Panel";
import LoadArea from "./LoadArea";
import Lever from "./Lever";
import Operator from "./Operator";
import { AppHeight } from "./utils/constants";
import "./App.css";

function App() {
  const armRef = useRef();
  return (
    <div className="App" style={{ height: AppHeight }}>
      <Panel />
      <LoadArea armRef={armRef} />
      <Lever armRef={armRef} />
      <Operator />
    </div>
  );
}

export default App;
