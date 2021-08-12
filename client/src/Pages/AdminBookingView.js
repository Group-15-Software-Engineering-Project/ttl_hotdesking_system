import React, { usestate, Component, createRef }  from "react";
import "../public/css/booking.css";
import "../public/css/main.css";
import { months, verify } from "../Components/Misc";
import { Redirect } from "react-router";
import { Link } from "react-router-dom"

import BookingCalendarNoLimit from "../Components/BookingCalendarNoLimit";
import BookingCalendarAllTiles from "../Components/BookingCalendarAllTiles";



export default class AdminBookingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenDate: "",
      bookings: [],
      filteredBookings: [],
      data: [],
      slider: true,
      chosenBookings: [],
      isCancelling: false,
      location: [],
      chosenLocation: "overall",
      chosen: "",
      date: new Date(),
      todayDate: "",
      meetings: [],
      RestrictWeek: 1,
      dateResticted: false,
      AM: false,
      PM:false,
      email: sessionStorage.email,        
    };
  }
 

  getBookingsOnDate = async (date) => {
    
    {console.log("fetching Booking", this.state.email)}
    fetch(`/api/getBookingsOnDate/${date}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to fetch bookings on this date (status:${res.status})`
          );
        return res.json();
      })
      .then((data) => {
        this.setState({ bookings: data.bookings });
      })
      .catch((err) => console.error(err));
  };

  getBookingsByLocation = async (deskRoom) => {
    {console.log("fetching Booking for location", deskRoom)}
    fetch(`/api/getBookingsByLocation/${deskRoom}`)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to fetch bookings for this location (status:${res.status})`
          );
        return res.json();
      })
      .then((data) => {
        this.setState({ filteredBookings: data.bookings });
      })
      .catch((err) => console.error(err));
  };

  componentDidMount() {
    this.getBookingsOnDate();
  }

  submitRoomRestriction=()=>{
    fetch("/api/addRoomRestriction", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          email:this.state.email,
          room:this.state.chosenLocation,
          date:this.state.chosenDate,
          am:this.state.AM,
          pm:this.state.PM
      }),
    })
    .then((res)=>{
      if(!res.ok){
        throw new Error("Failed to add restriction")
      }
      else{
        alert("Success")
      }
    }
    )
.catch(console.error)
  }

  sortBookingsbyLocation = async() => {
    {
      this.setState({
        filteredBookings: this.state.bookings.filter((booking) =>
          this.state.chosenLocation.includes(booking.deskRoom)
        ),
      });
    }
    {
      console.log(this.state.bookings);
    }
    // {console.log(this.state.filteredBookings)}
  };


  checkRestriction = (date) => {
    {console.log("Checking restriction for date", date)}
    date = date.split("T")[0].split("-");
    let currentdate = new Date();
    this.state.todayDate =
      currentdate.getFullYear() * 10000 + (currentdate.getMonth() + 1) * 100 + currentdate.getDate();
     let gap =
      this.state.todayDate - parseInt(date[0] + date[1] + date[2]);
      let days=-(this.state.RestrictWeek*7)+1
      {gap<days?(this.updatetrue()):this.updatefalse()}
    
    {console.log("Date Restricted?", gap<days)}
    {console.log("Date Restricted?", this.state.dateResticted)}
    {console.log("Days", days)}
    {console.log("gap", gap)}
    return(gap<days)
  }

  updatetrue=()=>{
    (this.setState({dateResticted:true},()=>{console.log(this.state.dateResticted)}))
  }

  updatefalse=()=>{
    (this.setState({dateResticted:false},()=>{console.log(this.state.dateResticted)}))
  }





  filterBookings = ()=>{
    if (this.state.chosenLocation !=="overall") {
        this.getBookingsByLocation(this.state.chosenLocation);
       // this. sortBookingsbyLocation();
        {
          console.log(this.state.chosenDate);
        }
        {
            console.log(this.state.chosenLocation);
          }
          {
              console.log(this.state.bookings);
          }
          {
            console.log(this.state.filteredBookings);
          }
      } else {
        {
          this.setState({ filteredBookings: this.state.bookings });
        }
        {
            console.log(this.state.chosenDate);
        }
        {
          console.log(this.state.chosenLocation);
        }
        {
            console.log(this.state.bookings);
        }
        {
          console.log(this.state.filteredBookings);
        }
        
      }

  }

  handleEvent = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {        
      this.filterBookings();     
    });
  };

  getBookingIndex = (source, booking) => {
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

  submitCancelBooking = (bookingToCancel) => {
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

  componentDidMount = () => {
    window.scrollTo(0, 0);
    fetch("/api/getLocationData")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
        } else {
          this.setState({ location: res.data });
        }
      })
      .catch((err) => {});
  };

  displayBooking = (data) => {
    let time =
      data.pm && !data.am
        ? "13:30 - 17:30"
        : data.am && !data.pm
        ? "09:00 - 13:00"
        : "09:00 - 17:30";
    let date = new Date();
    this.state.todayDate =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    date = data.date.split("T")[0].split("-");
    {console.log("Displaying Boking", this.state.bookings)}
    let isUpcoming =
      this.state.todayDate - parseInt(date[0] + date[1] + date[2]);
    // let isUpcoming = -1;
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
    let displayDate =
      parseInt(date[2]) + " " + months[date[1] - 1] + " " + date[0];

    return (
      <button
        disabled={!this.state.isCancelling || isUpcoming > 0}
        className="bookings-table no-outline"
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
              let index = this.getBookingIndex(currentData, data);
              if (index !== -1) {
                currentData.splice(index, 1);
                sessionStorage.removeItem("bookings");
                sessionStorage.setItem(
                  "bookings",
                  JSON.stringify({ isNull: false, data: currentData })
                );
                sessionStorage.removeItem("upcomingBookings");
                this.submitCancelBooking(data);
              }
            }
          }, 50);
        }}
        style={{
          backgroundColor: bg.backgroundColor,
          "--hover-background":
            isUpcoming > 0
              ? "#eee"
              : this.state.isCancelling
              ? "#ff6655"
              : "#ddf8ff",
          "--cursor":
            isUpcoming < 1 && this.state.isCancelling ? "pointer" : "normal",
            
        }}
      >
        <div style={{ width: "100%", marginBottom: "1%" }} />
        <span
          className="booking-history"
          style={{
            textAlign: "left",
            marginLeft: "5px",
            color: "black",
            fontWeight: "bold",
            flex: "2",
            maxWidth: "23.5%",
          }}
        >
    
         {data.userEmail}
        </span>
        
        
        <span
          className="booking-history"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            flex: "0.75",
          }}
        >
          {"" + data.deskId}
        </span>
        <span
          className="ellipsis booking-history"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            flex: "1.25",
          }}
        >{`${data.deskRoom}`}</span>
        <span
          className="booking-history"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            flex: "1.25",
          }}
        >
          {displayDate}
        </span>
        <span
          className="booking-history"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            flex: "1.25",
          }}
        >
          {time}
        </span>
        <div style={{ width: "100%", marginBottom: "1%" }} />
      </button>
    );
  };

  render() {
    return verify(true) || verify(false) ? (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
            View Bookings by Date
          </h1>
          <div className="space" />
          {/*<h4>
            <h2
              style={{
                position: "absolute",
                marginTop: "0.1%",
                marginBottom: "0.5%",
                marginLeft: "26.5%",
              }}
            >
              Show Calendar
            </h2>
            <label class="switch" style={{ marginLeft: "18%" }}>
              <input
                type="checkbox"
                onChange={() =>
                  this.setState({
                    slider: !this.state.slider,
                  })
                }
              ></input>
              <span class="slider round"></span>
            </label>
            </h4>*/}
          <div className="space" />
          {this.state.slider ? (
            <div>
              <BookingCalendarAllTiles
                onSelect={(date) => {   
                   this.setState({ chosenDate: date });
                   this.getBookingsOnDate(date);
                   this.filterBookings();
                   this.checkRestriction(date);
                  document.getElementById("selectlocation").value = "overall";
                  window.scroll(0, 300);
                 
                }}
              ></BookingCalendarAllTiles>
              {this.state.chosenDate ? (
                <h3
                  style={{
                    height: "2rem",
                  }}
                >{`Chosen Date: ${this.state.chosenDate}`}</h3>
                
              ) : (
                <div style={{ height: "2rem" }} />
              )}
            </div>
          ) : null}

          <div
              style={{
                display: "flex",
                height: "15%",
                flexFlow: "row wrap",
                justifyContent: "flex-start",
              }}
            >
            <div style={{ flex: "1", height: "100%" }}>
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%",flex:"1" }}>
                  Locations
                </h1>
                <div className="space" />
          <select
            id="selectlocation"
            name="chosenLocation"
            className="text-input"
            style={{ padding: "0" }}
            onClick={
                this.handleEvent}
          >
            <option key={"_empty_loc"} value="" id="myDefault">
              Select location
            </option>
            <option value="overall">All</option>
            {this.state.location
              ? this.state.location.map((x) => {
                  return (
                    <option key={x.name} value={x.name}>
                      {x.name}
                    </option>
                  );
                })
              : null}
          </select>
          </div>
          {!this.state.dateResticted ? 
          null:(<div style={{ flex: "1", height: "100%" }}>
          <h1 className="page-divider-header" style={{ marginLeft: "2.5%",flex:"1",marginBottom:"7%" }}>
                  Time
                </h1>
                <div className="space" />
                
                <h8>
            <h9
              style={{
                position: "absolute",
                marginLeft:"3.5%",
              }}
            >
              AM
            </h9>
           
              <input
                type="checkbox"
                style={{
                  position: "relative",
                  marginRight:"20%",
                  
                }}          
                onChange={() =>
                  this.setState({
                    AM: !this.state.AM,
                  })
                }
              ></input>
            </h8>
            <h8>
            <h9
              style={{
                position: "absolute",
                marginLeft:"3.5%"
              }}
            >
              PM
            </h9>
           
              <input
                type="checkbox"                
                onChange={() =>
                  this.setState({
                  PM: !this.state.PM,
                  })
                }
              ></input>
            </h8>
          </div>)}
          </div>

          <div className="space" />
          <div>
          {this.state.chosenDate && !this.state.slider ? (
                <h3
                  style={{
                    height: "2rem",
                  }}
                >{`Chosen Date: ${this.state.chosenDate}`}</h3>
              ) : (
                <div style={{ height: "2rem" }} />
              )}
            </div>

       
          {this.state.bookings ? (
            this.state.bookings.length > 0 ? (
              <button
                className="button-style no-outline"
                style={{
                  position: "relative",
                  "--bg-color": this.state.isCancelling ? "#4dc300" : "#f32000",
                  "--hover-highlight": this.state.isCancelling
                    ? "#5dE300"
                    : "#ff5000",
                    bottom:"2%"
                }}
                onClick={() => {
                  this.setState({
                    isCancelling: !this.state.isCancelling,
                  });
                }}
              >
                {this.state.isCancelling ? "Finish" : "Cancel a Booking"}
              </button>
            ) : null
          ) : null}

          {/*{this.state.bookings && this.state.isCancelling ? (
            this.state.bookings.length > 0 ? (
              <button
                className="button-style no-outline"
                style={{
                  position: "relative",
                  "--bg-color": "#f32000",
                  "--hover-highlight": "#ff5000",
                  // left:"27%",
                  top: "0%",
                }}
                onClick={() => {
                  setTimeout(() => {
                    let room = this.state.chosenLocation;
                    let dat = this.state.chosenDate;
                    let res = window.confirm(
                      `Are you sure you want to cancel all the booking?\n\nLocation: ${room}\nnDate: ${dat}\n`
                    );
                    if (res) {
                      let currentData = JSON.parse(
                        sessionStorage.bookings
                      ).data;
                      for (
                        let index = 0;
                        index < this.state.filteredBookings;
                        index++
                      ) {
                        if (index !== -1) {
                          currentData.splice(index, 1);
                          sessionStorage.removeItem("bookings");
                          sessionStorage.setItem(
                            "bookings",
                            JSON.stringify({ isNull: false, data: currentData })
                          );
                          sessionStorage.removeItem("upcomingBookings");
                          //   this.submitCancelBooking(sessionStorage.data);
                        }
                      }
                    }
                  }, 50);
                }}
              >
                Cancel all Bookings
              </button>
            ) : null
            ) : null}*/}

          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ width: "100%", marginBottom: "2%" }} />
            {this.state.bookings && !this.state.dateResticted? (
              this.state.bookings.length > 0 ? (
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
                        maxWidth: "21.5%",
                        flex: "3",
                      }}
                    >
                      User
                    </span>
                    <span
                      className="booking-history"
                      style={{
                        textAlign: "left",
                        fontWeight: "bold",
                       //1.25
                        flex: "1",
                      }}
                    >
                      Desk No.
                    </span>
                    <span
                      className="booking-history"
                      style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        //3
                        flex: "1.25",
                      }}
                    >
                      Location
                    </span>
                    <span
                      className="booking-history"
                      style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        //2
                        flex: "1.25",
                      }}
                    >
                      Date
                    </span>
                    <span
                      className="booking-history"
                      style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        flex: "1.25",
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
               
                  {document.getElementById("selectlocation").value != "overall" && document.getElementById("selectlocation").value != ""
                    ? this.state.filteredBookings.map((booking, index) => {
                        return this.displayBooking(booking);
                      })
                    :this.state.bookings.map((booking, index) => {
                        return this.displayBooking(booking);
                      }) }
                </>
              ) : (
                
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                    {console.log("No Boookings")}
                  {this.state.chosenLocation != "" &&
                  this.state.chosenDate != "" ? (
                    <h2>No Bookings Found.</h2>
                  ) : <h3>Please select a date.</h3>}
                </div>
              )
            ) : (
              <button
              className="button-style no-outline"
              style={{
                position: "relative",
                "--bg-color": "#f32000",
                "--hover-highlight":"#ff5000",
                  marginTop:"-5%",
                  marginLeft:"40%",
                  marginBottom:"20%"
              }}
              onClick={() => {
                this.submitRoomRestriction();
              }}
            >
              Restrict
            </button>
            )}
          </div>
          <div
            style={{
              marginTop: "20%",
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
}
