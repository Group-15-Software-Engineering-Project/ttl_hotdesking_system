import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../public/css/Login.css";
import "../public/css/main.css";
import { _GetUserBookings, tokenize, verify } from "../Components/Misc";
import { Redirect } from "react-router-dom";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";
//const sha256 = require("js-sha256");
import { sha256 } from "js-sha256";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            validLogin: false,
            errorText: false,
            admin: false,
        };
    }

    transformNotifications = (data) => {
        let notifs = [];
        for (let i in data) {
            notifs.push({
                type: data[i].TYPE,
                date: data[i].START,
                text: data[i].BODY,
                title: data[i].TITLE,
            });
        }
        return notifs;
    };

    getNotifications = () => {
        fetch("/api/getNotifications")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert("Could not load Notifications");
                } else {
                    let data = this.transformNotifications(res.notifications);
                    sessionStorage.setItem("notifications", JSON.stringify({ data }));
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    componentDidMount = () => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && this.state.password.length > 0) {
                this.submitLogin();
            }
        });
        this.getNotifications();
        if (!(verify(true) || verify(false))) {
            sessionStorage.clear();
        }
    };

    getUserName = () => {
        fetch("/api/getUserName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.err) {
                }
                sessionStorage.setItem("email", this.state.email);
                sessionStorage.setItem("username", res.username);
                tokenize(this.state.admin);

                window.location = "/home";
            })
            .catch((err) => {
                this.setState({ username: this.state.email });
            });
    };

    submitLogin = () => {
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: sha256(this.state.password),
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    this.setState({ validLogin: false, errorText: true });
                } else {
                    this.setState({ validLogin: true, admin: res.admin }, () => {
                        this.getUserName();
                        _GetUserBookings(null, this.state.email);
                    });
                    this.props.setEmail(this.state.email);
                }
            })
            .catch((err) => {
                this.setState({ validLogin: false, errorText: true });
                this.forceUpdate();
            });
    };

    render() {
        return verify(true) || verify(false) ? (
            <Redirect to="/loading"></Redirect>
        ) : (
            <div>
                <img
                    id="clip"
                    src={TCDLogo}
                    alt="TCD Logo"
                    className="login-logo"
                    style={{ zIndex: "6" }}
                />
                <div className="block-top">
                    <div className="title-text">Trinity Teaching & Learning Desk Booking</div>
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
                        }}>
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
                                    onChange={(e) =>
                                        this.setState({ password: e.target.value })
                                    }
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
                    }}>
                    {
                        "For issues regarding authentication, please contact: insert.email@here.ie"
                    }
                </footer>
            </div>
        );
    }
}

export default Login;
