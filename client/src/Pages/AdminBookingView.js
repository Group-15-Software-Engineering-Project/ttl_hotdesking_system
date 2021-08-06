import React from "react";
import { verify } from "../Components/Misc";
import { Redirect } from "react-router";

export default class AdminBookingView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenDate: new Date(),
            bookings: []
        };
    }

    componentDidMount() {
        let today = (new Date()).toISOString();
        fetch(`/api/getBookingsOnDate/${today}`)
        .then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch bookings on this date (status:${res.status})`);
            return res.json();
        })
        .then((data) => this.setState({bookings: data.bookings}))
        .catch((err) => console.error(err));
    }

    render() {
        return verify(true) || verify(false) ? (
            <div></div>
        ) : (
            <Redirect to="/login" />
        );
    }
}