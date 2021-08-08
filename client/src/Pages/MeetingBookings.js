import React from "react";
import MeetingScheduler from "../Components/MeetingScheduler";
import TileSelection from "../Components/TileSelection";
import "../public/css/main.css";
function MeetingBookings() {
    const [currentWeek, setCurrentWeek] = React.useState(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - new Date().getDay() + (new Date().getDay() === 6 ? 7 : 0)
        )
    );
    const days = ["offset_space", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const [location, setLocation] = React.useState(null);
    const [day, setDay] = React.useState(0);
    const checkDayAvailability = (day, bookings, currentDate) => {};
    const appointments = [
        {
            title: "SCSS Team Meeting | Foster Place",
            startDate: new Date(2021, 7, 9, 9, 30),
            endDate: new Date(2021, 7, 9, 11, 30),
            id: "asfas-vasgd-315",
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
                            Current Bookings for Foster Place
                        </h1>
                        <h5 style={{ marginTop: "5px", marginBottom: "2%" }}>
                            Scroll down to place your booking.
                        </h5>
                        <div
                            style={{
                                width: "75%",
                                marginLeft: "12.5%",
                                borderRadius: "20px",
                                boxShadow: "0 0 0 1px #888",
                                padding: "10px",
                                marginBottom: "2%",
                            }}>
                            <MeetingScheduler
                                appointments={appointments}
                                weekChange={(e) => {
                                    console.log(e);
                                }}
                                currentWeek={currentWeek}
                            />
                        </div>
                        <TileSelection
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

                {/* Title of Booking */}
                {/* Confirm */}
                <div style={{ marginTop: "100px" }}></div>
            </div>
            <div className="flex-container-1" />
        </div>
    );
}

export default MeetingBookings;
