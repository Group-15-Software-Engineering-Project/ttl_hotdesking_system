import React, { createRef } from "react";
import BookingCalendar from "../Components/BookingCalendar";
import TileSelection from "../Components/TileSelection";
import { createUniqueID, months } from "../Components/Misc";
import "../public/css/main.css";

export default class BookingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaKey: "default",
      chosenArea: "default",
      chosenDesk: "default",
      chosenDate: "default",
      chosenTime: "default",
      locations: [],
      bookableDesks: [],
      selectAM: false,
      selectPM: false,
      responseToPost: "",
      times: [
        { value: "9:00 - 13:00", label: "AM" },
        { value: "13:30 - 17:30", label: "PM" },
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
      case "9:00 - 13:00":
        am = true;
        pm = false;
        break;
      case "13:30 - 17:30":
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

  componentDidMount() {
    fetch("/api/getRooms", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        console.log("Error fetching rooms");
      } else {
        this.setState({
          locations: res.rooms
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    this.positionReference.current.scrollIntoView({ behavior: "smooth" });
  };

  transformDeskData = () => {
    let data = [];
    let desks = this.state.bookableDesks;
    for (let desk in desks) {
      let label = desks[desk].disabled ? "Booked by: " + desks[desk].name : "";
      data.push({
        value: desks[desk],
        label: label,
        disabled: desks[desk].disabled,
      });
    }
    return data;
  };

  render() {
    return (
      <div className="booking-page">
        <section>
          <div className="calendar-container">
            <div className="flex-container-1"></div>
            <div className="flex-container-5 main-body">
              <div style={{ marginTop: "20px" }} />
              <TileSelection
                showLabel={true}
                key={this.state.areaKey}
                title={
                  <h1 className="page-divider-header">Select a Booking Area</h1>
                }
                options={this.state.locations}
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
                    <h1 className="page-divider-header">
                      Select a Booking Time
                    </h1>
                  }
                />
              ) : null}
              {this.state.chosenTime !== "default" ? (
                <>
                  <h1 className="page-divider-header">Select a Booking Date</h1>
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
                    onSelect={(desks, date, m) => {
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
                        bookableDesks: desks,
                        chosenDate: newDate,
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
                    showLabel={true}
                    title={
                      <>
                        <h1 className="page-divider-header">Select a Desk</h1>
                        <div
                          style={{
                            textAlign: "center",
                            alignItems: "center",
                            marginTop: "15px",
                          }}
                        >
                          <span
                            style={{
                              color: "black",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >{`Desks for ${this.state.chosenArea} on ${this.state.chosenDate}.`}</span>
                        </div>
                      </>
                    }
                    options={this.transformDeskData()}
                    size={["150px", "60px"]}
                    onSelect={(e) => {
                      this.setState({
                        chosenDesk: e,
                      });
                    }}
                  />
                </>
              ) : null}
              {this.state.chosenDesk !== "default" ? (
                <div style={{ alignItems: "center", textAlign: "center" }}>
                  <button className="button-style" onClick={this.submitBooking}>
                    Confirm Booking
                  </button>
                  <div style={{ marginBottom: "30px" }} />
                  <p>{this.state.responseToPost}</p>
                </div>
              ) : null}
              <div ref={this.positionReference} />
            </div>
            <div className="flex-container-1"></div>
          </div>
        </section>
      </div>
    );
  }
}
