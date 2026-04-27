
import SignUpIcon from "../../assets/SignUpIcon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";


function TopBox(){
    const [username, setUsername] = useState("");

    async function apiRequest(url,options={}) {
            console.log("hey");

        let token = localStorage.getItem("accessToken");

        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {

            const refreshToken = localStorage.getItem("refreshToken");

            const res = await fetch(API_URL+ ":3000"+ "/api/refresh", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`, 
                },
            });
            const data = await res.json();
            if (data.error){
                console.log(data.error);
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            token = data.accessToken;

        }

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };

        return fetch(url, options);


    }

    useEffect(() => {

        async function fetchUsername() {
            
            const Username = await apiRequest(API_URL+ ":3000"+ "/api/users/getmyusername", {
                METHOD: "GET",
                headers: { 
                    "Content-Type": "application/json",
                },
                })
                .then((res) => res.json())
                .then((data) => data.username);

            setUsername(Username)


        }
        fetchUsername();
    }, []);
        




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
                        <li>
                            
                        </li>

                    </ul>
            </li>
            <li>
                {
                    
                    username ? (

                        //if username exists ...

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
                                        alignItems: "center"
                                    }}>
                                        
                                        


                                    </div>
                                

                            </li>

                        </ul>
                    </Link>
                    ):
                    
                        //else ...
                    
                    (
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
                    )

                    
                }
                
            </li>
        </ul>
       
        
    );
}
export default TopBox
