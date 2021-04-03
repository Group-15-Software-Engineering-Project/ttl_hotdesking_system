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
import Locations from "./Pages/Locations";
import Admin from "./Pages/Admin";
import Users from "./Pages/Users";
import Account from "./Pages/account";
import PastBookings from "./Pages/PastBookings";

class App extends Component {
  state = {
    email: "",
    visible: false,
    isLoggedIn: false,
  };

  render() {
    return (
      <>
        <p>{this.state.response}</p>
        <p>{this.state.responseToPost}</p>
        <Router>
          {!this.state.isLoggedIn ? <Redirect to="/login"></Redirect> : null}

          <Navbar
            resetEmail={() => {
              this.setState({ email: "" });
            }}
          />
          <Switch>
            <Route exact path="/loading">
              {this.state.email.length !== 0 ? (
                <Redirect to="/home"></Redirect>
              ) : (
                <Redirect to="/loading" />
              )}
            </Route>
            <Route exact path="/">
              <Redirect to="/login"></Redirect>
            </Route>

            <Route path="/login">
              <Login
                setEmail={(email) => {
                  this.setState({ email: email, isLoggedIn: true });
                }}
              />
            </Route>

            <Route path="/booking-page">
              <BookingPage email={this.state.email} />
            </Route>
            <Route path="/locations" component={Locations} />
            <Route path="/users" component={Users} />
            <Route path="/home">
              <Home email={this.state.email}></Home>
            </Route>
            <Route path="/account" component={Account} />
            <Route path="/reports" component={Reports} />
            <Route path="/past-bookings">
              <PastBookings email={this.state.email} />
            </Route>
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
