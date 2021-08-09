import React from "react";
import MeetingScheduler from "../Components/MeetingScheduler";
import TileSelection from "../Components/TileSelection";
import "../public/css/main.css";

console.log(React.version);
function MeetingBookings() {
    const [currentWeek, setCurrentWeek] = React.useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - new Date().getDay() + (new Date().getDay() === 6 ? 7 : 0)
        )
    );
    const times = [
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
    ];
    const days = ["offset_space", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const [location, setLocation] = React.useState(null);
    const [day, setDay] = React.useState(0);
    const [startT, setStartTime] = React.useState("");
    const [endT, setEndTime] = React.useState("");
    const [meetingTitle, setMeetingTitle] = React.useState("");
    const numberToTime = (num) => {
        let t = String(num).split(".");
        let res = t[0] + ":" + (t[1] ? (t[1] === "5" ? "30" : "00") : "00");
        return String(res);
    };
    const timeToNumber = (time) => {
        let t = String(time).split(":");
        let res = parseInt(t[0]) + (t[1] === "00" ? 0.0 : 0.5);
        return res;
    };
    const getEndTimes = (day, bookings, currentDate) => {
        let date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + day
        );

        let currentDayBookings = [];
        for (let app of bookings) {
            if (
                app.startDate.getFullYear() === date.getFullYear() &&
                app.startDate.getMonth() === date.getMonth() &&
                app.startDate.getDate() === date.getDate()
            ) {
                currentDayBookings.push(app);
            }
        }
        let validTimes = [];
        let startTime = timeToNumber(startT);

        let minimumTime = 18;
        for (let booking of currentDayBookings) {
            let t =
                booking.startDate.getHours() +
                (booking.startDate.getMinutes() === 30 ? 0.5 : 0.0);
            if (t > startTime && t < minimumTime) {
                minimumTime = t;
            }
        }
        for (let t of times.slice(1, times.length)) {
            if (timeToNumber(t) <= startTime || timeToNumber(t) > minimumTime)
                validTimes.push({ value: t, disabled: true });
            else validTimes.push({ value: t, disabled: false });
        }
        return validTimes;
    };
    const getStartTimes = (day, bookings, currentDate) => {
        let date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + day
        );

        let currentDayBookings = [];
        for (let app of bookings) {
            if (
                app.startDate.getFullYear() === date.getFullYear() &&
                app.startDate.getMonth() === date.getMonth() &&
                app.startDate.getDate() === date.getDate()
            ) {
                currentDayBookings.push(app);
            }
            //Disable all times prior to start (including start)
            //Find the lowest start time from currentBookings
            //disable all times after the lowest startTime
        }
        const excludeTimes = (elems) => {
            let exclude = [];
            for (let elem of elems) {
                let start = elem.startDate;
                let end = elem.endDate;
                let startTime = start.getHours() + (start.getMinutes() === 30 ? 0.5 : 0.0);
                let endTime = end.getHours() + (end.getMinutes() === 30 ? 0.5 : 0.0);
                for (let t = startTime; t < endTime; t += 0.5) {
                    exclude.push(numberToTime(t));
                }
            }
            return exclude;
        };
        let toExclude = excludeTimes(currentDayBookings);
        let res = [];
        for (let t of times) {
            if (t !== "17:30") {
                let excluded = toExclude.indexOf(t) !== -1;
                if (!excluded) {
                    res.push({ value: t, disabled: false });
                } else {
                    res.push({ value: t, disabled: true });
                }
            }
        }
        return res;
    };

    const appointments = [
        {
            title: "SCSS Team Meeting | Foster Place",
            startDate: new Date(2021, 7, 9, 9, 30),
            endDate: new Date(2021, 7, 9, 11, 30),
            location: "Foster Place",
        },
        {
            title: "SCSS Team | Foster Place",
            text: "Well what do we have here?",
            startDate: new Date(2021, 7, 9, 11, 30),
            endDate: new Date(2021, 7, 9, 12, 30),
            location: "Foster Place",
        },
        {
            title: "SCS | Foster Place",
            startDate: new Date(2021, 7, 9, 15, 30),
            endDate: new Date(2021, 7, 9, 16, 30),
            location: "Foster Place",
        },
    ];
    return (
        <div className="wrapper TCD-BG">
            <div className="flex-container-1" />
            <div className="flex-container-5 main-body">
                {/* Select Meeting Room */}
                <TileSelection
                    title={
                        <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                            Select a Meeting Room
                        </h1>
                    }
                    options={[{ value: "Foster Place" }]}
                    size={["175px", "75px"]}
                    showLabel={true}
                    onSelect={setLocation}
                />
                {/* Display if meeting room data obtained. */}
                {location && (
                    <div>
                        <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                            {`Current Bookings for ${location}`}
                        </h1>
                        <h5 style={{ marginTop: "5px", marginBottom: "2%" }}>
                            Scroll down to place your booking.
                        </h5>
                        <div
                            style={{
                                width: "80%",
                                marginLeft: "10%",
                                borderRadius: "20px",
                                boxShadow: "0 0 0 1px #888",
                                padding: "10px",
                                marginBottom: "2%",
                                height: "fit-content",
                            }}>
                            <MeetingScheduler
                                key={location}
                                appointments={appointments}
                                weekChange={(e) => {
                                    setCurrentWeek(e);
                                    setStartTime("");
                                    setEndTime("");
                                    setMeetingTitle("");
                                    setDay(0);
                                }}
                                currentWeek={currentWeek}
                            />
                        </div>
                        <TileSelection
                            key={currentWeek}
                            title={
                                <div>
                                    <h1
                                        className="page-divider-header"
                                        style={{ marginLeft: "2.5%" }}>
                                        Select the Day of the Week
                                    </h1>
                                    <h6 style={{ marginTop: "5px" }}>
                                        <i>
                                            Day of week for the currently displayed week above.
                                        </i>
                                    </h6>
                                </div>
                            }
                            options={[
                                { value: "Mon" },
                                { value: "Tue" },
                                { value: "Wed" },
                                { value: "Thu" },
                                { value: "Fri" },
                            ]}
                            size={["80px", "50px"]}
                            onSelect={(e) => {
                                setDay(days.indexOf(e));
                            }}
                        />
                    </div>
                )}
                {/* Input date and time */}
                {day !== 0 && (
                    <TileSelection
                        key={day}
                        title={
                            <div>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}>
                                    Select the Start Time
                                </h1>
                                {/* <h6 style={{ marginTop: "5px" }}>
                                        <i>
                                            Day of week for the currently displayed week above.
                                        </i>
                                    </h6> */}
                            </div>
                        }
                        options={getStartTimes(day, appointments, currentWeek)}
                        size={["90px", "50px"]}
                        onSelect={(e) => {
                            setStartTime(e);
                            setEndTime("");
                        }}
                    />
                )}
                {startT && (
                    <TileSelection
                        key={startT}
                        title={
                            <div>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}>
                                    Select the End Time
                                </h1>
                                {/* <h6 style={{ marginTop: "5px" }}>
                                        <i>
                                            Day of week for the currently displayed week above.
                                        </i>
                                    </h6> */}
                            </div>
                        }
                        options={getEndTimes(day, appointments, currentWeek)}
                        size={["90px", "50px"]}
                        onSelect={setEndTime}
                    />
                )}
                {/* Title of Booking */}
                {startT && endT && day && (
                    <div>
                        <h1
                            className="page-divider-header"
                            style={{ marginLeft: "2.5%", marginBottom: "20px" }}>
                            Complete the Booking
                        </h1>
                        <input
                            className="text-input"
                            style={{ width: "350px" }}
                            placeholder="Meeting Title (Required)"
                            onChange={(e) => setMeetingTitle(e.target.value)}></input>
                        <div className="space" />
                        <h3>
                            {"Meeting at "}
                            <span style={{ color: "red" }}>{location}</span>
                            {" from "}
                            <span style={{ color: "red" }}>{startT}</span>
                            {" to "}
                            <span style={{ color: "red" }}>{endT}</span>
                            {" on "}
                            <span style={{ color: "red" }}>
                                {new Date(
                                    currentWeek.getFullYear(),
                                    currentWeek.getMonth(),
                                    currentWeek.getDate() + day
                                ).toDateString()}
                            </span>
                            {"."}
                        </h3>

                        <div className="space" />

                        <button
                            className="button-style"
                            disabled={meetingTitle.length === 0}
                            onClick={() => console.log("Submit The Meeting!")}>
                            Confirm
                        </button>
                    </div>
                )}
                {location && <div style={{ marginTop: "100px" }}></div>}
                {/* Confirm */}
            </div>
            <div className="flex-container-1" />
        </div>
    );
}

export default MeetingBookings;
