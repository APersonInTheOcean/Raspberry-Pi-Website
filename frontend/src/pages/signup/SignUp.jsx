import Header from '../home/Header.jsx';
import "./SignUp.css"
import React, { useState } from "react";
import TextInputComponent from './TextInputComponent.jsx';
import SignUpIcon from "../../assets/SignUpIcon.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_SOCKET_URL ;




function SignUp() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");



  function sendAccInfoSignUp(user,pass,email){
    

    // Send data to Node.js backend
    return fetch(API_URL+ ":3000"+ "/signup", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // tell server it's JSON
      },
      body: JSON.stringify({ User: user, Password: pass, Email: email }), // the data we send
    })
      .then((res) => res.json())
      .then(data => {
        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken); 

        }
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken); 
            
        }
        if (data.accessToken && data.refreshToken) {
          navigate("/Home");
        }

        return data.message; // return message for whoever called this function
      })
      .catch((err) => console.error(err));

  };



  

  const handleClick = async () => {

    const message = await sendAccInfoSignUp(user, pass, email);
    setResponseMessage(message);
  };

  return( 
    <>
    <Header/>
    <Link to="/LogIn">
        <ul className ="horizontalUl" style={{justifyContent: "right",}}>
            <li style={{ padding: "5px 0", fontSize: 20, textAlign: "right" }}>
                
                <strong>Log In</strong>

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
          <TextInputComponent Text="Email:" value={email} onChange={setEmail}></TextInputComponent>

      </li>
      <li>
        <div style={{margin: "30px 0"}}>
            <button style={{padding: 10, margin: "0 10px"}} onClick={handleClick}>
              Sign Up
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

export default SignUp
