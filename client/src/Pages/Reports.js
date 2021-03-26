import React, { Component } from "react";
import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';

class Reports extends Component {

  constructor() {
    super();
    this.state = {
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hours",
            data: [58, 50, 40, 30, 20, 9],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
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

  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition:'bottom'
  }

  overall() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hours",
            data: [58, 50, 40, 30, 20, 9],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
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
    });
  }

  lastWeek() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [58, 10, 30, 40, 10, 9],
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
            data: [10, 5, 2, 6, 3, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 30, 20, 15, 35, 80],
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
  }

  lastMonth() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [38, 10, 20, 49, 10, 9],
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
            data: [1, 5, 12, 6, 7, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 30, 70, 15, 35, 50],
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
  }

  nextWeek() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [28, 10, 30, 10, 10, 9],
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
            data: [1, 5, 2, 3, 3, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 10, 20, 15, 35, 10],
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
  }

  nextMonth() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [28, 10, 15, 20, 10, 9],
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
            data: [5, 5, 2, 1, 7, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 30, 10, 25, 35, 70],
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
  }

  westTheatre2() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [28, 10, 25, 20, 20, 9],
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
            data: [5, 5, 8, 1, 7, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 30, 10, 25, 35, 10],
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
  }

  westTheatre3() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [18, 10, 15, 20, 40, 9],
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
            data: [5, 3, 2, 1, 7, 2, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 30, 10, 55, 35, 70],
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
  }

  fosterPlace() {
    this.setState({
      barData: {
        labels: ["User1", "User2", "User3", "User4", "User5", "User6"],
        datasets: [
          {
            label: "Hour",
            data: [28, 10, 15, 5, 10, 9],
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
            data: [5, 5, 2, 1, 3, 8, 1],
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
        labels: ["Desk 1", "Desk 2", "Desk 3", "Desk 4", "Desk", "Other desks"],
        datasets: [
          {
            label: "Desk",
            data: [20, 40, 10, 65, 35, 50],
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
  }



  render() {
    return (
      <div>
        <div>
          <p>Time range:</p>
          <button
            onClick={(e) =>
              this.overall()
            }
          >Overall</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.lastWeek()
            }
          >Last Week</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.lastMonth()
            }
          >Last Month</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.nextWeek()
            }
          >Next Week</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.nextMonth()
            }
          >Next Month</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

          <p>Room:</p>
          <button
            onClick={(e) =>
              this.overall()
            }
          >Overall</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.westTheatre2()
            }
          >Office 2.5 West Theatre</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.westTheatre3()
            }
          >Office 3.2 West Theatre</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <button
            onClick={(e) =>
              this.fosterPlace()
            }
          >Office 3.06 Foster Place</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </div>
        <div className="reports" style={{ position: "relative", margin: "auto", width: "33vw" }}>
          <Bar 
            data={this.state.barData}
            options={{
              title:{
                display:this.props.displayTitle,
                text:'Most active user',
                fontSize:25
              },
              legend:{
                display:this.props.displayLegend,
                position:this.props.legendPosition
              },
            }}
          />
          <Line
            data={this.state.lineData}
            options={{
              title:{
                display:this.props.displayTitle,
                text:'Most active day',
                fontSize:25
              },
              legend:{
                display:this.props.displayLegend,
                position:this.props.legendPosition
              },
            }}
          />
          <Pie
            data={this.state.pieData}
            options={{
              title:{
                display:this.props.displayTitle,
                text:'Most used desk',
                fontSize:25
              },
              legend:{
                display:this.props.displayLegend,
                position:this.props.legendPosition
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Reports;
