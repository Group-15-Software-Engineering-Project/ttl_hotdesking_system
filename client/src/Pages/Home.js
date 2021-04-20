import React from "react";
import "../public/css/main.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { months, _GetUserBookings, verify } from "../Components/Misc";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayDate: null,
      bookings: [],
      notifs: [
        {
          type: "normal",
          date: "16 Apr 2021",
          title: "The system is finally live.", //"The system is live!",
          text: "The Trinity Hot-Desking system is live!",
        },
        {
          type: "important",
          date: "15 Apr 2021",
          title: "Changes to bookings.",
          text:
            "Due to high demand for desks in Front square, from next week on, the booking limit for Front square offices will be decreased by 1 per person. Teams wanting to book desks at Front Square will be restricted to only 1 booking per week." +
            " Teams which require multiple bookings for any valid reason in Front Square may contact Stephanie for the bookings to be manually made by the admin.",
        },
        {
          type: "restrictions",
          date: "15 Apr 2021",
          title: "Team SCSS",
          text: "SCSS team will not be able to make bookings in the upcoming week.",
        },
        {
          type: "news",
          date: "14 Apr 2021",
          title: "New location added.",
          text: "Bookings can now be made for Office 2.5 at Front Square.",
        },
      ],
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
      if (!sessionStorage.upcomingBookings || !sessionStorage.bookings) {
        _GetUserBookings(this);
      }
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
          className="booking-history"
          style={{
            textAlign: "left",
            marginLeft: "5px",
            color: "#3ABF00",
            fontWeight: "bold",
            flex: "1.5",
            maxWidth: "16.5%",
          }}
        >
          Upcoming
        </span>
      ) : (
        <span
          className="booking-history"
          style={{
            textAlign: "left",
            color: "red",
            marginLeft: "5px",
            fontWeight: "bold",
            maxWidth: "16.5%",
            flex: "1.5",
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
        <div
          className="bookings-table"
          style={{ backgroundColor: bg.backgroundColor, "--hover-background": "#ddf8ff" }}
        >
          <div style={{ width: "100%", marginBottom: "1%" }} />
          {status}
          <span
            className="booking-history"
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "1",
            }}
          >
            {"" + data.DESK}
          </span>
          <span
            className="ellipsis booking-history"
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "3",
            }}
          >{`${data.ROOM}`}</span>
          <span
            className="booking-history"
            style={{
              textAlign: "left",
              fontWeight: "bold",
              flex: "2",
            }}
          >
            {displayDate}
          </span>
          <span
            className="booking-history"
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

  displayNotifications = (notif) => {
    let color =
      notif.type === "important"
        ? "#ff0000"
        : notif.type === "normal"
        ? "#008dd3"
        : notif.type === "news"
        ? "#5ddd00"
        : notif.type === "restrictions"
        ? "#ffdd00"
        : "#eee";

    return (
      <div className="notif-box" style={{ "--grad-color": `${color}` }}>
        <div
          style={{
            display: "block",
            textAlign: "left",
            paddingLeft: "10px",
            width: "100%",
          }}
        >
          <div
            className="ellipsis"
            style={{
              display: "inline",
              fontSize: "clamp(0.6rem, 2vw, 1rem)",
            }}
          >
            <span
              style={{
                width: "10%",
                fontWeight: "700",
                paddingRight: "2%",
                marginRight: "2%",
                overflow: "hidden",
                wordWrap: "break-word",
                //borderRight: "1px dotted #555",
              }}
            >
              {notif.date}
            </span>
            <span
              style={{
                width: "95%",
                fontWeight: "bolder",
              }}
            >
              {notif.title}
            </span>
          </div>

          <div
            style={{
              marginLeft: "-1%",
              //borderBottom: "1px dotted #555",
              width: "101.1%",
              marginBottom: "10px",
            }}
          />
          <p style={{ width: "95%", marginBottom: "10px" }}>{notif.text}</p>
        </div>
      </div>
    );
  };

  render() {
    return verify(true) || verify(false) ? (
      <div key={this.state.key} className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <h1 style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}>{`Welcome back, ${
            sessionStorage.username !== "null" ? sessionStorage.username : sessionStorage.email
          }!`}</h1>
          <div
            style={{
              width: "45%",
              borderTop: "2px solid #444",
              marginLeft: "27.5%",
              marginTop: "1%",
            }}
          />
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <Link to="/booking-page">
            <button className="button-style no-outline">{"Book a Desk"}</button>
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
                className="bookings-table"
                style={{ border: "none", pointerEvents: "none" }}
              >
                <span
                  className="booking-history"
                  style={{
                    textAlign: "left",
                    marginLeft: "5px",
                    fontWeight: "bold",
                    maxWidth: "16.5%",
                    flex: "1.25",
                  }}
                >
                  Status
                </span>
                <span
                  className="booking-history"
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "1.25",
                  }}
                >
                  Desk No.
                </span>
                <span
                  className="booking-history"
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "3",
                  }}
                >
                  Location
                </span>
                <span
                  className="booking-history"
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "2",
                  }}
                >
                  Date
                </span>
                <span
                  className="booking-history"
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "2",
                  }}
                >
                  Time
                </span>
                <div style={{ width: "100%", marginTop: "2%" }} />
              </div>
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
            <h1 style={{ fontSize: "1.5rem" }}>You have no upcoming bookings.</h1>
          )}
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <div style={{ borderTop: "1px #ccc solid" }} />
          <div style={{ width: "100%", marginBottom: "3%" }} />
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            Notifications
          </h1>
          <div className="space" />
          {sessionStorage.notifications
            ? JSON.parse(sessionStorage.notifications).data.map((n) => {
                return this.displayNotifications(n);
              })
            : null}
          <div className="space" />
        </div>
        <div className="flex-container-1" />
      </div>
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default Home;
