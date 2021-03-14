import React, { Component } from "react";
import DialogUsers from "../Components/DialogUsers";

class Users extends Component {
  state = {
    isFirstOpen: false,
    isSecondOpen: false,
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
          Add users{" "}
        </button>
        <p>&nbsp;</p>
        <button
          onClick={(e) =>
            this.setState({ isFirstOpen: false, isSecondOpen: true })
          }
        >
          {" "}
          Delete users{" "}
        </button>
        <DialogUsers
          isFirstOpen={this.state.isFirstOpen}
          isSecondOpen={this.state.isSecondOpen}
          onClose={(e) =>
            this.setState({ isFirstOpen: false, isSecondOpen: false })
          }
        ></DialogUsers>
      </div>
    );
  }
}

export default Users;
