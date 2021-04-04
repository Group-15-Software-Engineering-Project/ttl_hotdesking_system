import React from "react";
import "../public/css/main.css";
import { Link } from "react-router-dom";
import { createUniqueID, months } from "../Components/Misc";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingBookings: [],
      todayDate: null,
      key: "default",
      loaded: false,
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
    let date = new Date();
    this.setState({
      todayDate:
        date.getFullYear() * 10000 +
        (date.getMonth() + 1) * 100 +
        date.getDate(),
    });

    fetch("/api/getBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.props.email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let data = res.data;
        console.log("RES", res.data);

        let today =
          date.getFullYear() * 10000 +
          (date.getMonth() + 1) * 100 +
          date.getDate();
        let index = 0;
        for (let key in data) {
          let bookingDateComponents = data[key].DATE.split("T")[0].split("-");
          let bookingDate =
            parseInt(bookingDateComponents[0]) * 10000 +
            parseInt(bookingDateComponents[1]) * 100 +
            parseInt(bookingDateComponents[2]);
          if (today - bookingDate > 0) break;
          index++;
        }
        let bookings = [];
        for (let i = index - 1; i >= index - 3 && i >= 0; i--) {
          if (data[i]) bookings.push(data[i]);
        }
        this.setState({
          key: createUniqueID(),
          upcomingBookings: bookings,
          email: this.props.email,
        });
      })
      .catch((err) => console.log(err));
  };

  displayBooking = (data) => {
    let time =
      data.PM && !data.AM
        ? "13:30 - 17:30"
        : data.AM && !data.PM
        ? "09:00 - 13:00"
        : "09:00 - 17:30";
    let date = data.DATE.split("T")[0].split("-");
    let isUpcoming =
      this.state.todayDate - parseInt(date[0] + date[1] + date[2]);
    let displayDate =
      parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];
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
      <Link
        to="/past-bookings"
        style={{ textDecoration: "none", color: "black" }}
      >
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
          <h1
            style={{ fontSize: "32px" }}
          >{`Welcome back, ${this.props.email}!`}</h1>
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
          {this.state.upcomingBookings.length !== 0 ? (
            <div style={{ marginRight: "2.5%" }}>
              <div
                style={{
                  borderBottom: "1px solid #ccc",
                  width: "98%",
                  marginLeft: "2%",
                }}
              />
              {this.state.upcomingBookings.map((x) => {
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
        </div>
        <div className="flex-container-1" />
      </div>
    );
  }
}

export default Home;