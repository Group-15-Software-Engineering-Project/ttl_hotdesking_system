import React from "react";
import { getDifferenceInDays } from "./Misc";
import { Link } from "react-router-dom";

export const DeskBookingsTable = ({ bookings: data = [] }) => {
    let bookings = data.filter((x) => getDifferenceInDays(new Date(), new Date(x.date)) <= 0);
    if (bookings.length === 0) return <h2>There are currently no desk bookings.</h2>;
    return (
        <div style={{ marginRight: "2.5%" }}>
            <div className='bookings-table' style={{ border: "none", pointerEvents: "none" }}>
                <span
                    className='booking-history'
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
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "1.25",
                    }}>
                    Desk No.
                </span>
                <span
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "3",
                    }}>
                    Location
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
            {bookings.map((x, i) => {
                return i < 3 ? <DisplayBooking booking={x} key={i} /> : null;
            })}
        </div>
    );
};

const DisplayBooking = ({ booking: data }) => {
    let time = data.pm && !data.am ? "13:30 - 17:30" : data.am && !data.pm ? "09:00 - 13:00" : "09:00 - 17:30";
    let isUpcoming = getDifferenceInDays(new Date(), new Date(data.date));

    let displayDate = new Date(data.date).toDateString();
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

    return (
        <Link to='/past-bookings' style={{ textDecoration: "none", color: "black" }}>
            <div
                className='bookings-table'
                style={{
                    backgroundColor: bg.backgroundColor,
                    "--hover-background": "#ddf8ff",
                }}>
                <div style={{ width: "100%", marginBottom: "1%" }} />
                {status}
                <span
                    className='booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "1",
                    }}>
                    {"" + data.deskId}
                </span>
                <span
                    className='ellipsis booking-history'
                    style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "3",
                    }}>{`${data.deskRoom}`}</span>
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
            </div>
        </Link>
    );
};
