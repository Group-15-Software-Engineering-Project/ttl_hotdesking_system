import React, { Component } from "react";
import "../public/css/Login.css";
import "../public/css/main.css";
import { verify } from "../Components/Misc";
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

    componentDidMount = () => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && this.state.password.length > 0) {
                this.submitLogin();
            }
        });
        sessionStorage.clear();
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
                    this.setState({ validLogin: true, admin: res.admin }, () => {
                        sessionStorage.setItem("sessionToken", res.user.token);
                        sessionStorage.setItem("username", res.user.username);
                        sessionStorage.setItem("email", res.user.email);
                        window.location = "/home";
                    });
                }
            })
            .catch((err) => {
                this.setState({ validLogin: false, errorText: true });
                this.forceUpdate();
            });
    };

    render() {
        return (
            <div className='wrapper TCD-BG' style={{ position: "relative" }}>
                <form
                    className='login-box'
                    onSubmit={(e) => {
                        e.preventDefault();
                        this.submitLogin();
                    }}>
                    <div
                        style={{
                            display: "block",
                            backgroundColor: "#008dd3dd",
                            textAlign: "left",
                            padding: "0.25em 2em",
                        }}>
                        <img src={TCDLogo} alt='TCD Logo' style={{ width: "20rem" }} />
                    </div>
                    <div style={{ display: "block", textAlign: "left", padding: "2em 0 3em 3em" }}>
                        <h1 className='login-title'>Trinity T&L Hot-Desking App</h1>
                        <div className='space' />
                        <input
                            type='text'
                            className='text-input'
                            placeholder='Email'
                            autoComplete='off'
                            autoSave='off'
                            style={{ minWidth: "20em" }}
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}></input>
                        <div className='space' style={{ margin: "5px 0" }} />
                        <input
                            type='password'
                            className='text-input'
                            placeholder='Password'
                            autoComplete='off'
                            style={{ minWidth: "20em" }}
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}></input>

                        <button style={{ minWidth: "16.5em" }} className='button-style' type='submit'>
                            Login
                        </button>
                        <div className='space' style={{ margin: "2em 0" }} />
                        {this.state.errorText ? (
                            <p className='space login-error'>{"Email and password did not match."}</p>
                        ) : (
                            <div className='space' style={{ margin: "0 0 0.5em 0", height: "2em" }} />
                        )}
                        <div className='space' style={{ margin: "2em 0" }} />
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
