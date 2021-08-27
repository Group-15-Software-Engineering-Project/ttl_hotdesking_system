import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../public/css/Login.css";
import "../public/css/main.css";
import { setSessionToken, verify } from "../Components/Misc";
import { Redirect } from "react-router-dom";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";

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
                type: data[i].type,
                date: data[i].start,
                body: data[i].body,
                title: data[i].title,
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
                setSessionToken(this.state.admin);

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
                    // if (!sessionStorage.notifications) this.getNotifications();
                    this.setState({ validLogin: true, admin: res.admin }, () => {
                        this.getUserName();
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
        return (verify(true) || verify(false)) && sessionStorage.notifications ? (
            <Redirect to="/loading"></Redirect>
        ) : (
            <div className="wrapper TCD-BG" style={{posistion:"relative"}}>
                <div className="login-box">
                    <div style={{display:"block", backgroundColor:"#008dd3dd", textAlign:"left", padding:"0.25em 2em"}}>
                        <img src={TCDLogo} alt="TCD Logo" style={{width:"20rem"}}/>
                    </div>
                    <div style={{display:"block", textAlign:"left", padding:"2em 0 3em 3em"}}>
                        <h1 className="login-title">Trinity Desk Booking System</h1>
                        <div className="space"/>
                        <input 
                            type="email" 
                            className="text-input" 
                            placeholder="Email" 
                            style={{minWidth:"20em"}}
                            value={this.state.email}
                            onChange={(e) =>
                                this.setState({ email: e.target.value })
                            }></input>
                        <div className="space" style={{margin:"5px 0"}}/>
                        <input 
                            type="password" 
                            className="text-input" 
                            placeholder="Password" 
                            style={{minWidth:"20em"}} 
                            value={this.state.password}
                            onChange={(e) =>
                                this.setState({ password: e.target.value })
                            }
                        ></input>
                        <div className="space"/>
                        <button                             
                            style={{minWidth:"16.5em"}}
                            className="button-style" 
                            onClick={this.submitLogin}>Login</button>
                        <div className="space" style={{margin:"2em 0"}}/>
                    </div>
                </div>
            </div>
            // <div>
            //     <img
            //         id="clip"
            //         src={TCDLogo}
            //         alt="TCD Logo"
            //         className="login-logo"
            //         style={{ zIndex: "6" }}
            //     />
            //     <div className="block-top">
            //         <div className="title-text">Trinity Teaching & Learning Desk Booking</div>
            //     </div>
            //     <div className="wrapper TCD">
            //         <div className="flex-container-1" />
            //         <div
            //             className="flex-container-5"
            //             style={{
            //                 alignText: "center",
            //                 paddingTop: "100px",
            //                 boxShadow: "0 0 5px #333",
            //                 backgroundColor: "white",
            //             }}>
            //             <Form>
            //                 <Form.Group size="lg" controlId="email">
            //                     <Form.Control
            //                         className="text-field"
            //                         placeholder="Email"
            //                         autoFocus
            //                         type="email"
            //                         value={this.state.email}
            //                         onChange={(e) => this.setState({ email: e.target.value })}
            //                     />
            //                 </Form.Group>
            //                 <Form.Group size="lg" controlId="password">
            //                     <Form.Control
            //                         className="text-field"
            //                         placeholder="Password"
            //                         type="password"
            //                         value={this.state.password}
            //                         onChange={(e) =>
            //                             this.setState({ password: e.target.value })
            //                         }
            //                     />
            //                 </Form.Group>

            //                 <Button className="login-button" onClick={this.submitLogin}>
            //                     Login
            //                 </Button>
            //                 {this.state.errorText ? (
            //                     <>
            //                         <br />
            //                         <span style={{ color: "red", marginLeft: "-1.5px" }}>
            //                             {"Email or password did not match."}
            //                         </span>
            //                     </>
            //                 ) : null}
            //             </Form>
            //         </div>
            //         <div className="flex-container-1" />
            //     </div>
            //     <footer
            //         style={{
            //             backgroundColor: "#717171",
            //             height: "10vh",
            //             zIndex: "3",
            //             color: "white",
            //             textAlign: "center",
            //             font: "Calibri",
            //             paddingTop: "2vh",
            //         }}>
            //         {
            //             "For issues regarding authentication, please contact: insert.email@here.ie"
            //         }
            //     </footer>
            // </div>
        );
    }
}

export default Login;
