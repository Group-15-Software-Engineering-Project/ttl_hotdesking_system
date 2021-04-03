import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import "../public/css/booking.css";
import "../public/css/main.css";
import { months } from "../Components/Misc";

function PastBookings({ email }) {
  const [bookings, setData] = useState(null);
  const [todayDate, setDate] = useState(null);
  //email= "foo@bar.com";
  console.log(email);
  useEffect(() => {
    let date = new Date();
    setDate(
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    );
    fetch("/api/getBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        let data = res.data;
        let today =
          date.getFullYear() * 10000 +
          (date.getMonth() + 1) * 100 +
          date.getDate();
        let index = 0;
        for (let key in data) {
          console.log(data[key]);
          let bookingDateComponents = data[key].DATE.split("T")[0].split("-");
          let bookingDate =
            parseInt(bookingDateComponents[0]) * 10000 +
            parseInt(bookingDateComponents[1]) * 100 +
            parseInt(bookingDateComponents[2]);
          if (today - bookingDate > 0) break;
          index++;
        }
        for (let i = 0; i < Math.floor(index / 2); i++) {
          let temp = data[i];
          data[i] = data[index - 1 - i];
          data[index - 1 - i] = temp;
        }
        setData({ data: data });
      });
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
      ) : isUpcoming > 0 ? (
        <span
          style={{
            textAlign: "left",
            marginLeft: "5px",
            color: "#555",
            fontWeight: "bold",
            flex: "2",
            maxWidth: "16.5%",
          }}
        >
          Previous
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
    let displayDate =
      parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];
    return (
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
          {bookings ? (
            <>
              <div
                className="bookings-table"
                style={{ border: "none", pointerEvents: "none" }}
              >
                <span
                  style={{
                    textAlign: "left",
                    marginLeft: "5px",
                    fontWeight: "bold",
                    maxWidth: "16.5%",
                    flex: "2",
                  }}
                >
                  Status
                </span>
                <span
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "1",
                  }}
                >
                  Desk No.
                </span>
                <span
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "3",
                  }}
                >
                  Location
                </span>
                <span
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                    flex: "2",
                  }}
                >
                  Date
                </span>
                <span
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
              {bookings.data.map((data) => {
                return displayBooking(data);
              })}
            </>
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

/*class PastBookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
    };

  }
  componentDidMount(){
    this.getPastBookings();

  }

  getPastBookings = () => {
      console.log(this.props.email);
    fetch("/api/getBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.props.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({ bookings: res.data});
      })
      .catch((err) => alert(err));
  };


  render() {
      console.log(this.state.bookings)
    return (
      <div className="pastBookings" >
        <h1> Past Bookings</h1>
        <li>{this.state.bookings.USER}</li>
      </div>
    );
  }
}*/

export default PastBookings;
