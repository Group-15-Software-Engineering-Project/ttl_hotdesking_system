import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
import { months } from "./Misc";

export default class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: "",
      currentMonth: "",
      availableDesks: "",
      key: 0,
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

    fetch("/api/getAvailableDesksInMonth", {
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
        this.setState({ availableDesks: res.data }, () => {});
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
        selectedDate:
          date.getDate() +
          " " +
          months[date.getMonth()] +
          " " +
          date.getFullYear(),
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
    if (
      this.state.currentMonth.substring(5) ===
      String(month + 1).padStart(2, "0")
    ) {
      if (this.state.availableDesks) {
        if (this.state.availableDesks[day]) {
          if (this.state.availableDesks[day].length > 0) {
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

  //Update to include names of who booked a desk
  getDesks = (dateInfo) => {
    let desks = [];
    let day = parseInt(String(dateInfo).split(" ")[2]) - 1;
    let month = months.indexOf(String(dateInfo).split(" ")[1]);
    if (
      this.state.currentMonth.substring(5) ===
      String(month + 1).padStart(2, "0")
    ) {
      for (let desk in this.state.availableDesks[day]) {
        desks.push(String("Desk " + this.state.availableDesks[day][desk]));
      }
    }
    return desks;
  };

  disabledTiles = (e) => {
    let date = String(e.date).split(" ");
    let year0 = date[3];
    let month0 = months.indexOf(date[1]) + 1;
    month0 = String(month0).length === 1 ? "0" + month0 : month0;
    let day0 = (String(date[2]).length === 1 ? "0" : "") + date[2];
    let tileDate = year0 + month0 + day0;
    let today = new Date();
    let year = today.getFullYear();
    let month =
      String(today.getMonth() + 1).length === 1
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1;
    let day = (today.getDate().length === 1 ? "0" : "") + today.getDate();
    let todayVal = year + month + day;
    return todayVal > tileDate;
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
              date[3] +
              "-" +
              (String(month + 1).length === 1 ? "0" : "") +
              (month + 1);
            this.setState({ currentMonth: dateStr }, () => {
              this.fetchAvailableDesks();
            });
          }}
        ></Calendar>
      </div>
    );
  }
}
