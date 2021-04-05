import React from "react";
import "../public/css/main.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { createUniqueID, months, _GetUserBookings } from "../Components/Misc";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayDate: null,
      bookings: [],
    };
  }

  componentDidMount = () => {
    if (sessionStorage.email) {
      window.scrollTo(0, 0);
      let date = new Date();
      this.setState({
        todayDate: date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate(),
      });
      if (sessionStorage.upcomingBookings)
        this.setState({ bookings: JSON.parse(sessionStorage.upcomingBookings).data });
      if (!sessionStorage.bookings || this.state.bookings.length === 0) _GetUserBookings(this);
    }
  };

  displayBooking = (data) => {
    let time =
      data.PM && !data.AM
        ? "13:30 - 17:30"
        : data.AM && !data.PM
        ? "09:00 - 13:00"
        : "09:00 - 17:30";
    let date = data.DATE.split("T")[0].split("-");
    let isUpcoming = this.state.todayDate - parseInt(date[0] + date[1] + date[2]);
    let displayDate = parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];
    let status =
      isUpcoming < 0 ? (
        <span
          style={{
            textAlign: "left",
            marginLeft: "5px",
            color: "#3ABF00",
            fontWeight: "bold",
            flex: "2",
            maxWidth: "16.5%",
          }}
        >
          Upcoming
        </span>
      ) : (
        <span
          style={{
            textAlign: "left",
            color: "red",
            marginLeft: "5px",
            fontWeight: "bold",
            maxWidth: "16.5%",
            flex: "2",
          }}
        >
          Today
        </span>
      );
    let bg =
      isUpcoming > 0
        ? {
            backgroundColor: "#eee",
          }
        : isUpcoming === 0
        ? {
            backgroundColor: "#FFFEAA",
          }
        : {
            backgroundColor: "white",
          };

    return (
      <Link to="/past-bookings" style={{ textDecoration: "none", color: "black" }}>
        <div className="bookings-table" style={bg}>
          <div style={{ width: "100%", marginBottom: "1%" }} />
          {status}
          <span
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "1",
            }}
          >
            {"Desk " + data.DESK}
          </span>
          <span
            className="ellipsis"
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "3",
            }}
          >{`${data.ROOM}`}</span>
          <span
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "2",
            }}
          >
            {displayDate}
          </span>
          <span
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "2",
            }}
          >
            {time}
          </span>
          <div style={{ width: "100%", marginBottom: "1%" }} />
        </div>
      </Link>
    );
  };

  render() {
    return (
      <div key={this.state.key} className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <h1 style={{ fontSize: "32px" }}>{`Welcome back, ${
            sessionStorage.__user_is_admin__ ? "Stephanie" : sessionStorage.email
          }!`}</h1>
          <div style={{ width: "100%", marginBottom: "3%" }} />

          <Link to="/booking-page">
            <button className="button-style">{"Book a Desk"}</button>
          </Link>
          <div
            style={{
              width: "100%",
              marginBottom: "5%",
            }}
          />
          <div style={{ borderTop: "1px #ccc solid" }} />
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            Current Bookings
          </h1>
          <div style={{ width: "100%", marginBottom: "3%" }} />
          {this.state.bookings.length !== 0 ? (
            <div style={{ marginRight: "2.5%" }}>
              <div
                style={{
                  borderBottom: "1px solid #ccc",
                  width: "98%",
                  marginLeft: "2%",
                }}
              />
              {this.state.bookings.map((x) => {
                return this.displayBooking(x);
              })}
            </div>
          ) : (
            <h1>There are no upcoming bookings.</h1>
          )}
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <div style={{ borderTop: "1px #ccc solid" }} />
          <div style={{ width: "100%", marginBottom: "3%" }} />

          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            Notifications
          </h1>
          <div className="space" />
          <div
            style={{
              border: "1px solid #ccc",
              textAlign: "left",
              width: "90%",
              marginLeft: "5%",
            }}
          >
            <span
              style={{ color: "red", marginLeft: "5%", marginRight: "5%", fontWeight: "bold" }}
            >
              Important!
            </span>
            {/* <div className="space" style={{ marginBottom: "1%" }} /> */}
            <span style={{ margin: "0" }}>The Trinity Hotdesking Pilot is live!</span>
          </div>
        </div>
        <div className="flex-container-1" />
      </div>
    );
  }
}

export default Home;
