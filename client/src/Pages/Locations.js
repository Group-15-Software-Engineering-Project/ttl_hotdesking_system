import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { createUniqueID, verify, parseNumberList } from "../Components/Misc";
import "../public/css/main.css";

class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addRoom: "",
            deleteRoom: "",
            addDeskNum: "",
            addDeskRoom: "",
            deleteDeskNum: "",
            deleteDeskRoom: "",
            deleteDeskList: [],
            desks: [],
            roomDeskList: [],
            key: "default",
            customInput: false,
            showTooltip: false,
            addMeetingRoom: "",
            removeMeetingRoom: "",
            meetingRoomList: [],
        };
    }

    verifyInput = (input) => {
        return (input.match(/[^\s0-9,-]/giu) || []).length === 0;
    };

    submitMeetingRoom = () => {
        fetch(`/api/meetingRooms/${this.state.addMeetingRoom}`, {
            method: "PUT",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed adding ${this.state.addMeetingRoom}`);
                } else {
                    alert("Success");
                    this.setState({ addMeetingRoom: "" });
                    this.getMeetingRooms();
                }
            })
            .catch(console.error);
    };

    getMeetingRooms = () => {
        fetch("/api/meetingRooms")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch Meeting Rooms`);
                }
                return res.json();
            })
            .then((rooms) => {
                let data = [];
                for (let room of rooms.data) {
                    data.push(room.value);
                }
                this.setState({ meetingRoomList: data });
            });
    };

    submitRemoveMeetingRoom = () => {
        fetch(`/api/meetingRooms/${this.state.removeMeetingRoom}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed deleting ${this.state.removeMeetingRoom}`);
                } else {
                    alert("Success");
                    this.setState({ removeMeetingRoom: "" });
                    this.getMeetingRooms();
                }
            })
            .catch(console.error);
    };

    getLocationData = () => {
        fetch("/api/getLocationData")
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                } else {
                    this.setState({ roomDeskList: res.data });
                }
            })
            .catch((err) => {});
    };

    componentDidMount = () => {
        window.scrollTo(0, 0);
        this.getLocationData();
        this.getMeetingRooms();
    };

    submitAddRoom = (room) => {
        if (room.length < 1) return;
        this.setState({ key: createUniqueID() });
        fetch("/api/addRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room: room,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                } else {
                    alert("Success");
                    this.getLocationData();
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    submitAddDesk = (desk, room) => {
        if (desk.length < 1 || room.length < 1) return;
        this.setState({ key: createUniqueID() });
        fetch("/api/addDesk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: parseNumberList(desk),
                room: room,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert(res.message);
                } else {
                    alert("Success");
                    this.getLocationData();
                    this.setState({ customInput: false, addDeskNum: "", addDeskRoom: "" });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    submitRemoveDesk = (desk, room) => {
        this.setState({ key: createUniqueID() });
        fetch("/api/removeDesk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: desk,
                room: room,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert(res.message);
                } else {
                    alert("Success");
                    this.getLocationData();
                    this.setState({ deleteDeskRoom: "", deleteDeskNum: "" });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    submitRemoveRoom = (room) => {
        if (room.length < 1) return;
        this.setState({ key: createUniqueID() });
        fetch("/api/removeRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room: room,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    alert(res.message);
                } else {
                    alert("Success");
                    this.getLocationData();
                    this.setState({ deleteRoom: "" });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    addRoomF = (event) => {
        this.setState({ addRoom: event.target.value });
    };

    deleteRoomF = (event) => {
        this.setState({ deleteRoom: event.target.value });
    };

    addDeskNumF = (event) => {
        this.setState({ addDeskNum: event.target.value });
    };

    addDeskRoomF = (event) => {
        this.setState({ addDeskRoom: event.target.value });
    };

    deleteDeskNumF = (event) => {
        this.setState({ deleteDeskNum: event.target.value });
    };

    deleteDeskRoomF = (event) => {
        this.setState({ deleteDeskRoom: event.target.value });
    };

    listDesks = (room) => {
        return (
            <div
                key={room.name}
                style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    justifyContent: "center",
                    marginTop: "20px",
                    width: "100%",
                }}>
                <span
                    key={`title_${room.name}`}
                    className="page-divider-header"
                    style={{ margin: "0px" }}>
                    {"Desks in " + room.name}
                </span>
                <div key={`space_div`} style={{ width: "100%", margin: "10px" }} />
                {room.desks.length === 0 ? (
                    <span
                        key={"no_desks_key"}
                        style={{
                            fontWeight: "bold",
                            width: "16%",
                            marginBottom: "10px",
                        }}>
                        No desks listed
                    </span>
                ) : (
                    room.desks.map((x) => {
                        return (
                            <>
                                <span
                                    key={`_desk_${x}`}
                                    style={{
                                        fontWeight: "bold",
                                        width: "fit-content",
                                        marginLeft: "10px",
                                        marginRight: " 10px",
                                        marginBottom: "10px",
                                        borderRadius: "20px",
                                        backgroundColor: "#ddd",
                                        padding: "10px",
                                        paddingLeft: "15px",
                                        paddingRight: "15px",
                                    }}>
                                    {"Desk " + x}
                                </span>
                            </>
                        );
                    })
                )}
            </div>
        );
    };

    render() {
        return verify(true) ? (
            <div>
                <div className="wrapper TCD-BG" key={this.state.key}>
                    <div key={"side_cont_1"} className="flex-container-1" />
                    <div key={"main_cont_5"} className="flex-container-5 main-body">
                        <div key={"quad_cont_1"} className="quadrant-container">
                            <div key={"quad_2"} className="double-quadrant">
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#4dc300", marginLeft: "2.5%" }}>
                                    Add Desks
                                </h1>
                                <div
                                    key={"quad_2_space_2"}
                                    style={{
                                        width: "100%",
                                        marginTop: "2%",
                                        marginBottom: "2%",
                                    }}
                                />
                                <label htmlFor="checkbox_custominput">
                                    <input
                                        style={{ margin: "5px" }}
                                        name="checkbox_custominput"
                                        type="checkbox"
                                        onChange={() =>
                                            this.setState({
                                                customInput: !this.state.customInput,
                                                addDeskRoom: "",
                                            })
                                        }
                                    />
                                    Use new location
                                </label>
                                <div
                                    style={{
                                        width: "100%",
                                        marginTop: "2%",
                                    }}
                                />
                                {this.state.customInput ? (
                                    <input
                                        className="text-input"
                                        type="text"
                                        name="addDeskRoom"
                                        placeholder="New Location"
                                        onChange={this.handleEvent}
                                        value={this.state.addDeskRoom}
                                    />
                                ) : (
                                    <select
                                        className="text-input"
                                        style={{ padding: "0" }}
                                        name="addDeskRoom"
                                        onChange={this.handleEvent}
                                        value={this.state.addDeskRoom}>
                                        <option key={"_empty_loc"} value="">
                                            Select location
                                        </option>
                                        {this.state.roomDeskList
                                            ? this.state.roomDeskList.map((x) => {
                                                  return (
                                                      <option key={x.name} value={x.name}>
                                                          {x.name}
                                                      </option>
                                                  );
                                              })
                                            : null}
                                    </select>
                                )}

                                <div
                                    key={"quad_2_space_1"}
                                    style={{
                                        width: "100%",
                                        marginTop: "1%",
                                    }}
                                />

                                <input
                                    className="text-input"
                                    style={{
                                        backgroundColor: `${
                                            this.verifyInput(this.state.addDeskNum)
                                                ? ""
                                                : "#ff6666"
                                        }`,
                                    }}
                                    placeholder="Desk Number"
                                    type="text"
                                    name="addDeskNum"
                                    value={this.state.addDeskNum}
                                    onChange={this.handleEvent}
                                    onMouseEnter={() => this.setState({ showTooltip: true })}
                                    onMouseLeave={() =>
                                        this.setState({ showTooltip: false })
                                    }></input>
                                <div
                                    className="space"
                                    style={{ margin: 0, marginTop: "10px" }}
                                />

                                <div className="space" style={{ margin: 0 }} />

                                {this.state.showTooltip ? (
                                    <span
                                        className="tooltip"
                                        style={{
                                            position: "absolute",
                                            zIndex: "2",
                                            borderRadius: "10px",
                                            backgroundColor: "#BBBBBBd7",
                                            color: "black",
                                            border: "1px solid #555",
                                            padding: "10px",
                                            width: "25%",
                                            wordWrap: "wrap",
                                            whiteSpace: "pre-wrap",
                                            marginRight: "20px",
                                        }}>
                                        You may list desk numbers individually and add them one
                                        by one, separated by commas (eg. 1,2,5,7), or by a
                                        range (eg. 1-5). The methods can be combined, ie. you
                                        may type 1,2,5-7,9.
                                    </span>
                                ) : null}

                                <div
                                    key={"quad_2_space_0"}
                                    style={{
                                        width: "100%",
                                        marginTop: "1%",
                                    }}
                                />
                                <button
                                    className="button-style no-outline"
                                    onClick={() =>
                                        this.submitAddDesk(
                                            this.state.addDeskNum,
                                            this.state.addDeskRoom
                                        )
                                    }
                                    disabled={
                                        !this.verifyInput(this.state.addDeskNum) ||
                                        this.state.addDeskNum.length === 0 ||
                                        this.state.addDeskRoom.length === 0
                                    }>
                                    Add Desk
                                </button>
                            </div>
                            <div key={"quad_3"} className="quadrant">
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#F32000", marginLeft: "2.5%" }}>
                                    Remove Locations
                                </h1>
                                <div
                                    key={"quad_3_space_1"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "10%",
                                    }}
                                />
                                <select
                                    className="text-input"
                                    name="deleteRoom"
                                    style={{ padding: "0" }}
                                    onChange={this.handleEvent}>
                                    <option key={"_empty_loc0"} value="">
                                        Select location
                                    </option>
                                    {this.state.roomDeskList
                                        ? this.state.roomDeskList.map((x) => {
                                              return (
                                                  <option key={x.name} value={x.name}>
                                                      {x.name}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                                <div
                                    key={"quad_3_space_0"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "5%",
                                    }}
                                />
                                <button
                                    className="button-style no-outline"
                                    disabled={this.state.deleteRoom.length === 0}
                                    onClick={(e) =>
                                        this.submitRemoveRoom(this.state.deleteRoom)
                                    }>
                                    Remove Desk Locations
                                </button>
                            </div>
                            <div key={"quad_4"} className="quadrant">
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#F32000", marginLeft: "2.5%" }}>
                                    Remove Desks
                                </h1>
                                <div
                                    key={"quad_4_space_2"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "10%",
                                    }}
                                />
                                <select
                                    className="text-input"
                                    style={{ padding: "0" }}
                                    onChange={(e) =>
                                        this.setState(
                                            { deleteDeskRoom: e.target.value },
                                            () => {
                                                for (let key in this.state.roomDeskList) {
                                                    if (
                                                        this.state.roomDeskList[key].name ===
                                                        this.state.deleteDeskRoom
                                                    ) {
                                                        this.setState({
                                                            deleteDeskList:
                                                                this.state.roomDeskList[key]
                                                                    .desks,
                                                        });
                                                        break;
                                                    }
                                                }
                                            }
                                        )
                                    }>
                                    <option key={"_empty_loc1"} value="">
                                        Select location
                                    </option>
                                    {this.state.roomDeskList
                                        ? this.state.roomDeskList.map((x) => {
                                              return (
                                                  <option key={x.name} value={x.name}>
                                                      {x.name}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                                <div
                                    key={"quad_4_space_1"}
                                    style={{
                                        width: "100%",
                                        marginTop: "1%",
                                    }}
                                />
                                <select
                                    className="text-input"
                                    name="deleteDeskRoom"
                                    style={{ padding: "0" }}
                                    onChange={this.deleteDeskNumF}>
                                    <option key={"_empty_desk"} value="">
                                        Select desk
                                    </option>
                                    {this.state.deleteDeskList
                                        ? this.state.deleteDeskList.map((x) => {
                                              return (
                                                  <option key={`_desk_${x}`} value={x}>
                                                      {"Desk " + x}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                                <div
                                    key={"quad_4_space_0"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "5%",
                                    }}
                                />
                                <button
                                    className="button-style no-outline"
                                    disabled={
                                        this.state.deleteDeskRoom.length === 0 ||
                                        String(this.state.deleteDeskNum).length === 0
                                    }
                                    onClick={(e) =>
                                        this.submitRemoveDesk(
                                            this.state.deleteDeskNum,
                                            this.state.deleteDeskRoom
                                        )
                                    }>
                                    Remove Desk
                                </button>
                            </div>
                            <div className="quadrant">
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#4dc300", marginLeft: "2.5%" }}>
                                    Add Meeting Rooms
                                </h1>
                                <div
                                    key={"quad_4_space_2"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "10%",
                                    }}
                                />

                                <input
                                    className="text-input"
                                    placeholder="Meeting Room Name"
                                    type="text"
                                    name="addMeetingRoom"
                                    onChange={this.handleEvent}
                                    value={this.state.addMeetingRoom}></input>
                                <div
                                    key={"quad_4_space_0"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "5%",
                                    }}
                                />
                                <button
                                    className="button-style no-outline"
                                    disabled={this.state.addMeetingRoom.length === 0}
                                    onClick={this.submitMeetingRoom}>
                                    Add Meeting Room
                                </button>
                            </div>

                            <div className="quadrant">
                                <h1
                                    className="page-divider-header"
                                    style={{ backgroundColor: "#F32000", marginLeft: "2.5%" }}>
                                    Remove Meeting Rooms
                                </h1>
                                <div
                                    key={"quad_4_space_2"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "10%",
                                    }}
                                />

                                <select
                                    className="text-input"
                                    name="removeMeetingRoom"
                                    style={{ padding: "0" }}
                                    onChange={this.handleEvent}>
                                    <option key={"_empty_room"} value="">
                                        Select meeting room
                                    </option>
                                    {this.state.meetingRoomList
                                        ? this.state.meetingRoomList.map((x) => {
                                              return (
                                                  <option key={`_room_${x}`} value={x}>
                                                      {x}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                                <div
                                    key={"quad_4_space_0"}
                                    style={{
                                        width: "100%",
                                        marginTop: "5%",
                                        marginBottom: "5%",
                                    }}
                                />
                                <button
                                    className="button-style no-outline"
                                    disabled={this.state.removeMeetingRoom.length === 0}
                                    onClick={this.submitRemoveMeetingRoom}>
                                    Remove Meeting Room
                                </button>
                            </div>
                        </div>
                        <h1
                            className="page-divider-header"
                            style={{ backgroundColor: "#fd9f12", marginLeft: "2.5%" }}>
                            Meeting Rooms
                        </h1>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                width: "100%",
                                flexWrap: "wrap",
                            }}
                            key={"_meeting_room_list_"}>
                            {this.state.meetingRoomList.map((x) => {
                                return (
                                    <div
                                        key={`_meeting_room_${x}`}
                                        id={`_meeting_room_listing_${x}`}
                                        style={{
                                            fontWeight: "bold",
                                            backgroundColor: "#ddd",
                                            borderRadius: "20px",
                                            padding: "10px",
                                            marginTop: "15px",
                                            marginLeft: "15px",
                                            marginRight: "15px",
                                            flexBasis: "30%",
                                            maxWidth: "30%",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            minWidth: "fit-content",
                                        }}>
                                        {x}
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexFlow: "column wrap",
                                width: "100%",
                            }}
                            key={"_desk_list__"}>
                            {this.state.roomDeskList ? (
                                <div key={"_list__"}>
                                    {this.state.roomDeskList.map((x) => {
                                        return this.listDesks(x);
                                    })}
                                </div>
                            ) : null}
                        </div>
                        <div
                            key={"_space_key_div"}
                            style={{ width: "100%", marginBottom: "20px" }}
                        />
                    </div>
                    <div key={"side_cont_2"} className="flex-container-1" />
                </div>
            </div>
        ) : (
            <Redirect to="/home" />
        );
    }
}

export default Locations;
