import "./Header.css"
import { Link } from "react-router-dom";



function Header(){
    return (
        <>
            <Link to="/">
            <header style={{border: 1}} >
                    <hr></hr>

                    <h1 style={{textAlign: "center"}}>QSY.com </h1>
                    
                    <hr></hr>

            </header>
            </Link>


        </>
        
    );
}

export default Header
