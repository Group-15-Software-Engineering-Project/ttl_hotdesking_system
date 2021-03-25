import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
import { createUniqueID, months } from "./Misc";

export default class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "Office 2.5: West Theatre": [
        {
          2021: [
            {
              Apr: [
                {
                  "02": [
                    {
                      Desk1: {
                        AM: true, //true = bookable
                        PM: false, //false = already booked
                      },
                    },
                    {
                      Desk2: {
                        AM: true,
                        PM: true,
                      },
                    },
                    {
                      Desk3: {
                        AM: true,
                        PM: false,
                      },
                    },
                    {
                      Desk4: {
                        AM: false,
                        PM: false,
                      },
                    },
                    {
                      Desk5: {
                        AM: true,
                        PM: false,
                      },
                    },
                  ], // Feb 02 close
                },
                {
                  10: [
                    {
                      Desk1: {
                        AM: true, //true = bookable
                        PM: false, //false = already booked
                      },
                    },
                    {
                      Desk2: {
                        AM: true,
                        PM: false,
                      },
                    },
                    {
                      Desk3: {
                        AM: true,
                        PM: false,
                      },
                    },
                    {
                      Desk4: {
                        AM: false,
                        PM: false,
                      },
                    },
                    {
                      Desk5: {
                        AM: true,
                        PM: false,
                      },
                    },
                  ], // Feb 07 close
                },
              ], //Feb close
            },
          ], //2021 close
        },
      ],
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

  checkAvailability1 = (dateInfo) => {
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

  checkAvailability = (dateTileInfo) => {
    let dateComponent = String(dateTileInfo["date"]).split(" ");
    let area = this.state[this.props.chosenArea];
    if (area) {
      for (let y in area) {
        let year = area[y][dateComponent[3]];
        if (year) {
          for (let m in year) {
            let month = year[m][dateComponent[1]];
            if (month) {
              for (let d in month) {
                let day = month[d][dateComponent[2]];
                if (day) {
                  let isAvailableAt;
                  if (this.props.bookingTime === "AM")
                    isAvailableAt = (desk) => {
                      return desk.AM;
                    };
                  else if (this.props.bookingTime === "PM")
                    isAvailableAt = (desk) => {
                      return desk.PM;
                    };
                  else if (this.props.bookingTime === "AMPM")
                    isAvailableAt = (desk) => {
                      return desk.AM && desk.PM;
                    };
                  else return "Not-Available";
                  for (let i in Object.keys(day)) {
                    let key = Object.keys(day[i]);
                    if (isAvailableAt(day[i][key])) return "NONE-Booked";
                  }
                  return "ALL-Booked";
                }
              }
            }
          }
        }
      }
    }
    return "Not-Available"; //Temporary: Need database information for desks in each area. Will always be green.
  };

  getDate = (e) => {
    let dateComponent = String(e).split(" ");
    return dateComponent[2] + " " + dateComponent[1] + " " + dateComponent[3];
  };

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

  returnDeskList = (e) => {
    let dateComponent = String(e).split(" ");
    let desks = [];
    let area = this.state[this.state.chosenArea];
    if (area) {
      for (let y in area) {
        let year = area[y][dateComponent[3]];
        if (year) {
          for (let m in year) {
            let month = year[m][dateComponent[1]];
            if (month) {
              for (let d in month) {
                let day = month[d][dateComponent[2]];
                if (day) {
                  let isAvailableAt;

                  if (this.props.bookingTime === "AM")
                    isAvailableAt = (desk) => {
                      return desk.AM;
                    };
                  else if (this.props.bookingTime === "PM")
                    isAvailableAt = (desk) => {
                      return desk.PM;
                    };
                  else if (this.props.bookingTime === "AMPM")
                    isAvailableAt = (desk) => {
                      return desk.AM && desk.PM;
                    };
                  else
                    isAvailableAt = () => {
                      return false;
                    };
                  for (let i in Object.keys(day)) {
                    let key = Object.keys(day[i]);
                    if (isAvailableAt(day[i][key])) desks.push(day[i]);
                  }
                }
              }
            }
          }
        }
      }
    }
    return desks;
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
          tileClassName={this.checkAvailability1}
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
