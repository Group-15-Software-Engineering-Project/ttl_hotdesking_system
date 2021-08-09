import React, { Component } from "react";
import "./public/css/App.css";
import Navbar from "./Components/NavBar";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Pages/Home";
import Reports from "./Pages/Reports";
import Login from "./Pages/Login";
import BookingPage from "./Pages/BookingPage";
import Locations from "./Pages/Locations";
import Admin from "./Pages/Admin";
import Users from "./Pages/Users";
import Account from "./Pages/account";
import PastBookings from "./Pages/PastBookings";
import Notifications from "./Pages/Notifications";
import AdminBookingView from "./Pages/AdminBookingView";
import MeetingBookings from "./Pages/MeetingBookings";

class App extends Component {
    state = {
        email: "",
        visible: true,
        isLoggedIn: false,
    };

    zoomOutMobile = () => {
        const viewport = document.querySelector('meta[name="viewport"]');

        if (viewport) {
            viewport.content = "initial-scale=1";
            viewport.content = "width=device-width";
        }
    };

    render() {
        return (
            <div key={sessionStorage.getItem("email")}>
                <p>{this.state.response}</p>
                <p>{this.state.responseToPost}</p>
                <Router>
                    {!sessionStorage.email ? <Redirect to="/login"></Redirect> : null}

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
                        <Route path="/notifications" component={Notifications} />
                        <Route path="/home">
                            <Home email={sessionStorage.email}></Home>
                        </Route>
                        <Route path="/book-meeting-room">
                            <MeetingBookings></MeetingBookings>
                        </Route>
                        <Route path="/account">
                            <Account email={sessionStorage.email} />
                        </Route>
                        <Route path="/reports" component={Reports} />
                        <Route path="/past-bookings">
                            <PastBookings email={sessionStorage.email} />
                        </Route>
                        {this.state.visible ? <Route path="/Admin" component={Admin} /> : null}
                        {this.state.visible ? (
                            <Route path="/AdminBookingView" component={AdminBookingView} />
                        ) : null}
                    </Switch>
                    <Navbar
                        resetEmail={() => {
                            this.setState({ email: "" });
                        }}
                    />
                </Router>

                {this.zoomOutMobile()}
            </div>
        );
    }
}

export default App;
