import React, { createRef } from "react";
import BookingCalendar from "../Components/BookingCalendar";
import TileSelection from "../Components/TileSelection";
import { createUniqueID } from "../Components/Misc";

export default class BookingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenArea: "default",
      chosenDesk: "default",
      chosenDate: "default",
      chosenTime: "default",
      bookableDesks: [],
      times: [
        { id: "__am_booking", value: "9:00-12:00", label: "AM" },
        { id: "__pm_booking", value: "12:00-17:30", label: "PM" },
        { id: "__full_day_booking", value: "9:00-17:30", label: "AMPM" },
      ],
    };
  }

  positionReference = createRef();

  componentDidMount() {
    this.scrollToBottom();
  }
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
        id: createUniqueID(4, false),
        value: Object.keys(desks[desk])[0],
        desc: "",
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
            <div className="element-flex-2">
              <TileSelection
                title={
                  <h1
                    style={{
                      marginTop: "50px",
                      textAlign: "center",
                      boxShadow: "0px 3px 3px #ccc, 0px -3px 3px #ccc",
                      color: "white",
                      backgroundColor: "#008dd3",
                      borderRadius: "100px",
                      width: "95%",
                      marginLeft: "2.5%",
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
                    onSelect={(e, date) => {
                      this.setState({
                        bookableDesks: e,
                        chosenDate: date,
                        chosenDesk: "default",
                      });
                    }}
                  ></BookingCalendar>
                  <br />
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
                      );
                    }}
                  >
                    Confirm Booking
                  </button>
                  <br />
                  <br />
                  <br />
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
