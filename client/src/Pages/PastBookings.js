import React, { useState, useEffect } from "react";
import "../public/css/booking.css";
import "../public/css/main.css";
import { months, _GetUserBookings } from "../Components/Misc";

function PastBookings() {
  const [todayDate, setDate] = useState(null);

  useEffect(async () => {
    window.scrollTo(0, 0);
    let date = new Date();
    setDate(date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());

    if (!sessionStorage.bookings) _GetUserBookings();
  }, []);

  const displayBooking = (data) => {
    let time =
      data.PM && !data.AM
        ? "13:30 - 17:30"
        : data.AM && !data.PM
        ? "09:00 - 13:00"
        : "09:00 - 17:30";
    let date = data.DATE.split("T")[0].split("-");
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
          }}
        >
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
          }}
        >
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
    let displayDate = parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];
    return (
      <div className="bookings-table" style={bg}>
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
    );
  };
  return (
    <div className="wrapper TCD-BG ">
      <div className="flex-container-1"></div>
      <div className="flex-container-5 main-body">
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ width: "100%", marginBottom: "2%" }} />
          {sessionStorage.bookings ? (
            JSON.parse(sessionStorage.bookings).data ? (
              <>
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
                    width: "96%",
                    marginLeft: "2%",
                  }}
                />
                {JSON.parse(sessionStorage.bookings).data.map((data) => {
                  return displayBooking(data);
                })}
              </>
            ) : (
              "Booking history not found. If booking history should be present, please wait 10 seconds and re-login if the problem persists."
            )
          ) : (
            "Booking history not found. If booking history should be present, please wait 10 seconds and re-login if the problem persists."
          )}
        </div>
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
  );
}

export default PastBookings;
