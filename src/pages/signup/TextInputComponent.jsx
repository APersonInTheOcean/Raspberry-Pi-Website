import { useState } from 'react';
import "./TextInputComponent.css"

function TextInputComponent({Text}) {

  //HOOK THAT LETS BASICALLY SAYS THAT value IS THE VARIABLE TO STORE THE CHANGE, 
  //AND THE setValue IS THE FUNCTION THAT CAN CHANGE THE STATE
  const [value, setValue] = useState('');

  // handler function to update the state on change
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  
  return (
      <div style={{
            display: "flex",
            justifyContent: "left"
          }}>

        <label htmlFor="simple-text-input" style={{padding: "0 10px"}}>{Text}</label>
        <ul style={{padding: 0, margin: 0}}>
          <li style={{padding: 0, margin: 0}}>
              <input
                className="acc-cred-input"
                type="text"
                id="simple-text-input"
                value={value} 
                onChange={handleChange}
                placeholder="Type here..."
                
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