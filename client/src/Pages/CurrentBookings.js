import React from "react";
import GlassCalendar from "../Components/GlassCalendar";
import PillSlider from "../Components/PillSlider";
import "../public/css/main.css";

function CurrentBookings() {
    const [state, setState] = React.useReducer(
        (currentState, update) => {
            return { ...currentState, ...update };
        },
        {
            selectedDate: null,
            view: "off",
            deskBookings: [],
            appointments: [],
        }
    );

    React.useEffect(() => {
        console.log(state);
    }, [state]);

    const disableWeekends = (e) => e.getDay() === 0 || e.getDay() === 6;

    const getBookingsOnDate = (date) => {
        fetch(`/api/allBookings/${date}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed getting bookings");
                else return res.json();
            })
            .then((res) => {
                setState({
                    deskBookings: res.bookings,
                    appointments: res.appointments,
                    selectedDate: date,
                });
            });
    };

    const showBookings = () => {
        if (state.deskBookings.length === 0)
            return <h3>There are no desks booked for this date.</h3>;
        return state.deskBookings.map((booking) => showBookingsWithLocation(booking));
    };

    const showAppointments = () => {
        if (state.appointments.length === 0)
            return <h3>There are no meeting rooms booked for this date.</h3>;

        return state.appointments.map((appointment) =>
            showAppointmentsWithLocation(appointment)
        );
    };

    const showBookingsWithLocation = (booking) => {
        return (
            <div> 
                <h1
                    className="page-divider-header"
                    style={{ marginLeft: "15%", backgroundColor: "#fdaf12", width: "70%" }}>
                    {booking.location}
                </h1>
                <div className="space" />

                <div className="current-booking-wrapper">
                    {booking.bookings.map((booking) => showBooking(booking))}
                </div>
                <div className="space" />
            </div>
        );
    };

    const showBooking = (booking) => {
        let time =
            booking.pm && !booking.am
                ? "13:30 - 17:30"
                : booking.am && !booking.pm
                ? "09:00 - 13:00"
                : "09:00 - 17:30";
        return (
            <div className="current-booking-card">
                <h4>
                    {"Desk: "} {booking.deskId}
                </h4>
                <div className="space" />
                <h4>
                    {"Booked by: "}
                    <span style={{ color: "#008dd3" }}>{booking.userEmail}</span>
                </h4>
                <div className="space" />
                <h4>
                    {"Time: "}
                    <span style={{ color: "red" }}> {time}</span>
                </h4>
            </div>
        );
    };
    const showAppointmentsWithLocation = (appointment) => {
        return (
            <div>
                <h1
                    className="page-divider-header"
                    style={{ marginLeft: "15%", backgroundColor: "#fdaf12", width: "70%" }}>
                    {appointment.location}
                </h1>
                <div className="space" />

                <div className="current-booking-wrapper">
                    {appointment.bookings.map((booking) => showAppointment(booking))}
                </div>
                <div className="space" />
            </div>
        );
    };

    const showAppointment = (appointment) => {
        let time =
            new Date(appointment.start).getHours() +
            ":" +
            String(new Date(appointment.start).getMinutes()).padStart(2, "0") +
            " - " +
            new Date(appointment.end).getHours() +
            ":" +
            String(new Date(appointment.end).getMinutes()).padStart(2, "0");
        return (
            <div className="current-booking-card">
                <h4>
                    {"Meeting: "} {appointment.title.split("|")[0]}
                </h4>
                <div className="space" />
                <h4 style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {"Booked by: "}
                    <span
                        style={{
                            color: "#008dd3",
                        }}>
                        {appointment.bookedBy}
                    </span>
                </h4>
                <div className="space" />
                <h4>
                    {"Time: "}
                    <span style={{ color: "red" }}> {time}</span>
                </h4>
            </div>
        );
    };
    return (
        <div className="wrapper TCD-BG">
            <div className="flex-container-1" />
            <div className="flex-container-5 main-body">
                <div className="space" />
                <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                    Current Bookings
                </h1>
                <div className="space" />

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <PillSlider
                        on="Meeting Rooms"
                        off="Desks"
                        onClick={(e) => {
                            setState({ view: e });
                        }}
                    />
                </div>
                <div className="space" />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <GlassCalendar
                        hideLanguageToggle
                        highlight="none"
                        disableTile={disableWeekends}
                        onDaySelect={(e) => {
                            getBookingsOnDate(e);
                        }}
                    />
                </div>
                <div className="space" />
                {state.selectedDate && (
                    <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                        {`Bookings on ${state.selectedDate.toDateString()}`}
                    </h1>
                )}
                <div className="space" />
                {(state.selectedDate && state.view === "off") && showBookings()}
                {(state.selectedDate && state.view === "on") && showAppointments()}
            </div>
            <div className="flex-container-1" />
        </div>
    );
}

export default CurrentBookings;
