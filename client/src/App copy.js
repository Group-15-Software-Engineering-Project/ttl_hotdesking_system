import React, { Component } from 'react';
import './App.css';

import Navbar from './Components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Reports from './Pages/Reports';
import Products from './Pages/Products';
import Messages from './Pages/Messages';
import ChooseDesk from './Pages/ChooseDesk';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
  render() {
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
}

export default App;