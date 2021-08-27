import React, { createRef } from "react";
import BookingCalendar from "../Components/BookingCalendar";
import TileSelection from "../Components/TileSelection";
import { createUniqueID, months, verify } from "../Components/Misc";
import ConfirmationEmail from "../Components/ConfirmationEmail.js";
import "../public/css/main.css";
import { Redirect } from "react-router";

export default class BookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areaKey: "default",
            chosenArea: "default",
            chosenDesk: "default",
            chosenDate: "default",
            chosenTime: "default",
            locations: [],
            bookableDesks: [],
            selectAM: false,
            selectPM: false,
            responseToPost: "",
            times: [
                { value: "9:00 - 13:00", label: "AM" },
                { value: "13:30 - 17:30", label: "PM" },
                { value: "9:00 - 17:30", label: "AMPM" },
            ],
        };
    }

    convertDate = () => {
        return (
            String(this.state.chosenDate).split(" ")[2] +
            "-" +
            String(months.indexOf(String(this.state.chosenDate).split(" ")[1]) + 1).padStart(
                2,
                "0"
            ) +
            "-" +
            String(this.state.chosenDate).split(" ")[3]
        );
    };

    submitBooking = () => {
        let am;
        let pm;
        switch (this.state.chosenTime) {
            case "9:00 - 13:00":
                am = true;
                pm = false;
                break;
            case "13:30 - 17:30":
                am = false;
                pm = true;
                break;
            default:
                am = true;
                pm = true;
                break;
        }
        console.log(this.state.chosenArea);
        console.log(
            "Chosen Date: ",
            this.state.chosenDate.getFullYear(),
            this.state.chosenDate.getMonth(),
            this.state.chosenDate.getDate()
        );
        fetch("/api/addBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: sessionStorage.email,
                deskId: this.state.chosenDesk.split(" ")[1],
                deskRoom: this.state.chosenArea,
                date: [
                    this.state.chosenDate.getFullYear(),
                    this.state.chosenDate.getMonth(),
                    this.state.chosenDate.getDate(),
                ],
                am: am,
                pm: pm,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                ConfirmationEmail(
                    this.props.email,
                    this.state.chosenDesk.split(" ")[1],
                    this.state.chosenArea,
                    this.convertDate(),
                    am,
                    pm,
                    this.state.chosenTime
                );
                this.setState({
                    chosenArea: "default",
                    chosenDate: "default",
                    chosenDesk: "default",
                    chosenTime: "default",
                    areaKey: createUniqueID(),
                    bookableDesks: [],
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    positionReference = createRef();

    componentDidMount() {
        fetch("/api/getRooms")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                } else {
                    this.setState(
                        {
                            locations: res.rooms,
                        },
                        () => window.scrollTo(0, 0)
                    );
                }
            })
            .catch((err) => {});
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.positionReference.current.scrollIntoView({ behavior: "smooth" });
    };

    transformDeskData = () => {
        let data = [];
        for (let desk in this.state.bookableDesks) {
            let bookers = this.state.bookableDesks[desk].user.split("|");
            let label =
                this.state.bookableDesks[desk].user.length !== 0 ? (
                    <>
                        <span style={{ margin: "0" }}>Booked by:</span>
                        <div style={{ width: "100%", marginBottom: "-5px" }} />
                        <span style={{ margin: "0" }}>{bookers[0]}</span>
                        {bookers.length === 2 ? (
                            <>
                                <div style={{ width: "100%", marginBottom: "-5px" }} />
                                <span style={{ margin: "0" }}>{bookers[1]}</span>
                            </>
                        ) : null}
                    </>
                ) : (
                    ""
                );
            let disabled = label.length !== 0;
            data.push({
                value: this.state.bookableDesks[desk].desk,
                label: label,
                disabled: disabled,
            });
        }
        return data;
    };

    getViewableDate = (date) => {
        let d = String(date).split(" ");
        return parseInt(d[2]) + " " + d[1] + " " + d[3];
    };
    render() {
        return verify(true) || verify(false) ? (
            <div className="wrapper TCD-BG">
                <div className="flex-container-1"></div>
                <div className="flex-container-5 main-body">
                    <div className="space" />
                    <TileSelection
                        elementID="Booking_area_selection"
                        showLabel={true}
                        key={this.state.areaKey}
                        title={
                            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                                Select a Booking Area
                            </h1>
                        }
                        options={this.state.locations}
                        size={["210px", "75px"]}
                        onSelect={(e) => {
                            this.setState({
                                chosenArea: e,
                                bookableDesks: [],
                                chosenTime: "default",
                                chosenDesk: "default",
                            });
                        }}
                    />
                    {this.state.chosenArea !== "default" ? (
                        <TileSelection
                            elementID="Booking_time_selection"
                            showLabel={false}
                            key={this.state.chosenArea}
                            options={this.state.times}
                            size={["175px", "50px"]}
                            onSelect={(e) =>
                                this.setState({
                                    chosenTime: e,
                                    chosenDate: "default",
                                    chosenDesk: "default",
                                    bookableDesks: [],
                                })
                            }
                            title={
                                <h1
                                    className="page-divider-header"
                                    style={{ marginLeft: "2.5%" }}>
                                    Select a Booking Time
                                </h1>
                            }
                        />
                    ) : null}

                    {this.state.chosenTime !== "default" ? (
                        <div>
                            <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                                Select a Booking Date
                            </h1>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    padding: "0",
                                    paddingTop: "20px",
                                    paddingBottom: "20px",
                                }}>
                                <BookingCalendar
                                    key={this.state.chosenTime}
                                    chosenArea={this.state.chosenArea}
                                    bookingTime={(() => {
                                        for (let i in this.state.times) {
                                            if (
                                                this.state.chosenTime ===
                                                this.state.times[i].value
                                            ) {
                                                return this.state.times[i].label;
                                            }
                                        }
                                    })()}
                                    onMonthChange={() => {
                                        this.setState({chosenDate: "default"})
                                    }}
                                    onSelect={(desks, date, m) => {
                                        let newDate;
                                        this.setState({ chosenDesk: "default" });
                                        if (
                                            String(this.state.chosenDate) === "default" &&
                                            String(date).split(" ")[1] !== m
                                        ) {
                                            newDate = "default";
                                        } else if (
                                            String(this.state.chosenDate) === "default"
                                        ) {
                                            newDate = date;
                                        } else if (
                                            String(this.state.chosenDate).split(" ")[1] !==
                                            String(date).split(" ")[1]
                                        ) {
                                            newDate = "default";
                                        } else {
                                            newDate = date;
                                        }
                                        this.setState({
                                            bookableDesks: desks,
                                            chosenDate: newDate,
                                            chosenDesk: "default",
                                        });
                                    }}></BookingCalendar>
                            </div>
                            {/* <br />
                            {this.state.bookableDesks.length === 0 ? (
                                <div className="space" style={{ marginBottom: "20%" }} />
                            ) : null} */}
                        </div>
                    ) : null}

                    {this.state.bookableDesks.length !== 0 && this.state.chosenDate !== "default" ? (
                        <div>
                            <TileSelection
                                key={this.state.chosenDate}
                                elementID="Booking_desk_selection"
                                showLabel={true}
                                title={
                                    <div>
                                        <h1
                                            className="page-divider-header"
                                            style={{ marginLeft: "2.5%" }}>
                                            Select a Desk
                                        </h1>
                                        <div
                                            style={{
                                                textAlign: "center",
                                                alignItems: "center",
                                                marginTop: "15px",
                                            }}>
                                            <span
                                                style={{
                                                    color: "black",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                }}>{`Desks for ${
                                                this.state.chosenArea
                                            } on ${this.getViewableDate(
                                                this.state.chosenDate
                                            )}.`}</span>
                                        </div>
                                    </div>
                                }
                                options={this.transformDeskData()}
                                size={["180px", "90px"]}
                                onSelect={(e) => {
                                    this.setState({
                                        chosenDesk: e,
                                    });
                                }}
                            />
                        </div>
                    ) : null}
                    {this.state.chosenDesk !== "default" ? (
                        <div style={{ alignItems: "center", textAlign: "center" }}>
                            <button
                                className="button-style no-outline"
                                onClick={this.submitBooking}>
                                Confirm Booking
                            </button>
                            <div style={{ marginBottom: "30px" }} />
                            <p>{this.state.responseToPost}</p>
                        </div>
                    ) : null}
                    <div ref={this.positionReference} style={{ marginBottom: "150px" }} />
                </div>
                <div className="flex-container-1"></div>
            </div>
        ) : (
            <Redirect to="/login" />
        );
    }
}
