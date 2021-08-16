import React, { useState, useEffect } from "react";
import "../public/css/booking.css";
import "../public/css/main.css";
import { getDifferenceInDays, months, verify } from "../Components/Misc";
import { Redirect, Link } from "react-router-dom";
import PillSlider from "../Components/PillSlider";

function Restrictions() {
    const [todayDate, setDate] = useState(null);
    const [isCancelling, toggleCancelMode] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [view, setView] = useState("off");
    const verified = verify(true) || verify(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        let date = new Date();
        setDate(date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());
        getAppointments();
    }, []);

    const getBookingIndex = (source, booking) => {
        console.log(source);
        for (let index = 0; index < source.length; index++) {
            let currentBooking = source[index];
            if (
                currentBooking.user === booking.user &&
                currentBooking.desk === booking.desk &&
                currentBooking.date === booking.date &&
                currentBooking.room === booking.room &&
                currentBooking.am === booking.am &&
                currentBooking.pm === booking.pm
            ) {
                return index;
            }
        }
        return -1;
    };

    //bookingToCancel is an exact copy of a booking returned from the backend.
    const submitCancelBooking = (bookingToCancel) => {
        fetch("/api/removeBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userEmail: bookingToCancel.userEmail,
                deskId: bookingToCancel.deskId,
                deskRoom: bookingToCancel.deskRoom,
                date: bookingToCancel.date,
                am: bookingToCancel.am,
                pm: bookingToCancel.pm,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                } else {
                    window.location.reload();
                }
            })
            .catch((err) => {});
    };

    const displayBooking = (data) => {
        let time =
            data.pm && !data.am
                ? "13:30 - 17:30"
                : data.am && !data.pm
                ? "09:00 - 13:00"
                : "09:00 - 17:30";
        let date = data.date.split("T")[0].split("-");
        let isUpcoming = todayDate - parseInt(date[0] + date[1] + date[2]);
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
        let displayDate = parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];
        return (
            <button
                disabled={!isCancelling || isUpcoming > 0}
                className="bookings-table"
                onClick={() => {
                    setTimeout(() => {
                        let displayTime =
                            data.am && !data.pm
                                ? "9:00 - 13:00"
                                : data.pm && !data.am
                                ? "13:30 - 17:30"
                                : "9:00 - 17:30";
                        let res = window.confirm(
                            `Are you sure you want to cancel the booking?\n\nLocation: ${data.deskRoom}\nDesk: ${data.deskId}\nDate: ${data.date}\nTime: ${displayTime}`
                        );
                        if (res) {
                            let currentData = JSON.parse(sessionStorage.bookings).data;

                            let index = getBookingIndex(currentData, data);
                            if (index !== -1) {
                                currentData.splice(index, 1);
                                sessionStorage.removeItem("bookings");
                                sessionStorage.setItem(
                                    "bookings",
                                    JSON.stringify({ isNull: false, data: currentData })
                                );
                                sessionStorage.removeItem("upcomingBookings");
                                submitCancelBooking(data);
                            }
                        }
                    }, 50);
                }}
                style={{
                    backgroundColor: bg.backgroundColor,
                    "--hover-background":
                        isUpcoming > 0 ? "#eee" : isCancelling ? "#ff6655" : "#ddf8ff",
                    "--cursor": isUpcoming < 1 && isCancelling ? "pointer" : "normal",
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
            </button>
        );
    };

    const displayDeskBookings = () => {
        return sessionStorage.bookings ? (
            JSON.parse(sessionStorage.bookings).data.length > 0 ? (
                <>
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
                            width: "96%",
                            marginLeft: "2%",
                        }}
                    />
                    {JSON.parse(sessionStorage.bookings).data.map((data) => {
                        return displayBooking(data);
                    })}
                </>
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
                    <Link to="/booking-page">
                        <button className="button-style no-outline">{"Book a Desk"}</button>
                    </Link>
                </div>
            )
        ) : (
            "Booking history not found. Try re-logging in if booking history should be present."
        );
    };

    const displayAppointmentBookings = () => {
        return appointments.length > 0 ? (
            <>
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
                        width: "96%",
                        marginLeft: "2%",
                    }}
                />
                {appointments.map((data) => {
                    return displayAppointment(data);
                })}
            </>
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
                <Link to="/booking-page">
                    <button className="button-style no-outline">{"Book a Desk"}</button>
                </Link>
            </div>
        );
    };

    const getAppointments = () => {
        fetch(`/api/getAppointments/${sessionStorage.email}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed getting appointments");
                else return res.json();
            })
            .then((data) => {
                setAppointments(data.appointments);
                displayAppointment(data.appointments[0]);
            })
            .catch(console.error);
    };
    const displayAppointment = (data) => {
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
            <button
                disabled={!isCancelling || isUpcoming > 0}
                className="bookings-table"
                onClick={() => {
                    setTimeout(() => {
                        let displayTime = time;

                        let res = window.confirm(
                            `Are you sure you want to cancel the booking?\n\nMeeting Room: ${data.roomName}\nDate: ${date}\nTime: ${displayTime}`
                        );
                        if (res) {
                            fetch(`/api/appointments/${data.id}`, {
                                method: "DELETE",
                            })
                                .then((res) => {
                                    if (!res.ok)
                                        throw new Error("Failed to delete appointment.");
                                    else {
                                        alert("Successfully deleted.");
                                        getAppointments();
                                    }
                                })
                                .catch(alert);
                        }
                    }, 50);
                }}
                style={{
                    backgroundColor: bg.backgroundColor,
                    "--hover-background":
                        isUpcoming > 0 ? "#eee" : isCancelling ? "#ff6655" : "#ddf8ff",
                    "--cursor": isUpcoming < 1 && isCancelling ? "pointer" : "normal",
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
        );
    };

    return verified ? (
        <div className="wrapper TCD-BG ">
            <div className="flex-container-1"></div>
            <div className="flex-container-5 main-body">
                <div className="space" />

                <h1
                    className="page-divider-header"
                    style={{ marginLeft: "2.5%", marginBottom: "2%" }}>
                    {view === "off"
                        ? "Restrictions for Desk Bookings"
                        : "Restrictions for Meeting Room Bookings"}
                </h1>
                <div
                    style={{
                        display: "flex",
                        alignText: "center",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <PillSlider
                        off="Desk Bookings Restrictions"
                        on="Meeting Room Bookings Restrictions"
                        onClick={(e) => setView(e)}
                    />
                </div>
                <div className="space" />

                <button
                    className="button-style no-outline"
                    style={{
                        "--bg-color": "#4dc300",
                        "--hover-highlight": "#5dE300",
                        marginBottom: "20px",
                    }}>
                    {"Add a Restriction"}
                </button>
                <button
                    className="button-style no-outline"
                    style={{
                        "--bg-color": isCancelling ? "#4dc300" : "#f32000",
                        "--hover-highlight": isCancelling ? "#5dE300" : "#ff5000",
                        marginBottom: "20px",
                    }}
                    onClick={() => toggleCancelMode(!isCancelling)}>
                    {isCancelling ? "Finish Cancelling" : "Cancel a Restriction"}
                </button>
                {view === "off" ? (
                    <div
                        style={{
                            display: "flex",
                            flexFlow: "row wrap",
                            justifyContent: "flex-start",
                        }}>
                        <div style={{ width: "100%", marginBottom: "2%" }} />
                        {displayDeskBookings()}
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexFlow: "row wrap",
                            justifyContent: "flex-start",
                        }}>
                        <div style={{ width: "100%", marginBottom: "2%" }} />
                        {displayAppointmentBookings()}
                    </div>
                )}
                <div className="space" />

                <div
                    style={{
                        marginTop: "2%",
                        width: "96%",
                        marginLeft: "2%",
                    }}
                />
            </div>
            <div className="flex-container-1"></div>
        </div>
    ) : (
        <Redirect to="/login" />
    );
}

export default Restrictions;
