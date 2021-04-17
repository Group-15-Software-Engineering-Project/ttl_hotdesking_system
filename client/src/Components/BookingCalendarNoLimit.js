import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
import { months, getDifferenceInDays } from "./Misc";

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
        todayDate: date.getFullYear() * 10000 + (date.getMonth() + 1) * 31 + date.getDate(),
        selectedDate:
          date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
        chosenArea: this.props.chosenArea,
        currentMonth: curMonth,
      }
    );
  }

  checkAvailability = (dateInfo) => {
    let date = String(dateInfo.date).split(" ");
    let year = parseInt(date[3]);
    let month = months.indexOf(date[1]) + 1;
    let day = parseInt(date[2]);

    let date1 = new Date(`${year}/${month}/${day}`);
    let date2 = new Date();
    let diff = getDifferenceInDays(date1, date2);
    if(diff > -1) return "NONE-Booked";
  };

  getDate = (e) => {
    let dateComponent = String(e).split(" ");
    return dateComponent[2] + "-" + (months.indexOf(dateComponent[1])+1) + "-" + dateComponent[3];
  };

  disabledTiles = (e) => {
    let date = String(e.date).split(" ");
    let year = parseInt(date[3]);
    let month = months.indexOf(date[1]) + 1;
    let day = parseInt(date[2]);

    let date1 = new Date(`${year}/${month}/${day}`);
    let date2 = new Date();
    let diff = getDifferenceInDays(date1, date2);
    return diff < 0;
  };

  render() {
    return (
      <div style={{ marginTop: "5%", marginBottom: "5%" }}>
        <Calendar
          minDetail="month"
          maxDetail="month"
          defaultView="month"
          prev2Label={null}
          next2Label={null}
          tileClassName={this.checkAvailability}
          tileDisabled={this.disabledTiles}
          onChange={(e) => {
            this.props.onSelect(
              this.getDate(e)
            );
          }}
        ></Calendar>
      </div>
    );
  }
}
