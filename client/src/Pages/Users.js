import React, { Component } from "react";
import DialogUsers from "../Components/DialogUsers";
import User from "../Components/User";

class Users extends Component {
  state = {
    isFirstOpen: false,
    isSecondOpen: false,
    users: [{
        id: 1,
        firstName: 'Bruce',
        lastName: 'Lee',
        email: 'Bruce@tcd.ie',
        team: 'Academic Affairs',
        time: 100
      },
      {
        id: 2,
        firstName: 'Tom',
        lastName: 'Brian',
        email: 'Tom@tcd.ie',
        team: 'Quality',
        time: 50
      },
      {
        id: 3,
        firstName: 'Jerry',
        lastName: 'Brian',
        email: 'Jerry@tcd.ie',
        team: 'Academic Practice',
        time: 30
      }]
  };


  update() {
    this.setState({users: [

    ]})
  }

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
        <br></br><br></br><br></br>
        <h2>
          First Name{Array(30).fill('\xa0').join('')}Last Name{Array(40).fill('\xa0').join('')}Email{Array(65).fill('\xa0').join('')}Team{Array(60).fill('\xa0').join('')}Usage Time in Last Month
        </h2>
        <div>{this.state.users.map(user => <User key={user.id} user={user} />)}</div>
      </div>
    );
  }
}

export default Users;
