import React, { Component } from "react";
import "./public/css/App.css";
import Navbar from "./Components/NavBar";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
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
    visible: true,
    isLoggedIn: false,
  };

  // componentDidMount = () => {
  //   if (sessionStorage.getItem("email"))
  //     this.setState({ email: sessionStorage.getItem("email") });
  // };

  // componentDidUpdate = () => {
  //   if (this.state.email.length === 0 && sessionStorage.getItem("email"))
  //     this.setState({ email: sessionStorage.getItem("email") });
  // };
  render() {
    return (
      <div key={sessionStorage.getItem("email")}>
        <p>{this.state.response}</p>
        <p>{this.state.responseToPost}</p>
        <Router>
          {!sessionStorage.email ? <Redirect to="/login"></Redirect> : null}

          <Navbar
            resetEmail={() => {
              this.setState({ email: "" });
            }}
          />
          <Switch>
            <Route exact path="/loading">
              <Redirect to="/home"></Redirect>
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
              <BookingPage email={sessionStorage.email} />
            </Route>
            <Route path="/locations" component={Locations} />
            <Route path="/users" component={Users} />
            <Route path="/home">
              <Home email={sessionStorage.email}></Home>
            </Route>
            <Route path="/account">
              <Account email={sessionStorage.email} />
            </Route>
            <Route path="/reports" component={Reports} />
            <Route path="/past-bookings">
              <PastBookings email={sessionStorage.email} />
            </Route>
            <Route path="/messages" component={Messages} />
            <Route path="/chooseDesk" component={ChooseDesk} />
            {this.state.visible ? <Route path="/Admin" component={Admin} /> : null}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
