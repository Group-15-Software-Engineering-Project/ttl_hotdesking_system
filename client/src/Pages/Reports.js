import React, { Component } from "react";
import BarChart from "../Components/BarChart.js";
import LineChart from "../Components/LineChart.js";
import PieChart from "../Components/PieChart.js";

class Reports extends Component {
  constructor() {
    super();
    this.state = {
      barData: {},
      lineData: {},
      pieData: {},
    };
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    // Ajax calls here
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

  render() {
    return (
      <div className="reports">
        <BarChart barData={this.state.barData} legendPosition="bottom" />
        <LineChart lineData={this.state.lineData} legendPosition="bottom" />
        <PieChart pieData={this.state.pieData} legendPosition="bottom" />
      </div>
    );
  }
}

export default Reports;
