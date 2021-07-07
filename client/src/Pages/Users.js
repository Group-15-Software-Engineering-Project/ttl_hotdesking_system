import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import { verify, createUniqueID } from "../Components/Misc";
import emailjs from "emailjs-com";

import "../public/css/main.css";
const sha256 = require("js-sha256");

class Users extends Component {
    state = {
        addEmail: "",
        addteam: "",
        addPassword: "",
        deleteEmail: "",
        addTeamName: "",
        addTeamUserName: "",
        removeFromTeam: "",
        removeUserFromTeam: "",
        usersInTeam: [],
        users: [],
        teamList: [],
    };

    positionReference = createRef();

    componentDidMount() {
        //this.getUsers();
        this.getTeams();
        window.scrollTo(0, 0);
    }

    submitAddUserToTeam = () => {
        if (this.state.addTeamName.length === 0 || this.state.addTeamUserName.length === 0)
            return;
        fetch("/api/addUserToGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.addTeamUserName,
                group: this.state.addTeamName,
            }),
        })
            .then((res) => {
                let result = res.json();
                if (result.error) {
                    alert("Failed to add user to team");
                } else {
                    alert("Success");
                    window.location.reload();
                }
            })
            .catch((err) => {});
    };

    submitRemoveUserFromTeam = () => {
        if (
            this.state.removeFromTeam.length === 0 ||
            this.state.removeUserFromTeam.length === 0
        )
            return;
        fetch("/api/removeUserFromGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.removeUserFromTeam,
                group: this.state.removeFromTeam,
            }),
        })
            .then((res) => {
                let result = res.json();
                if (result.error) {
                    alert("error removing user from team");
                } else {
                    alert("Success");
                    window.location.reload();
                }
            })
            .catch((err) => {});
    };

    submitRemoveUser = (email) => {
        if (email.length === 0) return;
        fetch("/api/removeUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert(res.message);
                } else {
                    alert("Success");
                    window.location.reload();
                }
            })
            .catch((err) => {
                alert("Could not remove user:\n", err);
            });
    };

    submitAddUser = (email) => {
        if (email.length === 0 || !email.includes("@")) return;
        let password = createUniqueID(2, false).replaceAll("-", "");
        let emailTemplate = {
            user_email: email,
            tcd_pass: password,
        };
        emailjs
            .send(
                "service_r50ifu8",
                "ttl_new_account",
                emailTemplate,
                "user_XvsnLDmMIB7ZBM1jhkEnR"
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                }
            );
        fetch("/api/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: sha256(password),
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error === false) {
                    alert("Success!");
                    window.location.reload();
                } else {
                    alert("Could not add user.");
                    alert(res.message);
                }
            })
            .catch((err) => {
                alert(err);
            });
        // fetch("/api/addUser", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         email: email,
        //         password: sha256(password),
        //     }),
        // })
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then((res) => {
        //         if (res.error === false) {
        //             alert("Success!");
        //             window.location.reload();
        //         } else {
        //             alert("Could not add user.");
        //             alert(res.message);
        //         }
        //     })
        //     .catch((err) => {
        //         alert(err);
        //     });
    };

    getTeams = () => {
        fetch("/api/getGroups")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert("Could not get Users");
                } else {
                    this.setState({ teamList: res.teams });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };
    getUsers = () => {
        fetch("/api/getUsers", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: "",
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert("Could not get Users");
                } else {
                    this.setState({ users: res.users }, () =>
                        this.positionReference.current.scrollIntoView({ behavior: "smooth" })
                    );
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    submitGetUsersInTeam = (team, label) => {
        if (team === -1) return;
        else {
            fetch("/api/getUsersInGroup", {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ team: team }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res.error) {
                        alert("Could not get Users");
                    } else {
                        this.setState({ [label]: res.users }, () => {
                            if (label === "users")
                                this.positionReference.current.scrollIntoView({
                                    behavior: "smooth",
                                });
                        });
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }
    };

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    addEmailF = (event) => {
        this.setState({ addEmail: event.target.value });
    };

    addPasswordF = (event) => {
        this.setState({ addPassword: event.target.value });
    };

    deleteEmailF = (event) => {
        this.setState({ deleteEmail: event.target.value });
    };

    addteamF = (event) => {
        this.setState({ addteam: event.target.value });
    };

    render() {
        return verify(true) ? (
            <div className="wrapper TCD-BG">
                <div className="flex-container-1"></div>
                <div className="flex-container-5 main-body">
                    <div className="quadrant-container">
                        <div className="quadrant">
                            <h1
                                className="page-divider-header"
                                style={{ marginLeft: "2.5%", backgroundColor: "#4dc300" }}>
                                Add Users
                            </h1>
                            <div
                                className="space"
                                style={{ marginBottom: "10%", marginTop: "5%" }}
                            />
                            <input
                                type="email"
                                className="text-input"
                                placeholder="Email"
                                onChange={this.addEmailF}></input>
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => {
                                    this.submitAddUser(this.state.addEmail);
                                }}>
                                Add User
                            </button>
                        </div>
                        <div className="quadrant">
                            <h1
                                className="page-divider-header"
                                style={{
                                    marginLeft: "2.5%",
                                    backgroundColor: "#4dc300",
                                }}>
                                Add Users to Teams
                            </h1>
                            <div
                                className="space"
                                style={{ marginBottom: "10%", marginTop: "5%" }}
                            />
                            <input
                                className="text-input"
                                placeholder="Team name"
                                type="text"
                                name="addTeamName"
                                onChange={this.handleEvent}></input>
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <input
                                key={"addUserToTeam"}
                                className="text-input"
                                placeholder="User email"
                                type="email"
                                name="addTeamUserName"
                                onChange={this.handleEvent}></input>
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => {
                                    this.submitAddUserToTeam();
                                }}>
                                Add to Teams
                            </button>
                        </div>
                        <div className="quadrant">
                            <h1
                                className="page-divider-header"
                                style={{
                                    marginLeft: "2.5%",
                                    backgroundColor: "#F32000",
                                }}>
                                Remove Users
                            </h1>
                            <div
                                className="space"
                                style={{ marginBottom: "10%", marginTop: "5%" }}
                            />
                            <input
                                className="text-input"
                                placeholder="Email"
                                type="email"
                                name="deleteEmail"
                                autoComplete="none"
                                onChange={this.handleEvent}></input>
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => {
                                    this.submitRemoveUser(this.state.deleteEmail);
                                }}>
                                Remove User
                            </button>
                        </div>
                        <div className="quadrant">
                            <h1
                                className="page-divider-header"
                                style={{ marginLeft: "2.5%", backgroundColor: "#F32000" }}>
                                Remove Users from Teams
                            </h1>
                            <div
                                className="space"
                                style={{ marginBottom: "10%", marginTop: "5%" }}
                            />
                            {/* <input
                className="text-input"
                placeholder="User team"
                type="text"
                name="removeFromTeam"
                onChange={this.handleEvent}
              ></input> */}
                            <select
                                className="text-input"
                                style={{ padding: "0" }}
                                name="removeFromTeam"
                                onChange={(e) =>
                                    this.submitGetUsersInTeam(e.target.value, "usersInTeam")
                                }>
                                <option value={-1}>Select Team</option>
                                {this.state.teamList.map((x) => (
                                    <option value={x}>{x}</option>
                                ))}
                            </select>
                            <div className="space" style={{ marginBottom: "1%" }} />
                            {/* <input
                className="text-input"
                placeholder="User email"
                type="email"
                name="removeUserFromTeam"
                onChange={this.handleEvent}
              ></input> */}
                            <select
                                className="text-input"
                                style={{ padding: "0" }}
                                name="removeUserFromTeam"
                                onChange={this.handleEvent}>
                                <option value={-1}>Select user</option>
                                {this.state.usersInTeam.map((x) => (
                                    <option value={x}>{x}</option>
                                ))}
                            </select>
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                onClick={() => {
                                    this.submitRemoveUserFromTeam();
                                }}>
                                Remove from Team
                            </button>
                        </div>
                        <div className="space" />
                        <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                            Registered Users
                        </h1>
                        <div
                            className="space"
                            style={{ marginBottom: "2%", marginTop: "2%" }}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexFlow: "row wrap",
                                alignItems: "left",
                                width: "100%",
                                justifyContent: "center",
                            }}>
                            <select
                                className="text-input"
                                style={{ padding: "0", width: "25%" }}
                                name="usersInTeam"
                                onChange={(e) =>
                                    this.submitGetUsersInTeam(e.target.value, "users")
                                }>
                                <option value={-1}>Select team</option>
                                {this.state.teamList
                                    ? this.state.teamList.map((x) => {
                                          return <option value={x}>{x}</option>;
                                      })
                                    : null}
                            </select>
                            <div className="space" />
                            <ol
                                style={{
                                    width: "80%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    columnCount: "2",
                                    columnGap: "10px",
                                }}>
                                {this.state.users.map((user) => (
                                    <li
                                        key={user}
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "left",
                                            marginBottom: "5px",
                                        }}>
                                        {user}
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div ref={this.positionReference} />
                        <div className="space" style={{ marginBottom: "10%" }} />
                    </div>
                </div>
                <div className="flex-container-1"></div>
            </div>
        ) : (
            <Redirect to="/home" />
        );
    }
}

export default Users;
