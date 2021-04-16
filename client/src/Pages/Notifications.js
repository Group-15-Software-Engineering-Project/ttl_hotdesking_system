import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";

import "../public/css/main.css";
class Notifications extends Component {
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
    window.scrollTo(0, 0);
  }

  render() {
    return sessionStorage.__user_is_admin__ ? (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1"></div>
        <div className="flex-container-5 main-body">
          <div className="quadrant-container">
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
                placeholder="Enter notification here..."
                type="text"
                name="deleteEmail"
                autoComplete="none"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <button
                className="button-style no-outline"
                onClick={() => {
                }}
              >
                Submit
              </button>
            </div>
            <div ref={this.positionReference} />
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

export default Notifications;
