import React, { createRef } from "react";
import BookingCalendar from "../Components/BookingCalendar";
import TileSelection from "../Components/TileSelection";
import { createUniqueID, months } from "../Components/Misc";

export default class BookingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaKey: "default",
      chosenArea: "default",
      chosenDesk: "default",
      chosenDate: "default",
      chosenTime: "default",
      bookableDesks: [],
      selectAM: false,
      selectPM: false,
      responseToPost: "",
      times: [
        { value: "9:00 - 12:00", label: "AM" },
        { value: "12:00 - 17:30", label: "PM" },
        { value: "9:00 - 17:30", label: "AMPM" },
      ],
    };
  }

  convertDate = () => {
    return (
      this.state.chosenDate.split(" ")[2] +
      "-" +
      String(months.indexOf(this.state.chosenDate.split(" ")[1]) + 1).padStart(
        2,
        "0"
      ) +
      "-" +
      this.state.chosenDate.split(" ")[0]
    );
  };

  submitBooking = () => {
    let am;
    let pm;
    switch (this.state.chosenTime) {
      case "9:00 - 12:00":
        am = true;
        pm = false;
        break;
      case "12:00 - 17:30":
        am = false;
        pm = true;
        break;
      default:
        am = true;
        pm = true;
        break;
    }
    fetch("/api/makeBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.props.email,
        desk: this.state.chosenDesk.split(" ")[1],
        room: this.state.chosenArea,
        date: this.convertDate(),
        am: am,
        pm: pm,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        alert(res.message);
        this.setState({
          chosenArea: "default",
          chosenDate: "default",
          chosenDesk: "default",
          chosenTime: "default",
          areaKey: createUniqueID(),
          bookableDesks: [],
        });
      })
      .catch((err) => alert(err));
  };

  positionReference = createRef();

  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.positionReference.current.scrollIntoView({ behavior: "smooth" });
  };

  // getMatchingDesks = () => {
  //   if (!this.state.selectAM && !this.state.selectPM) {
  //     let AllDesks = [];
  //     for (let desk in this.state.bookableDesks) {
  //       let key = Object.keys(this.state.bookableDesks[desk]);
  //       if (
  //         this.state.bookableDesks[desk][key].AM &&
  //         this.state.bookableDesks[desk][key].PM
  //       ) {
  //         AllDesks[AllDesks.length] = {
  //           [Object.keys(this.state.bookableDesks[desk]) + " AM & PM"]: null,
  //         };
  //         AllDesks[AllDesks.length] = {
  //           [Object.keys(this.state.bookableDesks[desk]) + " AM"]: null,
  //         };
  //         AllDesks[AllDesks.length] = {
  //           [Object.keys(this.state.bookableDesks[desk]) + " PM"]: null,
  //         };
  //       } else if (
  //         !this.state.bookableDesks[desk][key].AM &&
  //         this.state.bookableDesks[desk][key].PM
  //       ) {
  //         AllDesks[AllDesks.length] = {
  //           [Object.keys(this.state.bookableDesks[desk]) + " PM"]: null,
  //         };
  //       } else if (
  //         this.state.bookableDesks[desk][key].AM &&
  //         !this.state.bookableDesks[desk][key].PM
  //       ) {
  //         AllDesks[AllDesks.length] = {
  //           [Object.keys(this.state.bookableDesks[desk]) + " AM"]: null,
  //         };
  //       }
  //     }
  //     return AllDesks;
  //   } else if (!this.state.selectAM && this.state.selectPM) {
  //     let PMDesks = [];
  //     for (let desk in this.state.bookableDesks) {
  //       let key = Object.keys(this.state.bookableDesks[desk]);
  //       if (this.state.bookableDesks[desk][key].PM) {
  //         PMDesks[PMDesks.length] = this.state.bookableDesks[desk];
  //       }
  //     }
  //     return PMDesks;
  //   } else if (this.state.selectAM && !this.state.selectPM) {
  //     let AMDesks = [];
  //     for (let desk in this.state.bookableDesks) {
  //       let key = Object.keys(this.state.bookableDesks[desk]);
  //       if (this.state.bookableDesks[desk][key].AM) {
  //         AMDesks[AMDesks.length] = this.state.bookableDesks[desk];
  //       }
  //     }
  //     return AMDesks;
  //   } else if (this.state.selectAM && this.state.selectPM) {
  //     let FullDayDesks = [];
  //     for (let desk in this.state.bookableDesks) {
  //       let key = Object.keys(this.state.bookableDesks[desk]);
  //       if (
  //         this.state.bookableDesks[desk][key].AM &&
  //         this.state.bookableDesks[desk][key].PM
  //       ) {
  //         FullDayDesks[FullDayDesks.length] = this.state.bookableDesks[desk];
  //       }
  //     }
  //     return FullDayDesks;
  //   } else {
  //     return this.state.bookableDesks; //error
  //   }
  // };

  // handleEvent = async (event) => {
  //   this.setState({
  //     [event.target.name]:
  //       event.target.type === "checkbox"
  //         ? event.target.checked
  //         : event.target.value,
  //     bookableDesks:
  //       event.target.name !== "chosenDesk" ? [] : this.state.bookableDesks,
  //     view: event.target.name !== "chosenDesk" ? false : this.state.view,
  //   });
  // };

  // getOptions = (option) => {
  //   return <option>{option}</option>;
  // };

  // getBookableDeskList = (desk) => {
  //   return <option>{Object.keys(desk)}</option>;
  // };

  // receiveDeskData = async (desks) => {
  //   if (desks !== null) {
  //     await this.changeState(desks);
  //   }
  // };

  transformDeskData = () => {
    let data = [];
    let desks = this.state.bookableDesks;
    for (let desk in desks) {
      data.push({
        value: desks[desk],
        label: "",
      });
    }
    return data;
  };

  render() {
    return (
      <div className="booking-page">
        <section>
          <div className="calendar-container">
            <div className="element-flex-1"></div>
            <div className="element-flex-3">
              <div style={{ marginTop: "20px" }} />
              <TileSelection
                showLabel={true}
                key={this.state.areaKey}
                title={
                  <h1
                    style={{
                      textAlign: "center",
                      boxShadow: "0px 3px 3px #ccc, 0px -3px 3px #ccc",
                      color: "white",
                      backgroundColor: "#008dd3",
                      borderRadius: "100px",
                      width: "95%",
                      marginLeft: "2.5%",
                      padding: "3px",
                    }}
                  >
                    Select a Booking Area
                  </h1>
                }
                options={this.props.options}
                size={["210px", "75px"]}
                onSelect={(e) => {
                  this.setState({
                    chosenArea: e,
                    bookableDesks: [],
                    chosenTime: "default",
                    chosenDesk: "default",
                  });
                }}
              />
              {this.state.chosenArea !== "default" ? (
                <TileSelection
                  showLabel={false}
                  key={this.state.chosenArea}
                  options={this.state.times}
                  size={["175px", "50px"]}
                  onSelect={(e) =>
                    this.setState({
                      chosenTime: e,
                      chosenDate: "default",
                      chosenDesk: "default",
                      bookableDesks: [],
                    })
                  }
                  title={
                    <h1
                      style={{
                        textAlign: "center",
                        boxShadow: "0px 3px 3px #ccc, 0px -3px 3px #ccc",
                        color: "white",
                        backgroundColor: "#008dd3",
                        borderRadius: "100px",
                        width: "95%",
                        marginLeft: "2.5%",
                        padding: "3px",
                      }}
                    >
                      Select a Booking Time
                    </h1>
                  }
                />
              ) : null}
              {this.state.chosenTime !== "default" ? (
                <>
                  <h1
                    style={{
                      textAlign: "center",
                      boxShadow: "0px 3px 3px #ccc, 0px -3px 3px #ccc",
                      color: "white",
                      backgroundColor: "#008dd3",
                      borderRadius: "100px",
                      width: "95%",
                      marginLeft: "2.5%",
                      padding: "3px",
                    }}
                  >
                    Select a Booking Date
                  </h1>
                  <BookingCalendar
                    key={this.state.chosenTime}
                    chosenArea={this.state.chosenArea}
                    bookingTime={(() => {
                      for (let i in this.state.times) {
                        if (
                          this.state.chosenTime === this.state.times[i].value
                        ) {
                          return this.state.times[i].label;
                        }
                      }
                    })()}
                    onSelect={(e, date, m) => {
                      let newDate;
                      if (
                        this.state.chosenDate === "default" &&
                        date.split(" ")[1] !== m
                      ) {
                        newDate = "default";
                      } else if (this.state.chosenDate === "default") {
                        newDate = date;
                      } else if (
                        this.state.chosenDate.split(" ")[1] !==
                        date.split(" ")[1]
                      ) {
                        newDate = "default";
                      } else {
                        newDate = date;
                      }
                      this.setState({
                        bookableDesks: e,
                        chosenDate: newDate,
                        chosenDesk: "default",
                      });
                    }}
                  ></BookingCalendar>
                  <br />
                  {this.state.chosenDate !== "default" ? (
                    <span style={{ alignItems: "center", fontWeight: "bold" }}>
                      {this.state.chosenDate}
                    </span>
                  ) : null}
                  {this.state.bookableDesks.length === 0 ? (
                    <>
                      <br />
                      <br />
                      <br />
                    </>
                  ) : null}
                </>
              ) : null}

              {this.state.bookableDesks.length !== 0 ? (
                <>
                  <TileSelection
                    showLabel={false}
                    title={
                      <h1
                        style={{
                          textAlign: "center",
                          boxShadow: "0px 3px 3px #ccc, 0px -3px 3px #ccc",
                          color: "white",
                          backgroundColor: "#008dd3",
                          borderRadius: "100px",
                          width: "95%",
                          marginLeft: "2.5%",
                          padding: "3px",
                        }}
                      >
                        Select a Desk
                      </h1>
                    }
                    options={this.transformDeskData()}
                    size={["150px", "50px"]}
                    onSelect={(e) => {
                      this.setState({
                        chosenDesk: e,
                      });
                    }}
                  />
                </>
              ) : null}
              {this.state.chosenDesk !== "default" ? (
                <div>
                  <button
                    className="bookingBtn"
                    onClick={this.submitBooking}
                    /*onClick={() => {
                    className="bookingBtn"
                    onClick={() => {
                      alert(
                        "[" +
                          this.state.chosenTime +
                          " " +
                          this.state.chosenDate +
                          "] " +
                          this.state.chosenArea +
                          ": " +
                          this.state.chosenDesk
                      ); console.log(this.state.chosenDate+" "+this.state.chosenArea+" "+this.state.chosenDesk+" ");
                      
                    }}*/
                  >
                    Confirm Booking
                  </button>
                  <div style={{ marginBottom: "30px" }} />
                  <p>{this.state.responseToPost}</p>
                </div>
              ) : null}
              <div ref={this.positionReference} />
            </div>
            <div className="element-flex-1"></div>
          </div>
        </section>
      </div>
    );
  }
}
