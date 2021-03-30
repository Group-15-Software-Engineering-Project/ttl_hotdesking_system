
import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import '../public/css/booking.css'

function PastBookings({ email }) {
  const [bookings, setData] = useState(null);
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

  if (bookings) {
     return (
      <div>
            {bookings.data.map((book, index)=>{
            return <div >
             <h1 className='messageList Date' style={{position: 'absolute',fontSize:30}}>{book.DESK}</h1>
            <h2 className='messageList Time' style={{position:'absolute', left:150,fontSize:30}}>{book.DATE.split('T')[0]}</h2>
            <h3 className='messageList Time' style={{position:'absolute', left:400,fontSize:30}}>{book.DATE.split('T')[1].split('.')[0]}</h3>
            <h3 className='messageList Time' style={{position:'absolute', left:630,fontSize:30}}>{book.ROOM}</h3>
            <h4 className='messageList Message' style={{position: 'relative', marginBottom:50,left:1030,fontSize:30}}>{book.AM == '1'? <h5>9:00 am to 12:00pm</h5>:<h5>1:00 am to 4:00pm</h5>}</h4> 
            <hr></hr>
            </div>
            })}
            </div>
     );}
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
