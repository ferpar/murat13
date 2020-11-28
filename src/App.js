import React, { useState } from "react";
import BrushChart from "./Brushchart";
import "./App.css";

const initialData = [10, 25, 30, 40, 25, 60] 
function App() {
  const [data, setData] = useState(initialData)

  return (
    <React.Fragment>
      <h2>Sub-selection with d3-brush</h2>
      <BrushChart data={data}/>
    </React.Fragment>
  );
}

export default App;
