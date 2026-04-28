import Header from '../home/Header.jsx';
import "./Settings.css"
import React, { useEffect, useState } from "react";
import TextInputComponent from '../signup/TextInputComponent.jsx';
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_SOCKET_URL ;


let refreshPromise = null;

function Settings() {
    const navigate = useNavigate();

    async function refreshTokens() {
            if (!refreshPromise) {
                const refreshToken = localStorage.getItem("refreshToken");
    
                refreshPromise = fetch(API_URL + ":3000/api/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
                })
                .then(res => res.json())
                .finally(() => {
                    refreshPromise = null;
                });
            }
    
            return refreshPromise;
        }
    
    
        async function apiRequest(url,options={}) {
    
            let token = localStorage.getItem("accessToken");
            if (!token) {
                return null;
            }
    
            const decoded = jwtDecode(token);
    
            if (decoded.exp * 1000 < Date.now()) {
                const data = await refreshTokens();
    
                if (data.error || !data.accessToken || !data.refreshToken) {
                    console.log(data.error || "Refresh failed");
                    localStorage.clear();
                    return null;
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

        async function start() {
			const token = localStorage.getItem("accessToken");

			if (!token) {
			navigate("/LogIn");
			return;
			}

			await getLatestMsgs();
			await fetchUsername();
		}


    }, []);



    function handleLogOutClick(){
        async function logOutDatabase() {
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await fetch(API_URL+ ":3000"+ "/api/logout", {
                        method: "post",
                        headers: { 
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${refreshToken}`, 
                            },
            });
            const data = await res.json();
            if (data.error){
                    console.log(data.error);
            }
            if (data.success){
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                
                navigate("/Home");
            }


		}
		logOutDatabase();

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
                    <Link to="/Settings"
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