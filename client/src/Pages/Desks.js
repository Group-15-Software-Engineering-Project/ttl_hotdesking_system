import React, { Component } from "react";
import DialogDesks from "../Components/DialogDesks";

class Desks extends Component {
  state = {
    isFirstOpen: false,
    isSecondOpen: false,
  };

  submitAddRoom = (room) => {
    fetch("/api/addDesk", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        room: room
      })
    })
    .then((res) => {
      return res.JSON();
    })
    .then((res) => {
      if (res.error) {
        alert(res.message);
      } else {
        alert("Success");
      }
    })
    .catch((err) => {
      alert(err);
    });
  };

  render() {
    return (
      <div className="desks">
        <br></br>
        <button
          onClick={(e) =>
            this.setState({ isFirstOpen: true, isSecondOpen: false })
          }
        >
          {" "}
          Make desks unavailable from booking{" "}
          
        </button>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <button
          onClick={(e) =>
            this.setState({ isFirstOpen: false, isSecondOpen: true })
          }
        >
          {" "}
          Delete desks from the system{" "}
        </button>
        <DialogDesks
          isFirstOpen={this.state.isFirstOpen}
          isSecondOpen={this.state.isSecondOpen}
          onClose={(e) =>
            this.setState({ isFirstOpen: false, isSecondOpen: false })
          }
        ></DialogDesks>
      </div>
    );
  }
}

export default Desks;
