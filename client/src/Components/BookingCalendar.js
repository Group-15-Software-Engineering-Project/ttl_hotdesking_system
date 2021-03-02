import { Calendar } from "react-calendar";
import "./Calendar.css";
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
      "Front Square 1": [
        {
          2021: [
            {
              Mar: [
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
                        PM: true,
                      },
                    },
                    {
                      Desk5: {
                        AM: true,
                        PM: true,
                      },
                    },
                  ], // Feb 02 close
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
      chosenArea: "Front Square 1",
    });
  }

  checkBookings = (dateTileInfo) => {
    if (dateTileInfo["view"] === "month") {
      let dateComponent = String(dateTileInfo["date"]).split(" ");
      //get area data from database
      let area = this.state[this.props.chosenArea];
      if (area) {
        let year = area[0][dateComponent[3]];
        if (year) {
          let month = year[0][dateComponent[1]];
          if (month) {
            let day = month[0][dateComponent[2]];
            if (day) {
              let freeDesksAM = false;
              let freeDesksPM = false;
              for (let i in Object.keys(day)) {
                let key = Object.keys(day[i]);
                if (!freeDesksAM) freeDesksAM = day[i][key].AM;
                if (!freeDesksPM) freeDesksPM = day[i][key].PM;
                if (freeDesksPM && freeDesksAM) return "NONE-Booked";
              }
              if (freeDesksAM && !freeDesksPM) return "PM-Booked";
              else if (freeDesksPM && !freeDesksAM) return "AM-Booked";
              else return "ALL-Booked";
            }
          }
        }
      }
      return "Not-Available";
    }
  };

  render() {
    return (
      <div style={{ marginTop: "5%" }}>
        <Calendar
          tileClassName={this.props.viewBookings ? this.checkBookings : {}}
          onChange={
            this.props.viewBookings
              ? (e) => {
                  let a = String(e).split(" ");
                  this.setState({
                    selectedDate: a[2] + " " + a[1] + " " + a[3],
                  });
                  this.forceUpdate();
                  this.props.chosenDate(a[2] + " " + a[1] + " " + a[3]);
                  this.props.getChosenDesks(
                    this.state[this.state.chosenArea][0][a[3]][0][a[1]][0][a[2]]
                      ? this.state[this.state.chosenArea][0][a[3]][0][a[1]][0][
                          a[2]
                        ]
                      : []
                  );
                }
              : null
          }
        ></Calendar>
      </div>
    );
  }
}
