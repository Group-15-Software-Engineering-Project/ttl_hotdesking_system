import React, { Component } from "react";
import "../public/css/main.css";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
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
          <h7>Name</h7>
        </div>

        <div className="flex-container-1" />
      </div>
    );
  }
}

export default Account;
