
import SignUpIcon from "./SignUpIcon";
import { Link } from "react-router-dom";

function TopBox(){
    const user = false;
    const username = "BadBunny";

    return (
        <ul className ="horizontalUl" style={{ justifyContent: "space-between"}}>
            <li>
                <ul className ="horizontalUl" 
                        style={{
                            gap: "20px",
                            width: "200px"}} >
                        <li>
                            <Link to="/Forum">
                            Forum
                            </Link>
                        </li>
                        <li> <Link to="/Game">
                            Game
                            </Link>
                        </li>

                    </ul>
            </li>
            <li>
                {
                    user ? (
                    <Link to="/Settings">
                        <ul className ="horizontalUl" style={{justifyContent: "right",}}>
                            <li style={{ padding: "5px 0", fontSize: 20, textAlign: "right" }}>
                                
                                <strong>{username}</strong>

                            </li>
                            
                            <li style={{ padding: "0 10px" }}>
                                
                                    <div className="signUpIconBackground"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignContent: "center",
                                        allignItems: "center"
                                    }}>
                                        
                                        


                                    </div>
                                

                            </li>

                        </ul>
                    </Link>
                    ):(
                       <Link to="/SignUp">
                        <ul className ="horizontalUl" style={{justifyContent: "right",}}>
                            <li style={{ padding: "5px 0", fontSize: 20, textAlign: "right" }}>
                                
                                <strong>Sign Up</strong>

                            </li>
                            
                            <li style={{ padding: "0 10px" }}>
                                
                                    <div className="signUpIconBackground"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignContent: "center",
                                        allignItems: "center"
                                    }}>
                                        
                                        <SignUpIcon/>


                                    </div>
                                

                            </li>

                        </ul>
                    </Link> 
                    )

                    
                }
                
            </li>
        </ul>
       
        
    );
}
export default TopBox
