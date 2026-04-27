import Header from '../home/Header.jsx';
import "./LogIn.css"
import React, { useState } from "react";
import TextInputComponent from '../signup/TextInputComponent.jsx';
import SignUpIcon from "../../assets/SignUpIcon.jsx";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_SOCKET_URL ;



function sendAccInfoLogIn(user,pass){
    
    return fetch(API_URL+ ":3000"+ "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ User: user, Password: pass }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken); 

        }
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken); 
            
        }
        window.location.replace("/Home");
        return data.message; // return message for whoever called this function
    })
    .catch(err => console.error(err));
      

};



function LogIn() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
  







    const handleClick = async (e) => {
        e.preventDefault();
        console.log("button clicked");

        const message = await sendAccInfoLogIn(user, pass);
        setResponseMessage(message);
    };

    return( 
        <>
        <Header/>
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
        <ul style={{margin: "60px 0", padding: 0, gap: 10, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <li>
            <TextInputComponent Text="Username:" value={user} onChange={setUser}></TextInputComponent>
        </li>
        <li>
            <TextInputComponent Text="Password:" value={pass}  onChange={setPass}></TextInputComponent>
        </li>
        <li>
            <div style={{margin: "30px 0"}}>
                <button style={{padding: 10, margin: "0 10px"}} onClick={handleClick}>
                Log In
                </button>
                
            </div>
        </li>
        <li>
            <p>{responseMessage}</p>

        </li>
        </ul>
        
        
        </>
        
    )
    }

    export default LogIn