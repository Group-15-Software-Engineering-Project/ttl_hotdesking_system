import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import BookingCalendarNoLimit from "../Components/BookingCalendarNoLimit";

import "../public/css/main.css";
class Notifications extends Component {
  state = {
    title: "",
    text: "",
    type: "",
    expiryDate: "",
  };

  handleEvent = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  positionReference = createRef();

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  submitNotification = () => {
    let date = new Date();
    let today =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      date.getDate();
    console.log(this.state.expiryDate);
    fetch("/api/addNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: this.state.type,
        start: today,
        title: this.state.title,
        body: this.state.text,
        end: this.state.expiryDate,
      }),
    })
      .then((res) => {
        let result = res.json();
        if (result.error) {
          alert("error adding a notification");
        } else {
          alert("Success");
          //window.location.reload();
          console.log(this.state.type, today, this.state.title, this.state.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return sessionStorage.__user_is_admin__ ? (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <div className="space" />
          <h1
            className="page-divider-header"
            style={{
              marginLeft: "2.5%",
            }}
          >
            Post Notification
          </h1>
          <div className="space" />
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <select
              className="text-input"
              style={{ padding: "0", width: "15%", margin: "10px" }}
              name="type"
              onChange={this.handleEvent}
            >
              <option value={-1}>Select notification type</option>
              <option value="normal">General</option>
              <option value="important">Important</option>
              <option value="restrictions">Regarding Restrictions</option>
              <option value="news">New Locations/Desks</option>
            </select>

            <input
              className="text-input"
              placeholder="Notification title (max. 30 characters)"
              type="text"
              name="title"
              style={{ overflowWrap: "before", width: "30%", margin: "10px" }}
              autoComplete="none"
              maxLength="30"
              onChange={this.handleEvent}
            ></input>
          </div>
          <textarea
            className="text-input-bigger"
            placeholder="Notification content (max. 1000 characters)"
            type="text"
            name="text"
            style={{ padding: "20px" }}
            autoComplete="none"
            onChange={this.handleEvent}
            maxLength="1000"
          ></textarea>
          <div className="space" />
          <h1 className="page-divider-header" style={{ width: "60%", marginLeft: "20%" }}>
            Set Notification Expiry Date
          </h1>
          <BookingCalendarNoLimit
            onSelect={(date) =>
              this.setState({ expiryDate: date }, () => console.log(this.state.expiryDate))
            }
          ></BookingCalendarNoLimit>
          {this.state.expiryDate ? (
            <h3 style={{ height: "2rem" }}>{`Expiry Date: ${this.state.expiryDate}`}</h3>
          ) : (
            <div style={{ height: "2rem" }} />
          )}
          <div className="space" />
          <button
            disabled={!(this.state.type && this.state.expiryDate && this.state.text)}
            className="button-style no-outline"
            onClick={() => this.submitNotification()}
          >
            Post Notification
          </button>
          <div className="space" style={{ marginBottom: "10%" }} />
        </div>
        <div className="flex-container-1" />
      </div>
    ) : (
      <Redirect to="/home" />
    );
  }
}

export default Notifications;
