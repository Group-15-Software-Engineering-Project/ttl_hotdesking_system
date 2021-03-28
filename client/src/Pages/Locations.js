import React, { Component } from "react";
import Desk from "../Components/Desk";

class Locations extends Component {
  state = {
    addRoom: "",
    deleteRoom: "",
    addDeskNum: "",
    addDeskRoom: "",
    deleteDeskNum: "",
    deleteDeskRoom: "",
    desks: []
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

  submitAddDesk = (desk, room) => {
    fetch("/api/addDesk", {
      method: "POST",
      headers: {
        "Content-Type" :"application/json"
      },
      body: JSON.stringify({
        desk: desk,
        room, room
      })
    })
    .then((res) => {
      return res.json
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

  submitRemoveDesk = (desk, room) => {
    fetch("/api/removeDesk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({
        desk: desk,
        room: room
      })
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        alert(res.message);
      } else {
        alert("Success");
      }
    })
  };

  submitRemoveRoom = (room) => {
    fetch("/api/removeRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        room: room
      })
    })
    .then((res) => {
      return res.json();
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
    })
  };
 
  addRoomF = event => {
    this.setState({ addRoom: event.target.value });
  }  

  deleteRoomF = event => {
    this.setState({ deleteRoom: event.target.value });
  } 

  addDeskNumF = event => {
    this.setState({ addDeskNum: event.target.value });
  }  

  addDeskRoomF = event => {
    this.setState({ addDeskRoom: event.target.value });
  }  

  deleteDeskNumF = event => {
    this.setState({ deleteDeskNum: event.target.value });
  }  

  deleteDeskRoomF = event => {
    this.setState({ deleteDeskRoom: event.target.value });
  } 

  render() {
    return (
      <div className="desks">
        <div>
          <h3>Add Room:</h3>
          <input type="text" onChange={this.addRoomF}></input>
          <button
            onClick={(e) =>
              this.submitAddRoom(this.state.addRoom)
            }
          >
            {" "}Add Room{" "}
          </button>
        </div>
          
        <div>
          <h3>Delete Room:</h3>
          <input type="text" onChange={this.deleteRoomF}></input>
          <button
            onClick={(e) =>
              this.submitRemoveRoom(this.state.deleteRoom)
            }
          >
            {" "}Delete Room{" "}
          </button>
        </div>        

        <div>
          <h3>Add Desk:</h3>
          <input type="text" onChange={this.addDeskNumF}></input>
          <br></br><br></br>
          <input type="text" onChange={this.addDeskRoomF}></input>
          <button
            onClick={(e) =>
              this.submitAddDesk(this.state.addDeskNum, this.state.addDeskRoom)
            }
          >
            {" "}Add Desk{" "}
          </button>
        </div>
          
        <div>
          <h3>Delete Desk:</h3>
          <input type="text" onChange={this.deleteDeskNumF}></input>
          <br></br><br></br>
          <input type="text" onChange={this.deleteDeskRoomF}></input>
          <button
            onClick={(e) =>
              this.submitRemoveDesk(this.state.deleteDeskNum, this.state.deleteDeskRoom)
            }
          >
            {" "}Delete Desk{" "}
          </button>
        </div>

        <br></br><br></br><br></br>
        <h2>
          Desks
        </h2>
        <div>{this.state.desks.map(desk => <Desk desk={desk} />)}</div>
      </div>
    );
  }
}

export default Locations;
