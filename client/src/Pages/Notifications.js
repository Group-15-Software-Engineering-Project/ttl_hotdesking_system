import React, { Component, createRef } from "react";
import { Redirect } from "react-router-dom";
import BookingCalendarNoLimit from "../Components/BookingCalendarNoLimit";
import { verify, months } from "../Components/Misc";

import "../public/css/main.css";
class Notifications extends Component {
    state = {
        title: "",
        text: "",
        type: -1,
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
        fetch("/api/addNotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: this.state.type,
                title: this.state.title,
                body: this.state.text,
                end: this.state.expiryDate,
            }),
        })
            .then((res) => {
                let result = res.json();
                if (result.error) {
                    alert("Error adding a notification");
                } else {
                    let notifs = JSON.parse(sessionStorage.notifications);
                    let date = String(new Date()).split(" ");
                    notifs.data.push({
                        type: this.state.type,
                        title: this.state.title,
                        body: this.state.text,
                        date: date[3] + "-" + (months.indexOf(date[1]) + 1) + "-" + date[2],
                    });
                    sessionStorage.setItem("notifications", JSON.stringify(notifs));
                    alert("Success");
                }
            })
            .catch((err) => {});
    };

    render() {
        return verify(true) ? (
            <div className="wrapper TCD-BG">
                <div className="flex-container-1" />
                <div className="flex-container-5 main-body">
                    <div className="space" />
                    <h1
                        className="page-divider-header"
                        style={{
                            marginLeft: "2.5%",
                        }}>
                        Post Notification
                    </h1>
                    <div className="space" />
                    <div
                        style={{
                            display: "flex",
                            flexFlow: "row wrap",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <select
                            className="text-input"
                            style={{ padding: "0", width: "15%", margin: "10px" }}
                            name="type"
                            onChange={this.handleEvent}>
                            <option value={-1}>Select notification type</option>
                            <option value="normal">General</option>
                            <option value="important">Important</option>
                            <option value="restrictions">Regarding Restrictions</option>
                            <option value="news">New Locations/Desks</option>
                        </select>

                        <input
                            id="title_id"
                            className="text-input"
                            placeholder="Notification title (max. 30 characters)"
                            type="text"
                            name="title"
                            style={{ overflowWrap: "before", width: "30%", margin: "10px" }}
                            autoComplete="none"
                            maxLength="30"
                            onChange={this.handleEvent}></input>
                    </div>
                    <textarea
                        className="text-input-bigger"
                        placeholder="Notification content (max. 1000 characters)"
                        type="text"
                        name="text"
                        style={{ padding: "20px" }}
                        autoComplete="none"
                        onChange={this.handleEvent}
                        maxLength="1000"></textarea>
                    <div className="space" />
                    <h1
                        className="page-divider-header"
                        style={{ width: "60%", marginLeft: "20%" }}>
                        Set Notification Expiry Date
                    </h1>
                    <BookingCalendarNoLimit
                        onSelect={(date) =>
                            this.setState({ expiryDate: date })
                        }></BookingCalendarNoLimit>
                    {this.state.expiryDate ? (
                        <h3
                            style={{
                                height: "2rem",
                            }}>{`Expiry Date: ${this.state.expiryDate}`}</h3>
                    ) : (
                        <div style={{ height: "2rem" }} />
                    )}
                    <div className="space" />
                    <button
                        disabled={
                            !(
                                this.state.type !== -1 &&
                                this.state.expiryDate &&
                                this.state.text
                            )
                        }
                        className="button-style no-outline"
                        onClick={() => this.submitNotification()}>
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
