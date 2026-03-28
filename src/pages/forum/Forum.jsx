import Header from '../home/Header.jsx';

import { Link } from "react-router-dom";

function Forum() {
  return( 
    <>
        <Header/>

            <Link to="/Forum">
            <div style={{border: 1}} >
                    <hr></hr>

                    <h1 style={{textAlign: "center"}}>Forum </h1>
                    
                    <hr></hr>

            </div>
            </Link>


        </>
    
  )
}

export default Forum
