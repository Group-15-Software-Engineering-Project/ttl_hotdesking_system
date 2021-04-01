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
            color: "#3ABF00",
            fontWeight: "bold",
            width: "15%",
          }}
        >
          Upcoming
        </span>
      ) : isUpcoming > 0 ? (
        <span
          style={{
            textAlign: "left",
            color: "#555",
            fontWeight: "bold",
            width: "15%",
          }}
        >
          Previous
        </span>
      ) : (
        <span
          style={{
            textAlign: "left",
            color: "red",
            fontWeight: "bold",
            width: "15%",
          }}
        >
          Today
        </span>
      );
    const arr = [1, 2, 3, 4, 5];
    let temp = arr[3];
    delete arr[3];
    arr[3] = arr[0];
    arr[0] = temp;
    console.log(arr);

    return (
      <div className="bookings-table">
        <div style={{ width: "100%", marginBottom: "1%" }} />
        {status}
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            width: "12%",
          }}
        >
          {"Desk " + data.DESK}
        </span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            width: "30%",
          }}
        >{`${data.ROOM}`}</span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            width: "14%",
          }}
        >{`${data.DATE.split("T")[0]}`}</span>
        <span
          style={{
            textAlign: "left",
            fontWeight: "bold",
            width: "14%",
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
            : "My Bookings"}
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
