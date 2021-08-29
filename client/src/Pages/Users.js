import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";

import "../public/css/main.css";

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
        allUsers: [],
        users: [],
        teamList: [],
        listedTeam: "",

    };

    positionReference = createRef();

    componentDidMount() {
        this.submitGetUsersInTeam("All Users", "allUsers");
        this.submitGetUsersInTeam("All Users", "users");
        this.getTeams();
        window.scrollTo(0, 0);
    }

    validEmail = (email) => {
        if (email.length === 0) return false;
        return (
            email.includes("@") &&
            email.includes(".") &&
            email.split(".")[email.split(".").length - 1].length > 1 &&
            email.lastIndexOf(".") > email.lastIndexOf("@")
        );
    };
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
                if (!res.ok)
                    throw new Error(`Failed to add user to group (status:${res.status})`);
                else {
                    alert(
                        `Added ${this.state.addTeamUserName} to team ${this.state.addTeamName}.`
                    );
                    this.setState({ addTeamUserName: "" });
                    this.submitGetUsersInTeam(this.state.listedTeam, "users");

                    this.getTeams();
                    
                }
            })
            .catch(console.error);
    };

    submitRemoveUserFromTeam = () => {
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
                    this.setState({ removeUserFromTeam: "", removeFromTeam: "" });
                    this.submitGetUsersInTeam(this.state.listedTeam, "users");

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
                    this.setState({ deleteEmail: "" });
                    this.submitGetUsersInTeam("All Users", "allUsers");
                    this.submitGetUsersInTeam(this.state.listedTeam, "users");
                }
            })
            .catch((err) => {
                alert("Could not remove user:\n", err);
            });
    };

    submitAddUser = (email) => {
        fetch("/api/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to add user (status:${res.status})`);
            })
            .then(() => {
                console.log("added");
                this.setState({ addEmail: "" });
                this.submitGetUsersInTeam("All Users", "allUsers");
                this.submitGetUsersInTeam(this.state.listedTeam, "users");

            })
            .catch(console.error);
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
                        this.setState({ [label]: res.users.filter(this.validEmail) });
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
                                onChange={this.addEmailF}
                                value={this.state.addEmail}></input>
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                disabled={!this.validEmail(this.state.addEmail)}
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
                                onChange={this.handleEvent}
                                value={this.state.addTeamName}></input>
                            <span> </span>
                            <select
                                className="text-input"
                                name="addTeamName"
                                style={{ padding: 0 }}
                                onChange={this.handleEvent}
                                value={this.state.addTeamName}>
                                <option key="empty-option" value="">
                                    Select team
                                </option>
                                {this.state.teamList
                                    .filter((e) => !e.includes("All Users"))
                                    .map((x) => {
                                        return (
                                            <option key={"team_" + x} value={x}>
                                                {x}
                                            </option>
                                        );
                                    })}
                            </select>
                            <div className="space" style={{ marginBottom: "1%" }} />
                            <input
                                key={"addUserToTeam"}
                                className="text-input"
                                placeholder="User email"
                                type="email"
                                name="addTeamUserName"
                                onChange={this.handleEvent}
                                value={this.state.addTeamUserName}></input>
                            <span> </span>
                            <select
                                className="text-input"
                                name="addTeamUserName"
                                style={{ padding: 0 }}
                                onChange={this.handleEvent}
                                value={this.state.addTeamUserName}>
                                <option key="empty-val" value="">
                                    Select user
                                </option>
                                {this.state.allUsers.map((x) => {
                                    return (
                                        <option key={"user_" + x} value={x}>
                                            {x}
                                        </option>
                                    );
                                })}
                            </select>

                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                disabled={
                                    !(
                                        this.state.addTeamName &&
                                        this.validEmail(this.state.addTeamUserName)
                                    )
                                }
                                onClick={this.submitAddUserToTeam}>
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
                                disabled={
                                    this.state.allUsers.indexOf(this.state.deleteEmail) === -1
                                }
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

                            <select
                                className="text-input"
                                style={{ padding: "0" }}
                                name="removeFromTeam"
                                value={this.state.removeFromTeam}
                                onChange={(e) => {
                                    this.submitGetUsersInTeam(e.target.value, "usersInTeam");
                                    this.handleEvent(e);
                                }}>
                                <option value={-1}>Select team</option>
                                {this.state.teamList.filter(e => !e.includes("All Users")).map((x) =>
                                    <option value={x}>{x}</option>
                                )}
                            </select>
                            <div className="space" style={{ marginBottom: "1%" }} />

                            <select
                                className="text-input"
                                style={{ padding: "0" }}
                                name="removeUserFromTeam"
                                value={this.state.removeUserFromTeam}
                                onChange={this.handleEvent}>
                                <option value={-1}>Select user</option>
                                {this.state.usersInTeam.map((x) => 
                                    <option value={x}>{x}</option>
                                )}
                            </select>
                            <div
                                className="space"
                                style={{ marginTop: "5%", marginBottom: "5%" }}
                            />
                            <button
                                className="button-style no-outline"
                                disabled={
                                    !this.state.removeFromTeam ||
                                    !this.state.removeUserFromTeam
                                }
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
                                value={this.state.listedTeam}
                                onChange={(e) => {
                                    this.setState({listedTeam: e.target.value});
                                    this.submitGetUsersInTeam(e.target.value, "users")
                                }}>
                                {/* <option value={-1}>Select team</option> */}
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
