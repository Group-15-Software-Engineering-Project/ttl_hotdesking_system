import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
require('dotenv').config();
require('mysql');

class App extends Component {
    state = { loading: true };

    var databaseConnection = mysql.createConnection({
        host: process.env.REACT_APP_ENDPOINT,
        user: process.env.REACT_APP_USER_ID,
        password: process.env.REACT_APP_USER_PASS
    });

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p>{ this.state.loading.toString() }</p>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        );
    }
}

export default App;
