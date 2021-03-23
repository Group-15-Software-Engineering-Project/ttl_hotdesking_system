import { Calendar } from "react-calendar";
import "../public/css/Calendar.css";
import React from "react";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
    };
  }

  componentDidMount() {
    let date = new Date();
    this.setState({
      selectedDate:
        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear(),
      chosenArea: this.props.chosenArea,
    });
  }

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

  // checkBookings = (dateTileInfo) => {
  //   if (dateTileInfo["view"] === "month") {
  //     let dateComponent = String(dateTileInfo["date"]).split(" ");
  //     //get area data from database
  //     let area = this.state[this.props.chosenArea];
  //     if (area) {
  //       let year = area[0][dateComponent[3]];
  //       if (year) {
  //         let month = year[0][dateComponent[1]];
  //         if (month) {
  //           let day = month[0][dateComponent[2]];
  //           if (day) {
  //             let freeDesksAM = false;
  //             let freeDesksPM = false;
  //             for (let i in Object.keys(day)) {
  //               let key = Object.keys(day[i]);
  //               if (!freeDesksAM) freeDesksAM = day[i][key].AM;
  //               if (!freeDesksPM) freeDesksPM = day[i][key].PM;
  //               if (freeDesksPM && freeDesksAM) return "NONE-Booked";
  //             }
  //             if (freeDesksAM && !freeDesksPM) return "PM-Booked";
  //             else if (freeDesksPM && !freeDesksAM) return "AM-Booked";
  //             else return "ALL-Booked";
  //           }
  //         }
  //       }
  //     }
  //     return "NONE-Booked";
  //   }
  // };

  getDate = (e) => {
    let dateComponent = String(e).split(" ");
    return dateComponent[2] + " " + dateComponent[1] + " " + dateComponent[3];
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
          minDetail="month"
          maxDetail="month"
          defaultView="month"
          prev2Label={null}
          next2Label={null}
          tileClassName={this.checkAvailability}
          onChange={(e) => {
            this.props.onSelect(this.returnDeskList(e), this.getDate(e));
          }}
        ></Calendar>
      </div>
    );
  }
}
