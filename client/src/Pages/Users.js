import React, { Component } from "react";
import { Redirect } from "react-router-dom";

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
    users: [],
    teams: [],
    teamList: [],
  };

  componentDidMount() {
    this.getUsers();
    this.getTeams();
    window.scrollTo(0, 0);
  }

  submitAddUserToTeam = () => {
    if (this.state.addTeamName.length === 0 || this.state.addTeamUserName.length === 0) return;
    fetch("/api/addUserToTeam", {
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
      .catch((err) => {
        console.log(err);
      });
  };

  submitRemoveUserFromTeam = () => {
    if (this.state.removeFromTeam.length === 0 || this.state.removeUserFromTeam.length === 0)
      return;
    fetch("/api/removeUserFromTeam", {
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
      .catch((err) => {
        console.log(err);
      });
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
          //this.getUsers();
        }
      })
      .catch((err) => {
        alert("Could not remove user:\n", err);
      });
  };

  submitAddUser = (email, password) => {
    if (email.length === 0 || password.length === 0) return;
    console.log(email, password);
    fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error === false) {
          alert("Success!");
          window.location.reload();
          //this.getUsers();
        } else {
          alert("Could not add user.");
          alert(res.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  getTeams = () => {
    fetch("/api/getTeams", {
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
          this.setState({ users: res.users });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  checkForm(e) {
    console.log(e);
  }
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
    return sessionStorage.__user_is_admin__ ? (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1"></div>
        <div className="flex-container-5 main-body">
          <div className="quadrant-container">
            <div className="quadrant">
              <h1
                className="page-divider-header"
                style={{ marginLeft: "2.5%", backgroundColor: "#4dc300" }}
              >
                Add Users
              </h1>
              <div className="space" style={{ marginBottom: "10%", marginTop: "5%" }} />
              <input
                type="email"
                className="text-input"
                placeholder="Email"
                onChange={this.addEmailF}
              ></input>
              <div className="space" style={{ marginBottom: "1%" }} />
              <input
                type="text"
                className="text-input"
                placeholder="Password"
                onChange={this.addPasswordF}
                style={{ width: "10%" }}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <button
                className="button-style no-outline"
                onClick={() => {
                  this.submitAddUser(this.state.addEmail, this.state.addPassword);
                }}
              >
                Add User
              </button>
            </div>
            <div className="quadrant">
              <h1
                className="page-divider-header"
                style={{
                  marginLeft: "2.5%",
                  backgroundColor: "#4dc300",
                }}
              >
                Add Users to Teams
              </h1>
              <div className="space" style={{ marginBottom: "10%", marginTop: "5%" }} />
              <input
                className="text-input"
                placeholder="Team name"
                type="text"
                name="addTeamName"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginBottom: "1%" }} />
              <input
                className="text-input"
                placeholder="User email"
                type="email"
                name="addTeamUserName"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <button
                className="button-style no-outline"
                onClick={() => {
                  this.submitAddUserToTeam();
                }}
              >
                Add to Teams
              </button>
            </div>
            <div className="quadrant">
              <h1
                className="page-divider-header"
                style={{
                  marginLeft: "2.5%",
                  backgroundColor: "#F32000",
                }}
              >
                Remove Users
              </h1>
              <div className="space" style={{ marginBottom: "10%", marginTop: "5%" }} />
              <input
                className="text-input"
                placeholder="Email"
                onChange={this.deleteEmailF}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <button
                className="button-style no-outline"
                onClick={() => {
                  this.submitRemoveUser(this.state.deleteEmail);
                }}
              >
                Remove User
              </button>
            </div>
            <div className="quadrant">
              <h1
                className="page-divider-header"
                style={{ marginLeft: "2.5%", backgroundColor: "#F32000" }}
              >
                Remove Users from Teams
              </h1>
              <div className="space" style={{ marginBottom: "10%", marginTop: "5%" }} />
              <input
                className="text-input"
                placeholder="User team"
                type="text"
                name="removeFromTeam"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginBottom: "1%" }} />
              <input
                className="text-input"
                placeholder="User email"
                type="email"
                name="removeUserFromTeam"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <button
                className="button-style no-outline"
                onClick={() => {
                  this.submitRemoveUserFromTeam();
                }}
              >
                Remove from Team
              </button>
            </div>
            <div className="space" />
            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
              Registered Users
            </h1>
            <div className="space" style={{ marginBottom: "2%", marginTop: "2%"}} />
            <select
                  className="text-input"
                  style={{ padding: "0" , marginLeft:"32%"}}
                  name="addteam"
                  onChange={this.handleEvent}
                >
                  <option value="">Select team</option>
                  {this.state.teamList
                    ? this.state.teamList.map((x) => {
                        return <option value={x}>{x}</option>;
                      })
                    : null}
                </select>
            <div className="space" />
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                alignItems: "left",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {this.state.users.map((user) => (
                <span
                  style={{
                    fontWeight: "bold",
                    width: "30%",
                    marginBottom: "12px",
                  }}
                >
                  {user}
                </span>
              ))}
            </div>
            <div className="space" />
            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
              Teams
            </h1>
            <div className="space" />
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                alignItems: "left",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {this.state.teams.map((team) => (
                <span
                  style={{
                    fontWeight: "bold",
                    width: "30%",
                    marginBottom: "12px",
                  }}
                >
                  {team}
                </span>
              ))}
            </div>
            <div className="space" />
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
