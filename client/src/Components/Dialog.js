import React, {Component} from 'react'
import DayChooser from './DayChooser';
import './Dialog.css'

class Dialog extends Component {

    state = {
        desk: "Desks 1 in Office 2.5 West Theatre",
        time: "Full day",
        title: "Unavailable for anyone"
    }

    handleDesk = event => {
        this.setState({ desk: event.target.value });
    }

    handleTime = event => {
        this.setState({ time: event.target.value });
    }

    handleUser = event => {
        this.setState({ title: event.target.value });
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
                        <div> Please choose the desk, the day and the users </div>
                        <div>
                            <select value={this.state.desk} onChange={this.handleDesk}>
                                <option>Desks 1 in Office 2.5 West Theatre</option>
                                <option>Desks 2 in Office 2.5 West Theatre</option>
                                <option>Desks 3 in Office 2.5 West Theatre</option>
                                <option>Desks 4 in Office 2.5 West Theatre</option>
                                <option>Desks 5 in Office 2.5 West Theatre</option>
                                <option>Desks 6 in Office 3.2 West Theatre</option>
                                <option>Desks 7 in Office 3.2 West Theatre</option>
                                <option>Desks 8 in Office 3.2 West Theatre</option>
                                <option>Desks 9 in Office 3.2 West Theatre</option>
                                <option>Desks 10 in Office 3.2 West Theatre</option>
                                <option>Desks 11 in Office 3.2 West Theatre</option>
                                <option>Desks 12 in Office 3.2 West Theatre</option>
                                <option>Desks 13 in Office 3.06 Foster Place</option>
                                <option>Desks 14 in Office 3.06 Foster Place</option>
                                <option>Desks 15 in Office 3.06 Foster Place</option>
                                <option>Desks 16 in Office 3.06 Foster Place</option>
                                <option>Desks 17 in Office 3.06 Foster Place</option>
                                <option>Desks 18 in Office 3.06 Foster Place</option>
                            </select>
                        </div>
                        <div>
                            <DayChooser className="day-chooser"/>
                        </div>
                        <div>
                            <select value={this.state.time} onChange={this.handleTime}>
                                <option>Full day</option>
                                <option>Morning</option>
                                <option>Afternoon</option>
                            </select>
                        </div>
                        <div>
                            <select value={this.state.title} onChange={this.handleUser}>
                                <option>Unavailable for anyone</option>
                                <option>Academic Affairs Only</option>
                                <option>Quality Only</option>
                                <option>Academic Practice Only</option>
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
                        <div> Please choose the desk </div>
                        <div>
                            <select value={this.state.desk} onChange={this.handleDesk}>
                                <option>Desks 1 in Office 2.5 West Theatre</option>
                                <option>Desks 2 in Office 2.5 West Theatre</option>
                                <option>Desks 3 in Office 2.5 West Theatre</option>
                                <option>Desks 4 in Office 2.5 West Theatre</option>
                                <option>Desks 5 in Office 2.5 West Theatre</option>
                                <option>Desks 6 in Office 3.2 West Theatre</option>
                                <option>Desks 7 in Office 3.2 West Theatre</option>
                                <option>Desks 8 in Office 3.2 West Theatre</option>
                                <option>Desks 9 in Office 3.2 West Theatre</option>
                                <option>Desks 10 in Office 3.2 West Theatre</option>
                                <option>Desks 11 in Office 3.2 West Theatre</option>
                                <option>Desks 12 in Office 3.2 West Theatre</option>
                                <option>Desks 13 in Office 3.06 Foster Place</option>
                                <option>Desks 14 in Office 3.06 Foster Place</option>
                                <option>Desks 15 in Office 3.06 Foster Place</option>
                                <option>Desks 16 in Office 3.06 Foster Place</option>
                                <option>Desks 17 in Office 3.06 Foster Place</option>
                                <option>Desks 18 in Office 3.06 Foster Place</option>
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

export default Dialog