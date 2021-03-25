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
import Products from "./Pages/Products";
import Messages from "./Pages/Messages";
import ChooseDesk from "./Pages/ChooseDesk";
import Login from "./Pages/Login";
import BookingPage from "./Pages/BookingPage";
import Desks from "./Pages/Desks";
import Admin from "./Pages/Admin";

class App extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: "",
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

  state = {
    // state should be false unless signed in as admin
    visible: false,
  };

  render() {
    return (
      <>
        <p>{this.state.response}</p>
        <p>{this.state.responseToPost}</p>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/">
              <Redirect to="/Login"></Redirect>
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/booking-page">
              <BookingPage options={this.locations} />
            </Route>
            <Route path="/desks" component={Desks} />
            <Route path="/home" component={Home} />
            <Route path="/reports" component={Reports} />
            <Route path="/products" component={Products} />
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
