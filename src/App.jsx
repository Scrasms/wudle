import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import Game from "./pages/game/Game";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game/>}/>
          {/* <Route path="/game" element={<Home/>}/> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
