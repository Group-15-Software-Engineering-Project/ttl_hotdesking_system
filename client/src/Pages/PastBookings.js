import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
function PastBookings({ email }) {
  const [data, setData] = useState(null);
//email= "foo@bar.com";
console.log(email);
  useEffect(() => {
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

  if (data) {
    return (
      <div>
        <p>{JSON.stringify(data)}</p>
      </div>
    );
  }
  return (
    <div>
      <h1>Past Bookings</h1>
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
