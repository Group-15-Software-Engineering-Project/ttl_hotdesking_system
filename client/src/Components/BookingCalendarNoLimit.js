import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
import { months } from "./Misc";

export default class BookingCalendarNoLimit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayDate: "",
      selectedDate: "",
      currentMonth: "",
      availableDesks: "",
      existingBookings: [],
      key: 0,
      dayLimit: 30,
    };
  }

  componentDidMount() {
    let date = new Date();
    let curMonth =
      date.getFullYear() +
      "-" +
      (String(date.getMonth() + 1).length === 1 ? "0" : "") +
      (date.getMonth() + 1);

    this.setState(
      {
        todayDate: date.getFullYear() * 366 + (date.getMonth() + 1) * 31 + date.getDate(),
        selectedDate:
          date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
        chosenArea: this.props.chosenArea,
        currentMonth: curMonth,
      }
    );
  }

  checkAvailability = (dateInfo) => {
    let month = months.indexOf(String(dateInfo.date).split(" ")[1]);
    let day = parseInt(String(dateInfo.date).split(" ")[2]) - 1;
    if (this.state.currentMonth.substring(5) === String(month + 1).padStart(2, "0")) {
      return "NONE-Booked";
    } else {
      return "Not-Available";
    }
  };

  getDate = (e) => {
    let dateComponent = String(e).split(" ");
    return dateComponent[2] + " " + dateComponent[1] + " " + dateComponent[3];
  };

  disabledTiles = (e) => {
    let date = String(e.date).split(" ");
    let year = parseInt(date[3]);
    let month = months.indexOf(date[1]) + 1;
    let day = parseInt(date[2]);
    let tileDate = year * 366 + month * 31 + day;
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
            });
          }}
        ></Calendar>
      </div>
    );
  }
}
