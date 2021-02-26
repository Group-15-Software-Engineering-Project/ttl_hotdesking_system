//import logo from './logo.svg';
import './App.css';
import NavBar from './Components/NavBar';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
//import Login from './Pages/Home';
import {Route, Link} from 'react-router-dom';


function App() {
  return (
    <div ClassName="App"> 
      <NavBar />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
    </div>
    
      //<HomePage />
  );
}

export default App;


/* <div className="App">
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>
    Edit <code>src/App.js</code> and save to reload.
  </p>
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    Learn React
  </a>
</header>
</div> */