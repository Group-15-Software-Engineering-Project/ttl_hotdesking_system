import React from "react";
import { getDifferenceInDays } from "./Misc";
import { Link } from "react-router-dom";

export const AppointmentBookingsTable = ({ appointments: data = [] }) => {
    let appointments = data.filter((x) => getDifferenceInDays(new Date(), new Date(x.start)) <= 0);
    return appointments.length > 0 ? (
        <div style={{ marginRight: "2.5%" }}>
            <div className='bookings-table' style={{ border: "none", pointerEvents: "none" }}>
                <span
                    className='booking-history'
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
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "3",
                    }}>
                    Meeting Room
                </span>
                <span
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "2",
                    }}>
                    Date
                </span>
                <span
                    className='booking-history'
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
            {appointments.map((data, i) => {
                return i < 3 ? <AppointmentBooking data={data} /> : null;
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
            <div className='space' />
            <Link to='/book-meeting-room'>
                <button className='button-style no-outline'>{"Book a Meeting"}</button>
            </Link>
        </div>
    );
};

const AppointmentBooking = ({ data }) => {
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
                className='booking-history'
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
                className='booking-history'
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
                className='booking-history'
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
    let displayDate = date.split(" ")[2] + " " + date.split(" ")[1] + " " + date.split(" ")[3];
    return (
        <Link to='/past-bookings' style={{ textDecoration: "none", color: "black" }}>
            <button
                className='bookings-table'
                onClick={() => {}}
                style={{
                    backgroundColor: bg.backgroundColor,
                    "--hover-background": isUpcoming > 0 ? "#eee" : "#ddf8ff",
                    "--cursor": isUpcoming < 1 ? "pointer" : "normal",
                }}>
                <div style={{ width: "100%", marginBottom: "1%" }} />
                {status}

                <span
                    className='ellipsis booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "3",
                    }}>{`${data.roomName}`}</span>
                <span
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "2",
                    }}>
                    {displayDate}
                </span>
                <span
                    className='booking-history'
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
