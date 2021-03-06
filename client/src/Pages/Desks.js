import React, { Component } from "react";
import Dialog from "../Components/Dialog";

class Desks extends Component {
  state = {
    isFirstOpen: false,
    isSecondOpen: false,
  };
  render() {
    return (
      <div className="desks">
        <br></br>
        <h1>AAAAAA</h1>
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
        <Dialog
          isFirstOpen={this.state.isFirstOpen}
          isSecondOpen={this.state.isSecondOpen}
          onClose={(e) =>
            this.setState({ isFirstOpen: false, isSecondOpen: false })
          }
        ></Dialog>
      </div>
    );
  }
}

export default Desks;
