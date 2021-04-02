import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import "../public/css/booking.css";
import "../public/css/main.css";

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
      .then(setData);
  }, []);

  // if (bookings) {
  //   console.log(bookings);
  //   return (
  //     <div>
  //       {bookings.data.map((book, index) => {
  //         return (
  //           <div>
  //             <h1
  //               className="messageList Date"
  //               style={{ position: "absolute", fontSize: 30 }}
  //             >
  //               {book.DESK}
  //             </h1>
  //             <h2
  //               className="messageList Time"
  //               style={{ position: "absolute", left: 150, fontSize: 30 }}
  //             >
  //               {book.DATE.split("T")[0]}
  //             </h2>
  //             {/* <h3 className='messageList Time' style={{position:'absolute', left:400,fontSize:30}}>{book.DATE.split('T')[1].split('.')[0]}</h3> */}
  //             <h3
  //               className="messageList Time"
  //               style={{ position: "absolute", left: 630, fontSize: 30 }}
  //             >
  //               {book.ROOM}
  //             </h3>
  //             <h4
  //               className="messageList Message"
  //               style={{
  //                 position: "relative",
  //                 marginBottom: 50,
  //                 left: 1030,
  //                 fontSize: 30,
  //               }}
  //             >
  //               {book.AM == "1" ? (
  //                 <h5>9:00 am to 12:00pm</h5>
  //               ) : (
  //                 <h5>1:00 am to 4:00pm</h5>
  //               )}
  //             </h4>
  //             <hr></hr>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
  // return (
  //   <div>
  //     <h1>Past Bookings</h1>
  //   </div>
  // );
  const displayBooking = (data, index) => {
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
            // width: "15%",
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
            // width: "15%",
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
            // width: "15%",
            flex: "2",
          }}
        >
          Today
        </span>
      );
    let bg =
      isUpcoming > 0
        ? {
            width: "100%",
            marginBottom: "1%",
            backgroundColor: "white",
          }
        : {
            width: "100%",
            marginBottom: "1%",
            backgroundColor: "#ddd",
          };
    return (
      <div
        className="bookings-table"
        style={{ backgroundColor: isUpcoming > 0 ? "#eee" : null }}
      >
        <div style={bg} />
        {status}
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            //width: "10%",
            flex: "1",
          }}
        >
          {"Desk " + data.DESK}
        </span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            // width: "27%",
            flex: "3",
          }}
        >{`${data.ROOM}`}</span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            // width: "18%",
            flex: "2",
          }}
        >{`${data.DATE.split("T")[0]}`}</span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            // width: "13%",
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
    <div className="wrapper">
      <div className="flex-container-1"></div>
      <div className="flex-container-5 main-body">
        <div
          style={{
            marginTop: "2%",
            borderBottom: "1px solid #ccc",
            width: "96%",
            marginLeft: "2%",
          }}
        />
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
          }}
        >
          {bookings
            ? bookings.data.map((data, index) => {
                return displayBooking(data, index);
              })
            : "FETCH ERROR: Booking history not found."}
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
