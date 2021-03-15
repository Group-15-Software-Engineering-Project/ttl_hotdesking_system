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
    post: "",
    responseToPost: false,
  };

  //const [responseToPost, setResponseToPost] = useState("");
  ifValid() {
    console.log(this.state.responseToPost);
    if(this.state.responseToPost===true)
      <Redirect to="/home"></Redirect>;

      return null;
    
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Success login handleSubmit");

    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });

    console.log(this.state.responseToPost);
  };

  render() {
    const isValid = this.state.responseToPost;
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
            onClick={this.handleSubmit}
            block
            size="lg"
            type="submit"
            disabled={!this.validateForm()}
          >
            Login
            
          </Button>
          <div>
      {isValid ? (
        <Redirect to="/home"></Redirect>
      ): <div></div> }
    </div>
          
        </Form>
      </div>
    );
  }
}

export default Login;
