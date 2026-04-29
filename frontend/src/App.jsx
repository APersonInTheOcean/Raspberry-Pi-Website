import Home from './pages/home/Home.jsx';
import SignUp from './pages/signup/SignUp.jsx';
import LogIn from './pages/login/LogIn.jsx';
import Forum from './pages/forum/Forum.jsx';
import Game from './pages/game/Game.jsx';
import Settings from './pages/settings/Settings.jsx';
import GradeCalc from './pages/gradecalc/GradeCalc.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return( 
    
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Forum" element={<Forum />} />
        <Route path="/Game" element={<Game />} />
  <Route path="/GradeCalc" element={<GradeCalc />} />
      </Routes>

    </BrowserRouter>
    
  )
}

export default App
