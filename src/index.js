import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Button } from './components/Button';
import reportWebVitals from './reportWebVitals';



ReactDOM.render(
  <React.StrictMode>
 <App />
 <h0 style={{position: 'absolute', top: 25, right: 40,color:"#060b26",fontSize:20}}><Button onClick={() => {console.log("You clicked on me!")}} type="button"
buttonStyle="btn--primary--solid"> Log out </Button></h0>
</React.StrictMode>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
