import Header from '../home/Header.jsx';
import "./SingUp.css"

import TextInputComponent from './TextInputComponent.jsx';


function SignUp() {
  return( 
    <>
    <Header/>
    
    <ul style={{margin: "60px 0", padding: 0, gap: 10, display: "flex", flexDirection: "column", alignItems: "center"}}>
      <li>
          <TextInputComponent Text="Username:"></TextInputComponent>
      </li>
      <li>
          <TextInputComponent Text="Password:"></TextInputComponent>
      </li>
      <li>
        <div style={{margin: "30px 0"}}>
            <button style={{padding: 10, margin: "0 10px"}}>
              Log In
            </button>
            <button style={{padding: 10, margin: "0 10px"}}>
              Sign Up
            </button>
        </div>
      </li>
    </ul>
    
    
    </>
    
  )
}

export default SignUp
