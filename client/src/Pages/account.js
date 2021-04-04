import React, { Component } from "react";
import "../public/css/main.css";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      username: "N/A",
      bookingsMade: 0,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      delPassword: "",
      confirmDelPassword: "",
      setUserName: "",
      deleteAccountConfirmation: false,
    };
  }

  submitUserName = () => {};

  submitChangePassword = () => {
    if (this.state.newPassword === this.state.confirmNewPassword) {
      //fetch api to change old password to new password.
    }
  };

  submitDeleteAccount = () => {
    if (
      this.state.delPassword === this.state.confirmDelPassword &&
      this.state.deleteAccountConfirmation
    ) {
    }
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  handleEvent = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
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
            }}
          >
            {"Name: " + this.state.username}
          </h4>
          <div className="space" style={{ marginBottom: "1%" }} />
          <h4
            style={{
              textAlign: "left",
              marginLeft: "5%",
            }}
          >
            {"Email: " + this.state.email}
          </h4>
          <div className="space" style={{ marginBottom: "1%" }} />
          <h4
            style={{
              textAlign: "left",
              marginLeft: "5%",
            }}
          >
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
                style={{ backgroundColor: "#777", marginLeft: "2.5%" }}
              >
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
                className="button-style"
                onClick={() => this.submitChangePassword()}
              >
                Change Password
              </button>
            </div>
            <div className="quadrant" style={{ border: "none" }}>
              <h1
                className="page-divider-header"
                style={{ backgroundColor: "#777", marginLeft: "2.5%" }}
              >
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
                className="button-style"
                onClick={() => this.submitUserName()}
              >
                Set User Name
              </button>
            </div>
          </div>
          <h1
            className="page-divider-header"
            style={{ backgroundColor: "#F32000", marginLeft: "2.5%" }}
          >
            Delete Account
          </h1>
          <div className="space" />
          <h3 style={{ color: "red" }}>Warning!</h3>
          <span style={{ color: "red" }}>
            This action is irreversible and will result in the loss of all
            booking history.
          </span>
          <div className="space" style={{ marginBottom: "0" }} />
          <span style={{ color: "red" }}>
            Proceeding will remove all information tied to this account.
          </span>
          <div className="space" style={{ marginBottom: "0" }} />
          <span style={{ color: "red" }}>
            This account will lose all access to this service unless added again
            by an admin.
          </span>
          <div className="space" style={{ marginBottom: "0" }} />

          <input
            type="password"
            name="delPassword"
            className="text-input"
            onChange={this.handleEvent}
            placeholder="Password"
            style={{ margin: "2%" }}
          />
          <input
            type="password"
            name="confirmDelPassword"
            className="text-input"
            onChange={this.handleEvent}
            placeholder="Confirm password"
            style={{ margin: "2%" }}
          />
          <div className="space" style={{ marginBottom: "1%" }} />
          <label for="deleteAccountConfirm" style={{ marginRight: "1%" }}>
            Delete my account{" "}
          </label>
          <input
            type="checkbox"
            name="deleteAccountConfirm"
            onChange={(e) =>
              this.setState({ deleteAccountConfirm: e.target.checked })
            }
          ></input>
          <div className="space" />
          <button
            className="button-style-warning"
            onClick={() => this.submitDeleteAccount()}
          >
            Delete Account
          </button>
          <div className="space" />
        </div>
        <div className="flex-container-1" />
      </div>
    );
  }
}

export default Account;
