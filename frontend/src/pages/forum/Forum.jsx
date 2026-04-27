import Header from '../home/Header.jsx';
import { useRef,useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import "./Forum.css"
const API_URL = import.meta.env.VITE_SOCKET_URL ;

const socket = io(API_URL+ ":3000");



function Forum() {
	const bottomRef = useRef(null);



	const [sendMsgBoxText, setSendMsgBoxText] = useState("");
	const [username, setUsername] = useState("");
	const [messages, setMessages] = useState([]);
	const [isAccValid, setAccValid] = useState(false);
	
 

	function addMsgBox(id,message,sender_name,datetime) {
		setMessages([
			...messages,
			{id:id, message_text: message, sender_name:sender_name,sent_at:datetime}
		]);
	}
	async function apiRequest(url,options={}) {

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
	async function getLatestMsgs() {

			const res = await apiRequest(API_URL+ ":3000"+ "/api/getforummessages", {
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
	async function sendForumMsg(text) {

			const res = await apiRequest(API_URL+ ":3000"+ "/api/sendforummessage", {
					method: "Post",
					headers: {
      					"Content-Type": "application/json"
    				},
					body: JSON.stringify({ message:text}),
			});
			const data = await res.json();
			if (data.error){
					console.log(data.error);
			}
			console.log(data.message)
			


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
			else{
            	const navigate = useNavigate();
                navigate("/LogIn");

			}


		}
		checkIfValidAccount();



		function receiveMessage(msg) {
			console.log(msg);

			setMessages(prev => [
			...prev,
			{
				id: msg.id,
				message_text: msg.message_text,
				sender_name: msg.sender_name,
				sent_at: msg.sent_at
			}
			]);
		}

		socket.on("forum_receive_message", receiveMessage);

		
		
		async function loadMessages() {
			await getLatestMsgs();
		}
		loadMessages();

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
		



		


		
		return () => {
			socket.off("forum_receive_message", receiveMessage);
		};
	}, []);


	function handleClick(){
		console.log("buttonclicked");
		if(sendMsgBoxText.length<=0){
			return;
		}
		sendForumMsg(sendMsgBoxText)
		setSendMsgBoxText("")


	}



	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth"
		});
	}, [messages]);


	return( 
		<div
			style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column"
			}}
		>
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
											Forum
										</h1>
										<hr></hr>
									</div>
							</Link>
						</li>
					
					</ul>
					
				</div>

				



				<ul className ="msginputbox" 
					style={{
						position: "fixed",
						left: 0,
						bottom: 0,
						zIndex: 100,
						width: "100%",
						margin: 0,
						padding: "10px",
						listStyle: "none",
						boxSizing: "border-box",
						display: "flex",
						justifyContent: "center"

					}}>
								<li style={{ margin: "0% 10% 0 10% ",width: "100%" }} >
										<input className="msginput" value={sendMsgBoxText} onChange={(e) => setSendMsgBoxText(e.target.value)}  id="text" placeholder="Type here..." style={{ width: "100%", lineHeight: "25px" , boxSizing: "border-box"}}></input>

								</li>
								<li>
										<button className="sendmsgbutton" onClick={handleClick} style={{
										
										}}>
											<svg className="sendIcon" viewBox="570 257 32 32">
												<path
													fill="currentColor"
													d="M580.407,278.75 C581.743,281.205 586,289 586,289 C586,289 601.75,258.5 602,258 L602.02,257.91 L580.407,278.75 Z M570,272 C570,272 577.298,276.381 579.345,277.597 L601,257 C598.536,258.194 570,272 570,272 Z"
												/>
											</svg>
										</button>
								</li>
								

				</ul>  
			 



				<ul style={{flex:1,margin: "60px 0 0 0", padding: 0, gap: 10, display: "flex", flexDirection: "column",justifyContent: "flex-end"}}>
					
					<li>
							<ul  
							style={{
								display:"flex",
								flexDirection:"column",
								gap:"10px",
								padding:0,
								marginBottom: "50px",
								listStyle:"none"

							}}>
								{messages.map(msg => (
									<li
										key={msg.id}
										style={{
											display:"flex",
											alignItems:"flex-start",
											gap:"10px"
										}}
									>
										<div
											className="signUpIconBackground"
											style={{
												width:"35px",
												height:"35px",
												borderRadius:"50%",
												flexShrink:0
											}}
										>
											<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
												<path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> 
												<path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> 
											</svg>
										</div>

										<div
											style={{
												display:"flex",
												flexDirection:"column",
												gap:"2px"
											}}
										>
											<p style={{margin:0,fontWeight:"bold"}}>
												{msg.sender_name}
											</p>

											<p style={{margin:0}}>
												{msg.message_text}
											</p>
										</div>

									</li>
								))}
								<div ref={bottomRef}></div>

						</ul>
					</li>
				</ul>
					


		</div>
		
	)
}

export default Forum
