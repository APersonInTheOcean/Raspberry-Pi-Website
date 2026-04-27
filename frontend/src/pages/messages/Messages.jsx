import Header from '../home/Header.jsx';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Messages() {

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  
  function addConversationBox(conversation_id,name,members,) {
    setConversations([
      ...conversations,
      { conversation_id: conversation_id, members:members}
    ]);
  }

  function addMsgBox(message,sender_id,datetime) {
    setMessages([
      ...messages,
      { message: message, sender_id:sender_id,datetime:datetime}
    ]);
  }
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

      // async function fetchConversations() {
          
      //     const Username = await apiRequest('http://localhost:3000/api/users/getmyconversations', {
      //         METHOD: "GET",
      //         headers: { 
      //             "Content-Type": "application/json",
      //         },
      //         })
      //         .then((res) => res.json())
      //         .then((data) => data.username);

      //     setConversations(Username)


      // }
      // fetchConversations();
  }, []);









  return( 
    <>
        <Header/>

            <Link to="/Forum">
            <div style={{  }}>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >
                Conversations
              </h1>
              <hr></hr>
            </div>
          </Link>


        </>
    
  )
}

export default Messages
