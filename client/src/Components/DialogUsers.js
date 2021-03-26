import React, {Component} from 'react'
import DayChooser from './DayChooser';
import '../public/css/Dialog.css'

class DialogUsers extends Component {

    state = {
        firstName: "",
        lastName: "",
        fullName: "",
        team: ""
    }

    handleFirstName = event => {
        this.setState({ firstName: event.target.value });
    }

    handleLastName = event => {
        this.setState({ lastName: event.target.value });
    }

    handleTeam = event => {
        this.setState({ team: event.target.value });
    }

    handleFullName = event => {
        this.setState({ fullName: event.target.value });
    }

    handleSubmit = () => {
        console.log(this.state);
    };

    render() {
        let dialog = ""
        if (this.props.isFirstOpen) {
            dialog = (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="close-btn" onClick={this.props.onClose}>x</button>
                        <p>First Name:</p>
                        <input type="text" onChange={this.handleFirstName}></input>
                        <p>Last Name:</p>
                        <input type="text" onChange={this.handleLastName}></input>
                        <p>Team:</p>
                        <div>
                            <select value={this.state.team} onChange={this.handleTeam}>
                                <option>Academic Affairs</option>
                                <option>Quality</option>
                                <option>Academic Practice</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <button onClick={this.handleSubmit}>submit</button>
                    </div>
                </div>
            )
        } else if (this.props.isSecondOpen) {
            dialog = (
                <div className="popup">
                    <div className="popup-inner">
                        <button className="close-btn" onClick={this.props.onClose}>x</button>
                        <div> Please choose the user to delete</div>
                        <div>
                            <select value={this.state.fullName} onChange={this.handleFullName}>
                                <option>Yifan Zhu</option>
                                <option>Dummy Value</option>
                            </select>
                        </div>
                        <button onClick={this.handleSubmit}>submit</button>
                    </div>
                </div>
            )
        } else {
            dialog = null
        }
        return (
            <div>
                {dialog}
            </div>
        )
    }
}

export default DialogUsers