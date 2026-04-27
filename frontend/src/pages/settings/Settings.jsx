import Header from '../home/Header.jsx';
import "./Settings.css"
import React, { useEffect, useState } from "react";
import TextInputComponent from '../signup/TextInputComponent.jsx';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



function Settings() {
    const [isAccValid, setAccValid] = useState(false);
    async function apiRequest(url,options={}) {

            let token = localStorage.getItem("accessToken");

            const decoded = jwtDecode(token);

            if (decoded.exp * 1000 < Date.now()) {

                    const refreshToken = localStorage.getItem("refreshToken");

                    const res = await fetch("http://localhost:3000/api/refresh", {
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

        async function checkIfValidAccount() {
						
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await fetch("http://localhost:3000/api/refresh", {
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
            if(data.success){
                setAccValid(true);
            }


		}
		checkIfValidAccount();
        if(isAccValid){
            window.location.replace("/LogIn");

        }


    }, []);



    function handleLogOutClick(){
        async function checkIfValidAccount() {
                    
            const res = await apiRequest("http://localhost:3000/api/getforummessages", {
                        method: "GET"
            });
            const data = await res.json();
            if (data.error){
                    console.log(data.error);
            }
            console.log(data.messages)

            setMessages(
                data.messages
            );


		}
		checkIfValidAccount();
    }


    return(
        
        <>
        <div
            style={{
                position: "fixed",
                left: "0",
                zIndex: 101,
                width: "100%",
                backgroundColor: "#242424"
            }}
        >
            <ul style={{margin: 0, padding: 0, gap: 10, flex:1, flexDirection: "column", alignItems: "center"}}>
                <li>
                    <Header />

                </li>
                <li>
                    <Link to="/Forum"
                        style={{}}
                    >
                            <div style={{  }}>
                                <h1
                                    style={{
                                        textAlign: "center",
                                        fontSize: "18px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Account Settings
                                </h1>
                                <hr></hr>
                            </div>
                    </Link>
                </li>
            
            </ul>
            <ul style={{margin: "60px 0", padding: 0, gap: 10, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <button style={{padding: 10, margin: "0 10px"}} onClick={handleLogOutClick}>
                    Log out
                </button>
            
            </ul>
            
        </div>
        </>
        
    );
}
export default Settings