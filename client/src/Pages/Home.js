import React from "react";
import "../public/css/main.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { months, verify, getDifferenceInDays } from "../Components/Misc";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todayDate: null,
            bookings: [],
            notifs: [],
            appointments: [],
        };
        this.headingRef = React.createRef();
    }

    componentDidMount = () => {
        if (sessionStorage.email) {
            window.scrollTo(0, 0);
            let date = new Date();
            this.setState({
                todayDate:
                    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate(),
            });
            this.getNotifications();
            this.getBookings();
            this.getAppointments();
        }
        window.addEventListener("resize", () => {
            this.forceUpdate();
        });
    };

    getBookings = () => {
        fetch(`/api/getBookings/${sessionStorage.email}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed fetching user bookings");
                return res.json();
            })
            .then((res) => {
                let bookings = res.data.filter(
                    (booking) =>
                        !(
                            new Date(booking.date).getFullYear() <= new Date().getFullYear() &&
                            new Date(booking.date).getMonth() <= new Date().getMonth() &&
                            new Date(booking.date).getDate() < new Date().getDate()
                        )
                );
                this.setState({ bookings: bookings });
            })
            .catch(console.error);
    };
    getAppointments = () => {
        fetch(`/api/getAppointments/${sessionStorage.email}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed fetching user meeting room bookings");
                return res.json();
            })
            .then((res) => {
                let bookings = res.appointments.filter(
                    (booking) =>
                        !(
                            new Date(booking.start).getFullYear() <=
                                new Date().getFullYear() &&
                            new Date(booking.start).getMonth() <= new Date().getMonth() &&
                            new Date(booking.start).getDate() < new Date().getDate()
                        )
                );
                this.setState({ appointments: bookings });
            })
            .catch(console.error);
    };

    getNotifications = () => {
        fetch("/api/getNotifications")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    console.error("Could not load Notifications");
                } else {
                    this.setState({ notifs: res.notifications });
                }
            })
            .catch(console.error);
    };

    getGreeting = () => {
        let time = new Date();
        if (time.getHours() > 4 && time.getHours() < 12) return "Good morning";
        else if (time.getHours() > 11 && time.getHours() < 19) return "Good afternoon";
        else if (time.getHours() > 18 && time.getHours() <= 23) return "Good evening";
        else return "Welcome";
    };
    displayBooking = (data) => {
        let time =
            data.pm && !data.am
                ? "13:30 - 17:30"
                : data.am && !data.pm
                ? "09:00 - 13:00"
                : "09:00 - 17:30";
        let date = data.date.split("T")[0].split("-");
        let isUpcoming = this.state.todayDate - parseInt(date[0] + date[1] + date[2]);
        if (isUpcoming > 0) return null;
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
                    }}>
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
                    }}>
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
                    style={{
                        backgroundColor: bg.backgroundColor,
                        "--hover-background": "#ddf8ff",
                    }}>
                    <div style={{ width: "100%", marginBottom: "1%" }} />
                    {status}
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "1",
                        }}>
                        {"" + data.deskId}
                    </span>
                    <span
                        className="ellipsis booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "3",
                        }}>{`${data.deskRoom}`}</span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        {displayDate}
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        {time}
                    </span>
                    <div style={{ width: "100%", marginBottom: "1%" }} />
                </div>
            </Link>
        );
    };

    displayNotifications = (notif) => {
        let date = notif.date.split("-");
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
                    }}>
                    <div
                        className="ellipsis"
                        style={{
                            display: "inline",
                            fontSize: "clamp(0.6rem, 2vw, 1rem)",
                        }}>
                        <span
                            style={{
                                width: "10%",
                                fontWeight: "700",
                                paddingRight: "2%",
                                marginRight: "2%",
                                overflow: "hidden",
                                wordWrap: "break-word",
                                //borderRight: "1px dotted #555",
                            }}>
                            {parseInt(date[2]) +
                                " " +
                                months[parseInt(date[1]) - 1] +
                                " " +
                                date[0]}
                        </span>
                        <span
                            style={{
                                width: "95%",
                                fontWeight: "bolder",
                            }}>
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
                    <p style={{ width: "95%", marginBottom: "10px" }}>{notif.body}</p>
                </div>
            </div>
        );
    };

    displayDeskBookings = () => {
        return (
            <div style={{ marginRight: "2.5%" }}>
                <div
                    className="bookings-table"
                    style={{ border: "none", pointerEvents: "none" }}>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            marginLeft: "5px",
                            fontWeight: "bold",
                            maxWidth: "16.5%",
                            flex: "1.25",
                        }}>
                        Status
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "1.25",
                        }}>
                        Desk No.
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "3",
                        }}>
                        Location
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        Date
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
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
                {this.state.bookings.map((x, i) => {
                    return i < 3 ? this.displayBooking(x) : null;
                })}
            </div>
        );
    };

    displayAppointment = (data) => {
        let time =
            new Date(data.start).getHours() +
            ":" +
            String(new Date(data.start).getMinutes()).padStart(2, "0") +
            " - " +
            new Date(data.end).getHours() +
            ":" +
            String(new Date(data.end).getMinutes()).padStart(2, "0");

        let date = new Date(data.start).toDateString();
        let isUpcoming = getDifferenceInDays(new Date(), new Date(data.start));

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
                    }}>
                    Upcoming
                </span>
            ) : isUpcoming > 0 ? (
                <span
                    className="booking-history"
                    style={{
                        textAlign: "left",
                        marginLeft: "5px",
                        color: "#555",
                        fontWeight: "bold",
                        flex: "1.5",
                        maxWidth: "16.5%",
                    }}>
                    Previous
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
                    }}>
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
        let displayDate =
            date.split(" ")[2] + " " + date.split(" ")[1] + " " + date.split(" ")[3];
        return (
            <Link to="/past-bookings" style={{ textDecoration: "none", color: "black" }}>
                <button
                    className="bookings-table"
                    onClick={() => {}}
                    style={{
                        backgroundColor: bg.backgroundColor,
                        "--hover-background": isUpcoming > 0 ? "#eee" : "#ddf8ff",
                        "--cursor": isUpcoming < 1 ? "pointer" : "normal",
                    }}>
                    <div style={{ width: "100%", marginBottom: "1%" }} />
                    {status}

                    <span
                        className="ellipsis booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "3",
                        }}>{`${data.roomName}`}</span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        {displayDate}
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        {time}
                    </span>
                    <div style={{ width: "100%", marginBottom: "1%" }} />
                </button>
            </Link>
        );
    };

    displayAppointmentBookings = () => {
        return this.state.appointments.length > 0 ? (
            <div style={{ marginRight: "2.5%" }}>
                <div
                    className="bookings-table"
                    style={{ border: "none", pointerEvents: "none" }}>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            marginLeft: "5px",
                            marginRight: "16px",
                            fontWeight: "bold",
                            maxWidth: "16.5%",
                            flex: "1.25",
                        }}>
                        Status
                    </span>

                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "3",
                        }}>
                        Meeting Room
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
                        Date
                    </span>
                    <span
                        className="booking-history"
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            flex: "2",
                        }}>
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
                {this.state.appointments.map((data, i) => {
                    return i < 3 ? this.displayAppointment(data) : null;
                })}
            </div>
        ) : (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "column",
                }}>
                <h2>You have made no bookings yet.</h2>
                <div className="space" />
                <Link to="/book-meeting-room">
                    <button className="button-style no-outline">{"Book a Meeting"}</button>
                </Link>
            </div>
        );
    };

    render() {
        return verify(true) || verify(false) ? (
            <div key={this.state.key} className="wrapper TCD-BG">
                <div className="flex-container-1" />
                <div className="flex-container-5 main-body">
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <h1
                        ref={this.headingRef}
                        style={{
                            display: "inline-block",
                            fontSize: "clamp(1.25rem, 3vw, 2rem)",
                        }}>{`${this.getGreeting()}, ${
                        sessionStorage.username !== "null"
                            ? sessionStorage.username
                            : sessionStorage.email
                    }!`}</h1>
                    <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                        <div
                            style={{
                                width: ` ${
                                    this.headingRef.current
                                        ? this.headingRef.current.offsetWidth * 1.1 + "px"
                                        : "45%"
                                }`,
                                borderTop: "2px solid #444",
                                marginTop: "1%",
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <Link tabindex="-1" to="/booking-page">
                        <button className="button-style no-outline">{"Book a Desk"}</button>
                    </Link>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <Link tabindex="-1" to="/book-meeting-room">
                        <button className="button-style no-outline">{"Book a Meeting"}</button>
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
                        Current Desk Bookings
                    </h1>
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    {this.state.bookings.length !== 0 ? (
                        <div>{this.displayDeskBookings()}</div>
                    ) : (
                        <h2>You have no upcoming bookings.</h2>
                    )}
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <div style={{ borderTop: "1px #ccc solid" }} />
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                        Current Meeting Room Bookings
                    </h1>
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    {this.state.appointments.length !== 0 ? (
                        <div>{this.displayAppointmentBookings()}</div>
                    ) : (
                        <h2>You have no upcoming bookings.</h2>
                    )}
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <div style={{ borderTop: "1px #ccc solid" }} />
                    <div style={{ width: "100%", marginBottom: "3%" }} />
                    <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                        Notifications
                    </h1>
                    <div className="space" />
                    {this.state.notifs.length > 0 ? (
                        this.state.notifs.map((n) => {
                            return this.displayNotifications(n);
                        })
                    ) : (
                        <h2>*cricket noises*</h2>
                    )}
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
