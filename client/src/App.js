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

class App extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: "",
  };

  componentDidMount() {
    this.handleSubmit();
    this.callApi()
      .then((res) => this.setState({ response: res.express }))
      .catch((err) => console.log(err));
  } 

  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = async () => {
    //preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: "poo poo" }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
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
            <Route path="/login" component={Login}></Route>
            <Route path="/booking-page" component={BookingPage} />
            <Route path="/desks" component={Desks} />
            <Route path="/home" component={Home} />
            <Route path="/reports" component={Reports} />
            <Route path="/products" component={Products} />
            <Route path="/messages" component={Messages} />
            <Route path="/chooseDesk" component={ChooseDesk} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
