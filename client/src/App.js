import React, { Component } from "react";
import "./public/css/App.css";

import Navbar from "./Components/NavBar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./Pages/Home";
import Reports from "./Pages/Reports";
import Messages from "./Pages/Messages";
import ChooseDesk from "./Pages/ChooseDesk";
import Login from "./Pages/Login";
import BookingPage from "./Pages/BookingPage";
import Desks from "./Pages/Desks";
import Admin from "./Pages/Admin";
import Users from "./Pages/Users";
import Account from'./Pages/Account'
import PastBookings from './Pages/PastBookings'



class App extends Component {
  state = {
    email: "",
    visible: false,
  };

  locations = [
    {
      value: "Office 3.2: West Theatre",
      label: "No data available for this location.",
    },
    {
      value: "Office 2.5: West Theatre",
      label: "Data available for this location.",
    },
    {
      value: "Office 3.06: Foster Place",
      label: "No data available for this location.",
    },
  ];

  render() {
    console.log(this.state.email);
    return (
      <>
        <p>{this.state.response}</p>
        <p>{this.state.responseToPost}</p>

        <Router>
          <Navbar
            resetEmail={() => {
              this.setState({ email: "" });
            }}
          />
          <Switch>
            <Route exact path="/">
              <Redirect to="/Login"></Redirect>
            </Route>
            <Route path="/login">
              <Login setEmail={(email) => this.setState({ email: email })} />
            </Route>
            <Route path="/booking-page">
              <BookingPage email={this.state.email} options={this.locations} />
            </Route>
            <Route path="/desks" component={Desks} />
            <Route path="/users" component={Users} />
            <Route path="/home" component={Home} />  
            <Route path="/account" component={Account} />
            
            <Route path="/reports" component={Reports} />
           
            <PastBookings email={this.state.email} />
           
            <Route path="/messages" component={Messages} />
            <Route path="/chooseDesk" component={ChooseDesk} />
            {this.state.visible ? (
              <Route path="/Admin" component={Admin} />
            ) : null}
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
