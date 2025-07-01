import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import './App.css';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/game" element={<Game/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
