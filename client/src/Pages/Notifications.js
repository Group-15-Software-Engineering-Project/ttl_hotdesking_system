import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import BookingCalendarNoLimit from "../Components/BookingCalendarNoLimit";

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
    areaKey: "default",
    chosenArea: "default",
    chosenDesk: "default",
    chosenDate: "default",
    chosenTime: "default",
    locations: [],
    bookableDesks: [],
    selectAM: false,
    selectPM: false,
    responseToPost: "",
    times: [
      { value: "9:00 - 13:00", label: "AM" },
      { value: "13:30 - 17:30", label: "PM" },
      { value: "9:00 - 17:30", label: "AMPM" },
    ],
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
            <div className="full">
              <h1
                className="page-divider-header"
                style={{
                  marginLeft: "2.5%",
                  backgroundColor: "#4dc300",
                }}
              >
                Add Notifications
              </h1>
              <div className="space" style={{ marginBottom: "10%", marginTop: "5%" }} />
              <input
                className="text-input-bigger"
                placeholder="Enter notification here..."
                type="text"
                name="deleteEmail"
                autoComplete="none"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <h1 className="page-divider-header-smaller" style={{ marginLeft: "22.5%" }}>
                Select an expiration Date
              </h1>
              <BookingCalendarNoLimit
                key={this.state.chosenTime}
                chosenArea={this.state.chosenArea}
                bookingTime={(() => {
                  for (let i in this.state.times) {
                    if (this.state.chosenTime === this.state.times[i].value) {
                      return this.state.times[i].label;
                    }
                  }
                })()}
                onSelect={(desks, date, m) => {
                  let newDate;
                  if (this.state.chosenDate === "default" && date.split(" ")[1] !== m) {
                    newDate = "default";
                  } else if (this.state.chosenDate === "default") {
                    newDate = date;
                  } else if (this.state.chosenDate.split(" ")[1] !== date.split(" ")[1]) {
                    newDate = "default";
                  } else {
                    newDate = date;
                  }
                  this.setState({
                    bookableDesks: desks,
                    chosenDate: newDate,
                    chosenDesk: "default",
                  });
                }}
              ></BookingCalendarNoLimit>
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
