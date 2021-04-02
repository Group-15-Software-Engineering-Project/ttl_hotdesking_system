import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../public/css/Login.css";
import "../public/css/main.css";
import { Route, Link, Redirect } from "react-router-dom";
import App from "../App";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validLogin: false,
      errorText: false,
    };
  }
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");

  submitLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          this.setState({ validLogin: false, errorText: true });
        } else {
          this.setState({ validLogin: true });
          this.props.setEmail(this.state.email);
        }
      })
      .catch((err) => {
        this.setState({ validLogin: false, errorText: true });
      });
  };

  render() {
    if (this.state.validLogin) {
      return <Redirect to="/home"></Redirect>;
    }
    return (
      <div>
        <img
          id="clip"
          src={TCDLogo}
          className="login-logo"
          style={{ zIndex: "6" }}
        />
        <div className="block-top">
          <div className="title-text">
            Trinity Teaching & Learning Desk Booking
          </div>
        </div>
        <div className="wrapper">
          <div className="flex-container-1" />
          <div
            className="flex-container-5"
            style={{
              alignText: "center",
              paddingTop: "100px",
              boxShadow: "0 0 5px #333",
              backgroundColor: "white",
            }}
          >
            <Form>
              <Form.Group size="lg" controlId="email">
                <Form.Control
                  className="text-field"
                  placeholder="Email"
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="password">
                <Form.Control
                  className="text-field"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </Form.Group>

              <Button className="login-button" onClick={this.submitLogin}>
                Login
              </Button>
              {this.state.errorText ? (
                <>
                  <br />
                  <span style={{ color: "red", marginLeft: "-1.5px" }}>
                    {"Email or password did not match."}
                  </span>
                </>
              ) : null}
            </Form>
          </div>
          <div className="flex-container-1" />
        </div>
        <footer
          style={{
            backgroundColor: "#717171",
            height: "10vh",
            zIndex: "3",
            color: "white",
            textAlign: "center",
            font: "Calibri",
            paddingTop: "2vh",
          }}
        >
          {
            "For issues regarding authentication, please contact: insert.email@here.ie"
          }
        </footer>
      </div>
    );
  }
}

export default Login;
