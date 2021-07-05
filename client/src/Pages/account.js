import React, { Component } from "react";
import { Redirect } from "react-router";
import { _GetUserBookings, verify, setSessionToken } from "../Components/Misc";
import "../public/css/main.css";

const sha256 = require("js-sha256");
class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
            username: sessionStorage.username !== "null" ? sessionStorage.username : "N/A",
            bookingsMade: JSON.parse(sessionStorage.bookings).data.length,
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            delPassword: "",
            confirmDelPassword: "",
            setUserName: "",
            deleteAccountConfirmation: false,
        };
    }

    submitUserName = () => {
        fetch("/api/setUserName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.setUserName,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert("error setting username");
                } else {
                    this.getUserName();
                }
            })
            .catch((err) => {
                alert("error setting username (API)");
            });
    };

    submitChangePassword = () => {
        if (this.state.newPassword === this.state.confirmNewPassword) {
            fetch("/api/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: sha256(this.state.newPassword),
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res.error) {
                        alert("Failed to change password");
                    } else {
                        alert("Success");
                    }
                })
                .catch((err) => {
                    alert("Error changing password (API)");
                });
        } else {
            alert("Passwords must match!");
        }
    };

    submitDeleteAccount = () => {
        alert(this.state.delPassword);
        if (
            this.state.delPassword === this.state.confirmDelPassword &&
            this.state.deleteAccountConfirmation
        ) {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: sha256(this.state.delPassword),
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res.error) {
                        alert("Incorrect Password");
                    } else {
                        fetch("/api/removeUser", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: this.state.email,
                            }),
                        })
                            .then((res1) => {
                                return res1.json();
                            })
                            .then((res1) => {
                                if (res1.error) {
                                    alert("Error deleting account");
                                } else {
                                    alert("success");
                                    sessionStorage.clear();
                                    window.location = "/login";
                                }
                            })
                            .catch((err) => {
                                alert("Error deleting account (API)");
                            });
                    }
                })
                .catch((err) => {
                    alert("Error deleting account (API)");
                });
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
                    console.log(res.err);
                }
                this.setState({ username: res.username });
                let admin = verify(true);
                sessionStorage.setItem("username", res.username);
                setSessionToken(admin);
            })
            .catch((err) => {
                console.log(err);
                this.setState({ username: this.state.email });
            });
    };

    componentDidMount = () => {
        //this.getUserName();
        window.scrollTo(0, 0);
        if (!sessionStorage.bookings) _GetUserBookings();
    };

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return verify(true) || verify(false) ? (
            <div className="wrapper TCD-BG">
                <div className="flex-container-1" />
                <div className="flex-container-5 main-body">
                    <div className="space" />
                    <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                        Account Details
                    </h1>
                    <div className="space" />

                    <h4
                        style={{
                            textAlign: "left",
                            marginLeft: "5%",
                        }}>
                        {"Name: " + this.state.username}
                    </h4>
                    <div className="space" style={{ marginBottom: "1%" }} />
                    <h4
                        style={{
                            textAlign: "left",
                            marginLeft: "5%",
                        }}>
                        {"Email: " + this.state.email}
                    </h4>
                    <div className="space" style={{ marginBottom: "1%" }} />
                    <h4
                        style={{
                            textAlign: "left",
                            marginLeft: "5%",
                        }}>
                        {"Bookings made: " + this.state.bookingsMade}
                    </h4>
                    <div className="space" />
                    <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                        Change Account Details
                    </h1>
                    <div className="space" />
                    <div className="quadrant-container">
                        <div className="quadrant" style={{ border: "none" }}>
                            <h1
                                className="page-divider-header"
                                style={{ backgroundColor: "#777", marginLeft: "2.5%" }}>
                                Change Password
                            </h1>
                            <div className="space" style={{ marginBottom: "7%" }} />
                            <input
                                className="text-input"
                                type="password"
                                placeholder="Old password"
                                name="oldPassword"
                                onChange={this.handleEvent}
                            />
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <input
                                className="text-input"
                                type="password"
                                placeholder="New password"
                                name="newPassword"
                                onChange={this.handleEvent}
                            />
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <input
                                className="text-input"
                                type="password"
                                placeholder="Confirm new password"
                                name="confirmNewPassword"
                                onChange={this.handleEvent}
                            />
                            <div
                                className="space"
                                style={{ marginBottom: "5%", marginTop: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => this.submitChangePassword()}>
                                Change Password
                            </button>
                        </div>
                        <div className="quadrant" style={{ border: "none" }}>
                            <h1
                                className="page-divider-header"
                                style={{ backgroundColor: "#777", marginLeft: "2.5%" }}>
                                Set User Name
                            </h1>
                            <div className="space" style={{ marginBottom: "7%" }} />
                            <input
                                type="text"
                                name="setUserName"
                                className="text-input"
                                onChange={this.handleEvent}
                                placeholder="User name"
                            />
                            <div
                                className="space"
                                style={{ marginBottom: "5%", marginTop: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => this.submitUserName()}>
                                Set User Name
                            </button>
                        </div>
                    </div>
                    {!verify(true) ? (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    flexFlow: "column wrap",
                                    textAlign: "center",
                                }}>
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#F32000", marginLeft: "2.5%" }}>
                                    Delete Account
                                </h1>
                                <div className="space" />
                                <h3 style={{ color: "red" }}>Warning!</h3>
                                <span
                                    style={{
                                        color: "red",
                                        fontSize: "0.9rem",
                                        marginLeft: "2px",
                                        marginRight: "2px",
                                    }}>
                                    This action is irreversible and will result in the loss of
                                    all booking history.
                                </span>
                                <div className="space" style={{ marginBottom: "0" }} />
                                <span
                                    style={{
                                        color: "red",
                                        marginLeft: "2px",
                                        marginRight: "2px",
                                        fontSize: "0.9rem",
                                    }}>
                                    Proceeding will remove all information tied to this
                                    account.
                                </span>
                                <div className="space" style={{ marginBottom: "0" }} />
                                <span
                                    style={{
                                        color: "red",
                                        marginLeft: "2px",
                                        marginRight: "2px",
                                        fontSize: "0.9rem",
                                    }}>
                                    This account will lose all access to this service unless
                                    added again by an admin.
                                </span>
                            </div>
                            <div className="space" style={{ marginBottom: "0" }} />

                            <input
                                type="password"
                                name="delPassword"
                                className="text-input"
                                onChange={this.handleEvent}
                                placeholder="Password"
                                style={{ margin: "2%", width: "30%" }}
                            />
                            <input
                                type="password"
                                name="confirmDelPassword"
                                className="text-input"
                                onChange={this.handleEvent}
                                placeholder="Confirm password"
                                style={{ margin: "2%", width: "30%" }}
                            />
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <label for="deleteAccountConfirm" style={{ marginRight: "1%" }}>
                                I know what I'm doing{" "}
                            </label>
                            <input
                                type="checkbox"
                                name="deleteAccountConfirm"
                                onChange={(e) =>
                                    this.setState({
                                        deleteAccountConfirmation: e.target.checked,
                                    })
                                }></input>
                            <div className="space" />
                            <button
                                className="button-style-warning no-outline"
                                onClick={() => this.submitDeleteAccount()}>
                                Delete my Account
                            </button>
                        </>
                    ) : null}
                    <div className="space" style={{ marginBottom: "20%" }} />
                </div>
                <div className="flex-container-1" />
            </div>
        ) : (
            <Redirect to="/login" />
        );
    }
}

export default Account;
