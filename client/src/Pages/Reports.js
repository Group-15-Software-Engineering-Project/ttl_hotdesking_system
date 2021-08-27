import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
import "../public/css/main.css";

class Reports extends Component {
    constructor() {
        super();
        this.state = {
            timeRanges: [
                "Next week",
                "Last week",
                "Last month",
                "Last 3 months",
            ],
            time: "overall",
            room: "overall",
            team: "overall",
            chosenLocation: "",
            chosenTimeRange: "",
            graphsVisible: false,
            chosenTeam: "",
            roomlist: [],
            teamlist: [],
            week: [],
            error: "",
            isError: false,
            userData: {},
            dayData: {},
            deskData: {},
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ]
        };
    }
    componentDidMount = () => {
        window.scrollTo(0, 0);
        fetch("/api/getLocationData")
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

        fetch("/api/adminOptions/Desk_Booking_Range")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert("Could not get Users");
                } else {
                    this.setState({ week: res.option });
                    console.log("NUmber of weeks", res.option);
                }
            })
            .catch((err) => {
                alert(err);
            });

        fetch("/api/getGroups")
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
        fetch("/api/getReports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                time: this.state.chosenTimeRange.toLowerCase(),
                room: this.state.chosenLocation,
                team: this.state.chosenTeam,
                week: this.state.week,
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
                    userData: {
                        labels: res.labels,
                        datasets: [
                            {
                                label: "Bookings",
                                data: res.amountOfBookings,
                                backgroundColor: this.state.backgroundColor,
                            },
                        ],
                    },

                    dayData: {
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
                                backgroundColor: this.state.backgroundColor,
                            },
                        ],
                    },

                    deskData: {
                        labels: this.toLabelArray(res.desks),
                        datasets: [
                            {
                                label: "Desk",
                                data: res.deskBookings,
                                backgroundColor: this.state.backgroundColor,
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
                        <h1
                            className="page-divider-header"
                            style={{ marginLeft: "2.5%" }}
                        >
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
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}
                                >
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
                                    {this.state.week.value > 1 ? (
                                        <option value="upcomingWeek">
                                            Next {this.state.week.value} weeks
                                        </option>
                                    ) : null}
                                    {console.log(
                                        "This is weeks",
                                        this.state.week
                                    )}
                                    {this.state.timeRanges.map((x) => {
                                        return <option value={x}>{x}</option>;
                                    })}
                                </select>
                            </div>
                            <div style={{ flex: "1", height: "100%" }}>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}
                                >
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
                                    {this.state.roomlist
                                        ? this.state.roomlist.map((x) => {
                                              return (
                                                  <option
                                                      key={x.name}
                                                      value={x.name}
                                                  >
                                                      {x.name}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                            </div>
                            <div style={{ flex: "1", height: "100%" }}>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}
                                >
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
                        <button
                            className="button-style no-outline"
                            onClick={() => this.getData()}
                        >
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
                                            data={this.state.userData}
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
                                                    display:
                                                        this.props.displayTitle,
                                                    text: "Most active user",
                                                    fontSize: 25,
                                                },
                                                legend: {
                                                    display:
                                                        this.props
                                                            .displayLegend,
                                                    position:
                                                        this.props
                                                            .legendPosition,
                                                },
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="space"
                                        style={{ marginBottom: "5%" }}
                                    />
                                    <div
                                        style={{
                                            width: "70%",
                                            marginLeft: "15%",
                                            marginBottom: "5%",
                                        }}
                                    >
                                        <Bar
                                            data={this.state.dayData}
                                            options={{
                                                title: {
                                                    display:
                                                        this.props.displayTitle,
                                                    text: "Most active day",
                                                    fontSize: 25,
                                                },
                                                legend: {
                                                    display:
                                                        this.props
                                                            .displayLegend,
                                                    position:
                                                        this.props
                                                            .legendPosition,
                                                },
                                            }}
                                        />
                                    </div>
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
