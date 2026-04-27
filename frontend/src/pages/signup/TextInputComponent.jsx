import { useState } from 'react';
import "./TextInputComponent.css"

function TextInputComponent({ Text, value, onChange }) {
  
  return (
      <div style={{
            display: "flex",
            justifyContent: "left",
            
          }}>

        <label htmlFor="simple-text-input" style={{padding: "0 10px"}}>{Text}</label>
        <ul style={{padding: 0, margin: 0}}>
          <li style={{padding: 0, margin: 0}}>
              <input
                className="acc-cred-input"
                type="text"
                id="simple-text-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type here..."
                style={{width: "100%",boxSizing: "border-box"}}
              >

              </input>
              
              {/* <p>Current Value: {value}</p> */}
          </li>
          <li style={{ margin: 0}}>
              <hr style={{ margin: 0}}
              
              />
          </li>
        </ul>
        
      </div>
  );
}

export default TextInputComponent;