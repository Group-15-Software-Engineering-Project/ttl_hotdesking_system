import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Products from './pages/Products';
import Messages from './pages/Messages';
import ChooseDesk from './pages/ChooseDesk';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />

          <Route path='/reports' component={Reports} />
          <Route path='/products' component={Products} />
          <Route path='/messages' component={Messages} />
          <Route path='/chooseDesk' component={ChooseDesk} />
        </Switch>
      </Router>
    </>
  );
}

export default App;