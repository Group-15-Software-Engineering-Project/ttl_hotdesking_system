import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Redirect } from "react-router-dom";
import "../public/css/main.css";

class Reports extends Component {
  constructor() {
    super();
    this.state = {
      timeRanges: ["Next week", "Last week", "Last month", "Last 3 months"],
      time: "overall",
      room: "overall",
      team: "overall",
      chosenLocation: "",
      chosenTimeRange: "",
      graphsVisible: false,
      chosenTeam: "",
      roomlist: [],
      teamlist: ["All", "team1", "team2", "team3"],
      barData: {
        labels: [
          "User1",
          "User2",
          "User3",
          "User4",
          "User5",
          "User6",
          "User1",
          "User2",
          "User3",
          "User4",
          "User5",
          "User6",
        ],
        datasets: [
          {
            label: "Hours",
            data: [58, 50, 40, 30, 20, 9, 58, 50, 40, 30, 20, 9],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
            ],
          },
        ],
      },

      lineData: {
        labels: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Sataurday",
          "Sunday",
        ],
        datasets: [
          {
            label: "Day",
            data: [10, 8, 9, 6, 6, 2, 1],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      },

      pieData: {
        labels: [],
        datasets: [
          {
            label: "Desk",
            data: [40, 30, 20, 25, 35, 80],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      },
    };
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
    fetch("/api/getLocationData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          console.log("error fetching location data");
        } else {
          this.setState({ roomlist: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: "bottom",
  };
  reset() {}

  getData = () => {
    fetch("/api/getReports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: this.state.chosenTimeRange.toLowerCase(),
        room: this.state.chosenLocation,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          graphsVisible: true,
          barData: {
            labels: res.labels,
            datasets: [
              {
                label: "Bookings",
                data: res.amountOfBookings,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },

          lineData: {
            labels: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Sataurday"
            ],
            datasets: [
              {
                label: "Day",
                data: res.activeDays,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },

          pieData: {
            labels: res.desks,
            datasets: [
              {
                label: "Desk",
                data: res.deskBookings,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
              },
            ],
          },
        });
      });
  };
  handleEvent = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return sessionStorage.__user_is_admin__ ? (
      <div className="wrapper TCD-BG">
        <div className="flex-container-1" />
        <div className="flex-container-5 main-body">
          <section>
            <div className="space" />
            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
              Reports
            </h1>
            <div className="space" />

            <div
              style={{
                display: "flex",
                height: "20%",
                flexFlow: "row wrap",
                justifyContent: "flex-start",
              }}
            >
              <div style={{ flex: "1", height: "100%" }}>
                <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                  Time Range
                </h1>
                <div className="space" />
                <select
                  name="chosenTimeRange"
                  className="text-input"
                  style={{ padding: "0" }}
                  onChange={this.handleEvent}
                >
                  <option value="">Select time range</option>
                  <option value="overall">All time</option>
                  {this.state.timeRanges.map((x) => {
                    return <option value={x}>{x}</option>;
                  })}
                </select>
              </div>
              <div style={{ flex: "1", height: "100%" }}>
                <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                  Locations
                </h1>
                <div className="space" />
                <select
                  name="chosenLocation"
                  className="text-input"
                  style={{ padding: "0" }}
                  onChange={this.handleEvent}
                >
                  <option value="">Select location</option>
                  <option value="overall">All</option>
                  {this.state.roomlist.map((x) => {
                    return <option value={x.name}>{x.name}</option>;
                  })}
                </select>
              </div>
              <div style={{ flex: "1", height: "100%" }}>
                <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                  Teams
                </h1>
                <div className="space" />
                <select
                  name="chosenTeam"
                  className="text-input"
                  style={{ padding: "0" }}
                  onChange={this.handleEvent}
                >
                  <option value="">Select team</option>
                  {this.state.teamlist.map((x) => {
                    return <option value={x}>{x}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="space" />
            <button className="button-style" onClick={() => this.getData()}>
              Run Report
            </button>
          </section>
          <div className="space" />
          {this.state.graphsVisible ? (
            <div>
              <Bar
                data={this.state.barData}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          userCallback: function (label, index, labels) {
                            if (Math.floor(label) === label) {
                              return label;
                            }
                          },
                        },
                      },
                    ],
                  },
                  title: {
                    display: this.props.displayTitle,
                    text: "Most active user",
                    fontSize: 25,
                  },
                  legend: {
                    display: this.props.displayLegend,
                    position: this.props.legendPosition,
                  },
                }}
              />
              <div className="space" style={{ marginBottom: "5%" }} />
              <Line
                data={this.state.lineData}
                options={{
                  title: {
                    display: this.props.displayTitle,
                    text: "Most active day",
                    fontSize: 25,
                  },
                  legend: {
                    display: this.props.displayLegend,
                    position: this.props.legendPosition,
                  },
                }}
              />
              <div className="space" style={{ marginBottom: "5%" }} />

              <Pie
                data={this.state.pieData}
                options={{
                  title: {
                    display: this.props.displayTitle,
                    text: "Most used desk",
                    fontSize: 25,
                  },
                  legend: {
                    display: this.props.displayLegend,
                    position: this.props.legendPosition,
                  },
                }}
              />
            </div>
          ) : null}
        </div>
        <div className="flex-container-1" />
      </div>
    ) : (
      <Redirect to="/home" />
    );
  }
}

export default Reports;
