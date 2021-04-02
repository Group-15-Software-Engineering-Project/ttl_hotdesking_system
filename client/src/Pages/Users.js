import React, { Component } from "react";
import User from "../Components/User";
import "../public/css/main.css";
class Users extends Component {
  state = {
    addEmail: "",
    addPassword: "",
    deleteEmail: "",
    users: [],
  };

  componentDidMount() {
    this.getUsers();
  }

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
          <div className="space" />
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            Add Users
          </h1>
          <div className="space" />
          <input
            type="email"
            className="text-input"
            placeholder="Email"
            onChange={this.addEmailF}
          ></input>
          <div className="space" />
          <input
            type="password"
            className="text-input"
            placeholder="Password"
            onChange={this.addPasswordF}
          ></input>
          <div className="space" style={{ marginBottom: "1%" }} />
          <button className="button-style"></button>
        </div>
        <div className="flex-container-1"></div>
      </div>
    );
  }
}

export default Users;

{
  /* <div className="desks">
<div>
  <h3>Add user:</h3>
  <input type="email" onChange={this.addEmailF}></input>
  <br></br><br></br>
  <input type="text" onChange={this.addPasswordF}></input>
  <button
    onClick={(e) =>
      this.submitAddUser(this.state.addEmail, this.state.addPassword)
    }
  >
    {" "}Add User{" "}
  </button>
</div>
  
<div>
  <h3>Delete user:</h3>
  <input type="text" onChange={this.deleteEmailF}></input>
  <button
    onClick={(e) =>
      this.submitRemoveUser(this.state.deleteEmail)
    }
  >
    {" "}Delete User{" "}
  </button>
</div>

<br></br><br></br><br></br>
<h2>
  Email
</h2>
<div>{this.state.users.map(user => <User key={user} user={user} />)}</div>
</div> */
}
