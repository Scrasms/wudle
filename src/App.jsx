import { BrowserRouter, Routes, Route } from "react-router";
import Game from "./pages/game/Game";

function App() {

  return (
    <>
      <BrowserRouter basename="/wudle">
        <Routes>
          <Route path="/" element={<Game/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
