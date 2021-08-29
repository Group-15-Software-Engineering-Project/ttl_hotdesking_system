import React, { Component } from "react";
import "./public/css/App.css";
// import Navbar from "./Components/NavBar";
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
import NavigationSidebar from "./Components/NavigationSidebar";
import AdminOptions from "./Pages/AdminOptions";
import CurrentBookings from "./Pages/CurrentBookings";
import { verify } from "./Components/Misc";

class App extends Component {
    state = {
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
            <div>
                <Router>
                    {(verify(true) || verify(false)) && !String(window.location).includes("/login") && <NavigationSidebar />}

                    <Switch>
                        <Route exact path="/loading">
                            <Redirect to="/home"></Redirect>
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/login"></Redirect>
                        </Route>

                        <Route path="/login">
                            <Login/>
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
                        <Route path="/current-bookings" component={CurrentBookings} />
                        <Route path="/past-bookings">
                            <PastBookings email={sessionStorage.email} />
                        </Route>
                        <Route path="/adminOptions" component={AdminOptions} />
                        <Route path="/Admin" component={Admin} />
                        <Route path="/AdminBookingView" component={AdminBookingView} />
                    </Switch>
                </Router>

                {this.zoomOutMobile()}
            </div>
        );
    }
}

export default App;
