import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
import TileSelection from "../Components/TileSelection";

import "../public/css/main.css";

const adminPages = {
    options: [
        { value: "Manage Users" },
        { value: "Usage Reports" },
        { value: "View Bookings" },
        { value: "Manage Desks & Locations" },
        { value: "Post Notification" },
        { value: "Admin Options" },
    ],
    "Manage Users": "/users",
    "Usage Reports": "/reports",
    "View Bookings": "/AdminBookingView",
    "Manage Desks & Locations": "/locations",
    "Post Notification": "/notifications",
    "Admin Options": "/adminOptions",
};
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: props.email,
        };
    }

    render() {
        return verify(true) ? (
            <div className="wrapper TCD-BG">
                <div className="flex-container-1" />
                <div className="flex-container-5 main-body">
                    <div className="space" />
                    <TileSelection
                        elementID="Admin_operation_selection"
                        title={
                            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                                Admin Options
                            </h1>
                        }
                        options={adminPages.options}
                        size={["300px", "80px"]}
                        onSelect={(e) => (window.location = adminPages[e])}
                    />
                    <div className="space" />
                    <div />
                </div>

                <div className="flex-container-1" />
            </div>
        ) : (
            <Redirect to="/home" />
        );
    }
}

export default Admin;
