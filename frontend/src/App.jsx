import Home from '../../src/pages/home/Home.jsx';
import SignUp from '../../src/pages/signup/SignUp.jsx';
import Forum from '../../src/pages/forum/Forum.jsx';
import Game from '../../src/pages/game/Game.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

const user = true;

  return( 
    
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Forum" element={<Forum />} />
        <Route path="/Game" element={<Game />} />

      </Routes>

    </BrowserRouter>
    
  )
}

export default App
