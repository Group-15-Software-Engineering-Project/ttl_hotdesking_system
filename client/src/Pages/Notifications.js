import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import BookingCalendarNoLimit from "../Components/BookingCalendarNoLimit";

import "../public/css/main.css";
class Notifications extends Component {
  state = {
    title:"",
    text:"",
    type:"",
    expiryDate:"",
  };

  handleEvent = (e) =>{
    this.setState({[e.target.name]:e.target.value});
  }

  positionReference = createRef();

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  submitNotification = () =>
  {
    let date = new Date();
    let today = date.getFullYear() + "-" + String((date.getMonth()+1)).padStart(2, "0") + "-" + date.getDate();
    console.log(this.state.type, today, this.state.title, this.state.text);

    //api call here: to be stored as {type: this.state.type, date:today, title:this.state.title, text:this.state.text}
    fetch("/api/addNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: this.state.type,
        date: today,
        title: this.state.title,
        text: this.state.text,
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
              <div className="space" style={{ marginBottom: "5%", marginTop: "5%" }} />
              <input
                className="text-input"
                placeholder="Notification title"
                type="text"
                name="title"
                style={{overflowWrap:"before"}}
                autoComplete="none"
                maxLength="30"
                onChange={this.handleEvent}
              ></input>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <textarea
                className="text-input-bigger"
                placeholder="Notification content"
                type="text"
                name="text"
                autoComplete="none"
                onChange={this.handleEvent}
              ></textarea>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <select
                className="text-input"
                style={{ padding: "0", width: "25%" }}
                name="type"
                onChange={this.handleEvent}
              >
                <option value={-1}>Select type</option>
                <option value="normal">General</option>
                <option value="important">Important</option>
                <option value="restrictions">Restrictions</option>
                <option value="news">News</option>
              </select>
              <div className="space" style={{ marginTop: "5%", marginBottom: "5%" }} />
              <BookingCalendarNoLimit
                onSelect={
                  (date) => this.setState({expiryDate: date}, ()=>console.log(this.state.expiryDate))
                }
              ></BookingCalendarNoLimit>
              <button
                className="button-style no-outline"
                onClick={() => this.submitNotification()}
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
