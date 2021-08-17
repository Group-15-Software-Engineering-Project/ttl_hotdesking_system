import "../public/css/Calendar.css";
import React from "react";
import GlassCalendar from "./GlassCalendar";
import { months, getDifferenceInDays } from "./Misc";

export default class BookingCalendarNoLimit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todayDate: "",
            selectedDate: "",
            currentMonth: "",
            availableDesks: "",
            existingBookings: [],
            key: 0,
            dayLimit: 30,
        };
    }

    componentDidMount() {
        let date = new Date();
        let curMonth =
            date.getFullYear() +
            "-" +
            (String(date.getMonth() + 1).length === 1 ? "0" : "") +
            (date.getMonth() + 1);

        this.setState({
            todayDate:
                date.getFullYear() * 10000 + (date.getMonth() + 1) * 31 + date.getDate(),
            selectedDate:
                date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
            chosenArea: this.props.chosenArea,
            currentMonth: curMonth,
        });
    }

    checkAvailability = (dateInfo) => {
        let date = String(dateInfo.date).split(" ");
        let year = parseInt(date[3]);
        let month = months.indexOf(date[1]) + 1;
        let day = parseInt(date[2]);

        let date1 = new Date(`${year}/${month}/${day}`);
        let date2 = new Date();
        let diff = getDifferenceInDays(date1, date2);
        if (diff > 0) return "NONE-Booked";
        else return "Not-Available";
    };

    getDate = (e) => {
        let dateComponent = String(e).split(" ");
        return (
            dateComponent[3] +
            "-" +
            String(months.indexOf(dateComponent[1]) + 1).padStart(2, "0") +
            "-" +
            dateComponent[2]
        );
    };

    disabledTiles = (e) => {
        let date = String(e).split(" ");
        let year = parseInt(date[3]);
        let month = months.indexOf(date[1]) + 1;
        let day = parseInt(date[2]);

        let date1 = new Date(`${year}/${month}/${day}`);
        let date2 = new Date();
        let diff = getDifferenceInDays(date1, date2);
        return diff < 1;
    };

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5%",
                    marginBottom: "5%",
                }}>
                <GlassCalendar
                    hideLanguageToggle
                    highlight="sat sun"
                    tileClassName={this.checkAvailability}
                    disableTile={this.disabledTiles}
                    onDaySelect={(e) => {
                        this.props.onSelect(this.getDate(e));
                    }}></GlassCalendar>
            </div>
        );
    }
}
