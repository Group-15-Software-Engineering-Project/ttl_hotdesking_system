import React from "react";
import BookingCalendar from "../Components/BookingCalendar";
//import "react-sticky-header/styles.css";

export default class BookingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingAreas: ["Front Square 1", "Front Square 2", "Foster Place"],
      chosenArea: "Front Square 1",
      chosenDesk: "",
      chosenDate: "",
      updated: false,
      view: false,
      bookableDesks: [],
      selectAM: false,
      selectPM: false,
      responseToPost: ""
    };
  }
  getDesks = async () => {};

  postBooking = async (e) => {
    e.preventDefault();

    //console.log("Success login handleSubmit");

    const response = await fetch("/api/desks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chosenDate:this.state.chosenDate, chosenArea:this.state.chosenArea, chosenDesk:this.state.chosenDesk }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });

    //console.log(this.state.responseToPost);
  };

  getMatchingDesks = () => {
    if (!this.state.selectAM && !this.state.selectPM) {
      let AllDesks = [];
      for (let desk in this.state.bookableDesks) {
        let key = Object.keys(this.state.bookableDesks[desk]);
        if (
          this.state.bookableDesks[desk][key].AM &&
          this.state.bookableDesks[desk][key].PM
        ) {
          AllDesks[AllDesks.length] = {
            [Object.keys(this.state.bookableDesks[desk]) + " AM & PM"]: null,
          };
          AllDesks[AllDesks.length] = {
            [Object.keys(this.state.bookableDesks[desk]) + " AM"]: null,
          };
          AllDesks[AllDesks.length] = {
            [Object.keys(this.state.bookableDesks[desk]) + " PM"]: null,
          };
        } else if (
          !this.state.bookableDesks[desk][key].AM &&
          this.state.bookableDesks[desk][key].PM
        ) {
          AllDesks[AllDesks.length] = {
            [Object.keys(this.state.bookableDesks[desk]) + " PM"]: null,
          };
        } else if (
          this.state.bookableDesks[desk][key].AM &&
          !this.state.bookableDesks[desk][key].PM
        ) {
          AllDesks[AllDesks.length] = {
            [Object.keys(this.state.bookableDesks[desk]) + " AM"]: null,
          };
        }
      }
      return AllDesks;
    } else if (!this.state.selectAM && this.state.selectPM) {
      let PMDesks = [];
      for (let desk in this.state.bookableDesks) {
        let key = Object.keys(this.state.bookableDesks[desk]);
        if (this.state.bookableDesks[desk][key].PM) {
          PMDesks[PMDesks.length] = this.state.bookableDesks[desk];
        }
      }
      return PMDesks;
    } else if (this.state.selectAM && !this.state.selectPM) {
      let AMDesks = [];
      for (let desk in this.state.bookableDesks) {
        let key = Object.keys(this.state.bookableDesks[desk]);
        if (this.state.bookableDesks[desk][key].AM) {
          AMDesks[AMDesks.length] = this.state.bookableDesks[desk];
        }
      }
      return AMDesks;
    } else if (this.state.selectAM && this.state.selectPM) {
      let FullDayDesks = [];
      for (let desk in this.state.bookableDesks) {
        let key = Object.keys(this.state.bookableDesks[desk]);
        if (
          this.state.bookableDesks[desk][key].AM &&
          this.state.bookableDesks[desk][key].PM
        ) {
          FullDayDesks[FullDayDesks.length] = this.state.bookableDesks[desk];
        }
      }
      return FullDayDesks;
    } else {
      return this.state.bookableDesks; //error
    }
  };
  handleEvent = (event) => {
    this.setState({
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
      bookableDesks:
        event.target.name !== "chosenDesk" ? [] : this.state.bookableDesks,
      view: event.target.name !== "chosenDesk" ? false : this.state.view,
    });
  };

  getOptions = (option) => {
    return <option>{option}</option>;
  };

  getBookableDeskList = (desk) => {
    return <option>{Object.keys(desk)}</option>;
  };

  changeState = async (desks) => {
    this.setState({ bookableDesks: desks });
  };
  receiveDeskData = async (desks) => {
    if (desks !== null) {
      await this.changeState(desks);
    }
  };

  render() {
    return (
      <div className="booking-page">
        <section>
          <div className="calendar-container">
            <div className="element-flex-1"></div>
            <div className="element-flex-3">
              <select
                defaultVal="Select an Area"
                style={{
                  borderRadius: "3px",
                  border: "1.5px #ccc solid",
                  width: "150px",
                  height: "25px",
                  margin: "5px",
                }}
                value={this.state.chosenArea}
                name="chosenArea"
                onChange={this.handleEvent}
              >
                {this.state.bookingAreas.map(this.getOptions)}
              </select>{" "}
              <button
                className="button-style"
                onClick={() => {
                  this.setState({ view: true });
                }}
              >
                View available spaces
              </button>
              <div>
                <span>AM </span>
                <input
                  type="checkbox"
                  name="selectAM"
                  onChange={this.handleEvent}
                ></input>
                <span>PM </span>
                <input
                  type="checkbox"
                  name="selectPM"
                  onChange={this.handleEvent}
                ></input>
              </div>
              <div>
                {
                  this.state.view ? (
                    <BookingCalendar
                      chosenArea={this.state.chosenArea}
                      viewBookings={true}
                      getChosenDesks={(data) => {
                        data !== this.state.bookableDesks
                          ? this.receiveDeskData(data)
                          : this.receiveDeskData(null);
                      }}
                      chosenDate={(e) => {
                        this.setState({ chosenDate: e });
                      }}
                    />
                  ) : null //<BookingCalendar viewBookings={false} />
                }
              </div>
              <div>
                {this.state.bookableDesks.length > 0 ? (
                  <select
                    name="chosenDesk"
                    onChange={(e) => {
                      this.handleEvent(e);
                    }}
                  >
                    {this.getMatchingDesks().map(this.getBookableDeskList)}
                  </select>
                ) : this.state.view ? (
                  "[Temp Message] No desks available in the system for this day."
                ) : null}
              </div>
              {this.state.chosenDesk.length > 0 ? (
                <div>
                  <button
                    className="button-style"
                    onClick={this.postBooking}
                    /*onClick={() => {
                      alert(
                        "[" +
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
                  <p>{this.state.responseToPost}</p>
                </div>
              ) : null}
            </div>
            <div className="element-flex-1"></div>
          </div>
         
            
          
        </section>
      </div>
    );
  }
}
