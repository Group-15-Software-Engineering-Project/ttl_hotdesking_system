import React, { Component } from "react";
import "../public/css/main.css";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      username: "N/A",
      bookingsMade: 0,
    };
  }

  render() {
    return (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <div className="space" />
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            Account
          </h1>
          <div className="space" />
          <h2
            style={{
              textAlign: "left",
              marginLeft: "5%",
              textDecoration: "underline",
            }}
          >
            Account Details
          </h2>
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
        </div>
        <div className="flex-container-1" />
      </div>
    );
  }
}

export default Account;
