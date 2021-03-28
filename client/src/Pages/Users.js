import React, { Component } from "react";
import DialogUsers from "../Components/DialogUsers";
import AddUsers from "../Components/AddUsers";
import User from "../Components/User";

class Users extends Component {
  
  state = {
    addEmail: "",
    addPassword: "",
    deleteEmail: "",
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
        password: password
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
 
  addEmailF = event => {
    this.setState({ addEmail: event.target.value });
  }  

  addPasswordF = event => {
    this.setState({ addPassword: event.target.value });
  } 

  deleteEmailF = event => {
  this.setState({ deleteEmail: event.target.value });
  }
  
  render() {
    return (
      <div className="desks">
        <div>
          <h3>Add user:</h3>
          <input type="email" onChange={this.addEmailF}></input>
          <br></br><br></br>
          <input type="text" onChange={this.addPasswordF}></input>
          <button
            onClick={(e) =>
              this.submitAddUser(this.state.addEmail, this.state.addPassword)
            }
          >
            {" "}Add User{" "}
          </button>
        </div>
          
        <div>
          <h3>Delete user:</h3>
          <input type="text" onChange={this.deleteEmailF}></input>
          <button
            onClick={(e) =>
              this.submitRemoveUser(this.state.deleteEmail)
            }
          >
            {" "}Delete User{" "}
          </button>
        </div>


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
            this.setState({ isFirstOpen: false, isSecondOpen: true })
          }
        >
          {" "}
          Delete users{" "}
        </button>



        
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
