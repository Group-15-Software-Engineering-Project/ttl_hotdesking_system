import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
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
      teamlist: [],
      error: "",
      isError: false,
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
        } else {
          this.setState({ roomlist: res.data });
        }
      })
      .catch((err) => {});

    fetch("/api/getTeams", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          alert("Could not get Users");
        } else {
          this.setState({ teamlist: res.teams });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: "bottom",
  };
  reset() {}
  toLabelArray = (data, label) => {
    let arr = [];
    for (let d in data) {
      arr.push(label + " " + data[d]);
    }
    return arr;
  };
  getData = () => {
    let chosenTeam = this.state.chosenTeam;
    if (this.state.chosenTeam !== "1") {
      chosenTeam = " NAME='" + this.state.chosenTeam + "'";
    }
    fetch("/api/getReports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: this.state.chosenTimeRange.toLowerCase(),
        room: this.state.chosenLocation,
        team: chosenTeam,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          error: res.message,
          isError: res.isError,
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
              "Saturday",
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
            labels: this.toLabelArray(res.desks),
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
    return verify(true) ? (
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
            <button className="button-style no-outline" onClick={() => this.getData()}>
              Run Report
            </button>
          </section>
          <div className="space" />
          {this.state.graphsVisible ? (
            <div>
              {!this.state.isError ? (
                <div>
                  <div
                    style={{
                      width: "70%",
                      marginLeft: "15%",
                      marginBottom: "5%",
                    }}
                  >
                    <Bar
                      data={this.state.barData}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                                precision: 0,
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
                  </div>
                  <div className="space" style={{ marginBottom: "5%" }} />
                  <div
                    style={{
                      width: "70%",
                      marginLeft: "15%",
                      marginBottom: "5%",
                    }}
                  >
                    <Bar
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
                  </div>
                  <div className="space" style={{ marginBottom: "5%" }} />
                  {this.state.chosenLocation !== "overall" ? (
                    <div
                      style={{
                        width: "70%",
                        marginLeft: "15%",
                        marginBottom: "5%",
                      }}
                    >
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
              ) : (
                <h1>{this.state.error}</h1>
              )}
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
