import React, { Component } from "react";
import User from "../Components/User";
import "../public/css/main.css";
class Users extends Component {
  state = {
    addEmail: "",
    addPassword: "",
    deleteEmail: "",
    addTeamName: "",
    addTeamUserName: "",
    removeFromTeam: "",
    removeUserFromTeam: "",
    users: [],
  };

  componentDidMount() {
    this.getUsers();
  }

  submitAddUserToTeam = () => {};

  submitRemoveUserFromTeam = () => {};

  submitRemoveUser = (email) => {
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
          this.getUsers();
        }
      })
      .catch((err) => {
        alert("Could not remove user:\n", err);
      });
  };

  submitAddUser = (email, password) => {
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
          this.getUsers();
        } else {
          alert("Could not add user.");
          alert(res.message);
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

  render() {
    return (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1"></div>
        <div className="flex-container-5 main-body">
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "flex-start",
            }}
          >
            <div className="quadrant">
              <h1
                className="page-divider-header"
                style={{ marginLeft: "2.5%", backgroundColor: "#4dc300" }}
              >
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
              ></input>
              <div className="space" style={{ marginBottom: "1%" }} />
              <input
                type="text"
                className="text-input"
                placeholder="Password"
                onChange={this.addPasswordF}
                style={{ width: "10%" }}
              ></input>
              <div
                className="space"
                style={{ marginTop: "5%", marginBottom: "5%" }}
              />
              <button
                className="button-style"
                onClick={() => {
                  this.submitAddUser(
                    this.state.addEmail,
                    this.state.addPassword
                  );
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
              ></input>
              <div className="space" style={{ marginBottom: "1%" }} />
              <input
                className="text-input"
                placeholder="User email"
                type="email"
                name="addTeamUserName"
                onChange={this.handleEvent}
              ></input>
              <div
                className="space"
                style={{ marginTop: "5%", marginBottom: "5%" }}
              />
              <button
                className="button-style"
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
              <div
                className="space"
                style={{ marginBottom: "10%", marginTop: "5%" }}
              />
              <input
                className="text-input"
                placeholder="Email"
                onChange={this.deleteEmailF}
              ></input>
              <div
                className="space"
                style={{ marginTop: "5%", marginBottom: "5%" }}
              />
              <button
                className="button-style"
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
              <div
                className="space"
                style={{ marginBottom: "10%", marginTop: "5%" }}
              />
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
              <div
                className="space"
                style={{ marginTop: "5%", marginBottom: "5%" }}
              />
              <button
                className="button-style"
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
            <div className="space" />
            <div
              style={{
                display: "flex",
                flexFlow: "row wrap",
                alignItems: "left",
                width: "100%",
              }}
            >
              {this.state.users.map((user) => (
                <span
                  style={{
                    fontWeight: "bold",
                    width: "16%",
                    marginBottom: "12px",
                  }}
                >
                  {user}
                </span>
              ))}
            </div>
            <div className="space" />
          </div>
        </div>
        <div className="flex-container-1"></div>
      </div>
    );
  }
}

export default Users;
