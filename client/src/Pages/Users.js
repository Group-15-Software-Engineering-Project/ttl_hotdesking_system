import React, { Component } from "react";
import DialogUsers from "../Components/DialogUsers";
import AddUsers from "../Components/AddUsers";
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

  submitRemoveUser = (email) => {
    fetch("/api/removeUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
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
      alert("Could not remove user:\n", err);
    });
  };

  submitAddUser = (email, password) => {
    fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({
        email: email,
        pasword: password
      })
    })
    .then((res) => {return res.json()})
    .then((res) => {
      if (res.error === false) {
        alert("Success!");
      } else {
        alert("Could not add user.");
        alert(res.message);
      }
    })
    .catch((err) => {
      alert(err);
    });
  };


  update() {
    this.setState({users: [

    ]})
  }

  checkForm(e) {
    console.log(e);
  }
  
  render() {
    return (
      <div className="desks">
        <br></br>
        <div>

          
          <button
            onClick={(e) =>
              this.setState({ isFirstOpen: true, isSecondOpen: false }),
              this.checkForm("test")
            }
          >
            {" "}
            Add users{" "}
        </button>
        </div>
        <p>&nbsp;</p>

        <button
          onClick={(e) =>
            this.setState({ isFirstOpen: true, isSecondOpen: true }),
            submitAddUser(this.state)
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
