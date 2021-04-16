import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
import { months } from "./Misc";

export default class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayDate: "",
      selectedDate: "",
      currentMonth: "",
      availableDesks: "",
      existingBookings: [],
      key: 0,
      dayLimit: 7,
    };
  }

  fetchAvailableDesks = () => {
    let am;
    let pm;
    switch (this.props.bookingTime) {
      case "AM":
        am = true;
        pm = false;
        break;
      case "PM":
        am = false;
        pm = true;
        break;
      default:
        am = true;
        pm = true;
        break;
    }

    fetch("/api/getBookingsInMonth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room: this.props.chosenArea,
        date: this.state.currentMonth,
        am: am,
        pm: pm,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState(
          {
            availableDesks: res.desks,
            existingBookings: res.existingBookings,
          },
          () => {}
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    let date = new Date();
    let curMonth =
      date.getFullYear() +
      "-" +
      (String(date.getMonth() + 1).length === 1 ? "0" : "") +
      (date.getMonth() + 1);

    this.setState(
      {
        todayDate: date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate(),
        selectedDate:
          date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
        chosenArea: this.props.chosenArea,
        currentMonth: curMonth,
      },
      () => {
        this.fetchAvailableDesks();
      }
    );
  }

  checkAvailability = (dateInfo) => {
    let month = months.indexOf(String(dateInfo.date).split(" ")[1]);
    let day = parseInt(String(dateInfo.date).split(" ")[2]) - 1;
    if (this.state.currentMonth.substring(5) === String(month + 1).padStart(2, "0")) {
      if (this.state.existingBookings) {
        if (this.state.existingBookings[day]) {
          if (this.state.existingBookings[day].length < this.state.availableDesks.length) {
            return "NONE-Booked";
          } else {
            return "ALL-Booked";
          }
        }
      }
    } else {
      return "Not-Available";
    }
  };

  getDate = (e) => {
    let dateComponent = String(e).split(" ");
    return dateComponent[2] + " " + dateComponent[1] + " " + dateComponent[3];
  };

  getDesks = (dateInfo) => {
    let desks = [];
    let day = parseInt(String(dateInfo).split(" ")[2]) - 1;
    let month = months.indexOf(String(dateInfo).split(" ")[1]);
    if (this.state.currentMonth.substring(5) === String(month + 1).padStart(2, "0")) {
      for (let desk in this.state.availableDesks) {
        let bookedDesk;
        for (let booking in this.state.existingBookings[day]) {
          if (
            this.state.existingBookings[day][booking].desk === this.state.availableDesks[desk]
          ) {
            bookedDesk = {
              desk: "Desk " + this.state.availableDesks[desk],
              user: this.state.existingBookings[day][booking].user,
            };
            break;
          }
        }

        if (bookedDesk) {
          desks.push(bookedDesk);
        } else {
          desks.push({
            desk: "Desk " + this.state.availableDesks[desk],
            user: "",
          });
        }
      }
    }
    return desks;
  };

  disabledTiles = (e) => {
    let date = String(e.date).split(" ");
    let year = parseInt(date[3]);
    let month = months.indexOf(date[1]) + 1;
    let day = parseInt(date[2]);
    let tileDate = year * 10000 + month * 100 + day;
    return (
      this.state.todayDate > tileDate || tileDate - this.state.todayDate > this.state.dayLimit
    );
  };

  render() {
    return (
      <div style={{ marginTop: "5%", marginBottom: "5%" }}>
        <Calendar
          key={this.state.availableDesks}
          activeStartDate={
            new Date(
              this.state.currentMonth.substring(0, 4),
              parseInt(this.state.currentMonth.substring(5)) - 1,
              1
            )
          }
          minDetail="month"
          maxDetail="month"
          defaultView="month"
          prev2Label={null}
          next2Label={null}
          tileClassName={this.checkAvailability}
          tileDisabled={this.disabledTiles}
          onChange={(e) => {
            this.props.onSelect(
              this.getDesks(e),
              this.getDate(e),
              months[parseInt(this.state.currentMonth.substring(5)) - 1]
            );
          }}
          onActiveStartDateChange={(e) => {
            let date = String(e.activeStartDate).split(" ");
            let month = months.indexOf(date[1]);
            let dateStr =
              date[3] + "-" + (String(month + 1).length === 1 ? "0" : "") + (month + 1);
            this.setState({ currentMonth: dateStr }, () => {
              this.fetchAvailableDesks();
            });
          }}
        ></Calendar>
      </div>
    );
  }
}
