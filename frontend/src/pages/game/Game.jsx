import Header from '../home/Header.jsx';
import { Link } from "react-router-dom";

function Game() {
  return( 
    <>
      <Header/>
            <Link to="/Game">
            <header style={{border: 1}} >
                    <hr></hr>

                    <h1 style={{textAlign: "center"}}>Game </h1>
                    
                    <hr></hr>

            </header>
            </Link>


        </>
    
  )
}

export default Game
