import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../public/css/Login.css";
import crest from "../public/media/tcd-logo.png";
import { Route, Link, Redirect } from "react-router-dom";
import App from "../App";

class Login extends Component {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  state = {
    email: "",
    password: "",
    validLogin: false,
  };

  submitLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          this.setState({validLogin: false});
        } else {
          this.setState({validLogin: true});
        }
      })
      .catch((err) => {
        this.setState({validLogin: false});
      });
  };

  render() {
    if (this.state.validLogin) {
      return (
        <Redirect to="/home"></Redirect>
      );
    }
    return (
      <div className="Login">
        <img src={crest} alt="Crest" />
        <Form >
          <Form.Group size="lg" controlId="email">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </Form.Group>

          <Button
            onClick={this.submitLogin}
          >
            Login
            
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;
