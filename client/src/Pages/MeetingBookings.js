import React from "react";
import MeetingScheduler from "../Components/MeetingScheduler";
import TileSelection from "../Components/TileSelection";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
import "../public/css/main.css";

function MeetingBookings() {
    const [currentSelectedWeek, setCurrentWeek] = React.useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - new Date().getDay() + (new Date().getDay() === 6 ? 7 : 0)
        )
    );
    const [currentWeek] = React.useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - new Date().getDay() + (new Date().getDay() === 6 ? 7 : 0)
        )
    );
    const [state, setState] = React.useState(0);

    React.useEffect(() => {
        getMeetingRooms();
        window.scrollTo(0, 0);
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        };
    }, []);
    const times = [
        "9:00",
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
    const [bookings, setBookings] = React.useState(null);
    const [meetingRooms, setMeetingRooms] = React.useState([]);
    const [show, toggleShow] = React.useState(false);
    const today = new Date().setHours(0, 0, 0, 0);

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
        for (let t of times.slice(0, times.length - 1)) {
            let excluded = toExclude.indexOf(t) !== -1;
            if (!excluded) {
                res.push({ value: t, disabled: false });
            } else {
                res.push({ value: t, disabled: true });
            }
        }
        return res;
    };

    const getMeetingRooms = () => {
        fetch("/api/meetingRooms")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch Meeting Rooms`);
                }
                return res.json();
            })
            .then((rooms) => {
                setMeetingRooms(rooms.data);
            });
    };

    const submitAppointmentBooking = () => {
        let startTime = new Date(
            currentSelectedWeek.getFullYear(),
            currentSelectedWeek.getMonth(),
            currentSelectedWeek.getDate() + day,
            startT.split(":")[0],
            startT.split(":")[1]
        );
        let endTime = new Date(
            currentSelectedWeek.getFullYear(),
            currentSelectedWeek.getMonth(),
            currentSelectedWeek.getDate() + day,
            endT.split(":")[0],
            endT.split(":")[1]
        );
        fetch(`/api/appointments/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: meetingTitle + " | " + location,
                start: startTime,
                end: endTime,
                room: location,
                email: sessionStorage.email,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to create appointment ${meetingTitle}`);
                } else {
                    getCurrentBookings(location);
                    setStartTime("");
                    setEndTime("");
                    setDay(0);
                    setLocation("");
                    setState(state + 1);
                    toggleShow(false);
                    setCurrentWeek(currentWeek);
                }
            })
            .catch(console.error);
    };

    const getCurrentBookings = (location) => {
        fetch(`/api/getAppointments/${location}/${currentSelectedWeek.toISOString()}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch appointments for ${location}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);

                let appointments = [];
                for (let app of data.appointments) {
                    appointments.push({
                        id: app.id,
                        startDate: new Date(app.start),
                        endDate: new Date(app.end),
                        location: app.roomName,
                        title: app.title,
                        email: app.bookedBy,
                    });
                }
                setBookings(appointments);
                toggleShow(true);
            });
    };

    const disableDay = (day) => {
        let date = new Date(
            currentSelectedWeek.getFullYear(),
            currentSelectedWeek.getMonth(),
            currentSelectedWeek.getDate() + day
        ).setHours(0, 0, 0, 0);
        if (date.valueOf() < today.valueOf()) {
            return true;
        } else return false;
    };
    return verify(true) || verify(false) ? (
        <div className="wrapper TCD-BG">
            <div className="flex-container-1" />
            <div className="flex-container-5 main-body">
                <div className="space" />

                <TileSelection
                    key={state + "meeting_room_key"}
                    elementID="Meeting_room_selection"
                    title={
                        <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                            Select a Meeting Room
                        </h1>
                    }
                    options={meetingRooms}
                    size={["300px", "75px"]}
                    showLabel={true}
                    onSelect={(e) => {
                        setCurrentWeek(currentWeek);
                        toggleShow(false);
                        setLocation(e);
                        getCurrentBookings(e);
                    }}
                />
                {show && location && (
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
                                key={bookings}
                                appointments={bookings}
                                deleteAppointment={bookings}
                                weekChange={(e) => {
                                    setCurrentWeek(e);
                                    setStartTime("");
                                    setEndTime("");
                                    setMeetingTitle("");
                                    setDay(0);
                                }}
                                currentWeek={currentSelectedWeek}
                            />
                        </div>
                        <TileSelection
                            elementID="Day_of_week_selection"
                            key={currentSelectedWeek}
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
                                { value: "Mon", disabled: disableDay(1) },
                                { value: "Tue", disabled: disableDay(2) },
                                { value: "Wed", disabled: disableDay(3) },
                                { value: "Thu", disabled: disableDay(4) },
                                { value: "Fri", disabled: disableDay(5) },
                            ]}
                            size={["80px", "50px"]}
                            onSelect={(e) => {
                                setDay(days.indexOf(e));
                                setStartTime("");
                                setEndTime("");
                            }}
                        />
                    </div>
                )}
                {day !== 0 && (
                    <TileSelection
                        elementID="Start_time_selection"
                        key={day}
                        title={
                            <div>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}>
                                    Select the Meeting Start Time
                                </h1>
                            </div>
                        }
                        options={getStartTimes(day, bookings, currentSelectedWeek)}
                        size={["90px", "50px"]}
                        onSelect={(e) => {
                            setStartTime(e);
                            setEndTime("");
                        }}
                    />
                )}
                {startT && (
                    <TileSelection
                        elementID="End_time_selection"
                        key={startT}
                        title={
                            <div>
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}>
                                    Select the Meeting End Time
                                </h1>
                            </div>
                        }
                        options={getEndTimes(day, bookings, currentSelectedWeek)}
                        size={["90px", "50px"]}
                        onSelect={setEndTime}
                    />
                )}
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
                        <h4>
                            {"Meeting at "}
                            <span style={{ color: "red" }}>{location}</span>
                            {" from "}
                            <span style={{ color: "red" }}>{startT}</span>
                            {" to "}
                            <span style={{ color: "red" }}>{endT}</span>
                            {" on "}
                            <span style={{ color: "red" }}>
                                {new Date(
                                    currentSelectedWeek.getFullYear(),
                                    currentSelectedWeek.getMonth(),
                                    currentSelectedWeek.getDate() + day
                                ).toDateString()}
                            </span>
                            {"."}
                        </h4>

                        <div className="space" />

                        <button
                            className="button-style"
                            disabled={meetingTitle.length === 0}
                            onClick={() => submitAppointmentBooking()}>
                            Confirm
                        </button>
                    </div>
                )}
                {location && <div style={{ marginTop: "100px" }}></div>}
                {/* Confirm */}
            </div>
            <div className="flex-container-1" />
        </div>
    ) : (
        <Redirect to="/login" />
    );
}

export default MeetingBookings;
