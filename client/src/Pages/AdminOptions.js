import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
import "../public/css/main.css";

class AdminOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addAdminOptionKey: "",
            addAdminOptionValue: "",
            key: "default",
        };
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);
    };

    submitUpdateAdminOption = (key, value) => {
        fetch("/api/updateAdminOptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("a0.jwt.at")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key: key,
                value: value,
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
                    this.setState({ addAdminOptionKey: "", addAdminOptionValue: "" });
                }
            })
            .catch((err) => {
                alert(err);
            });
    };

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
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
                                    style={{ marginLeft: "2.5%" }}>
                                    Update Admin Options
                                </h1>
                                <div
                                    key={"quad_2_space_2"}
                                    style={{
                                        width: "100%",
                                        marginTop: "2%",
                                        marginBottom: "2%",
                                    }}
                                />
                                <div
                                    style={{
                                        width: "100%",
                                        marginTop: "2%",
                                    }}
                                />
                                <input
                                    className="text-input"
                                    type="text"
                                    name="addAdminOptionKey"
                                    placeholder="AdminOption Key"
                                    onChange={this.handleEvent}
                                    value={this.state.addAdminOptionKey}
                                />

                                <div
                                    key={"quad_2_space_1"}
                                    style={{
                                        width: "100%",
                                        marginTop: "1%",
                                    }}
                                />

                                <input
                                    className="text-input"
                                    type="text"
                                    name="addAdminOptionValue"
                                    placeholder="AdminOption Value"
                                    onChange={this.handleEvent}
                                    value={this.state.addAdminOptionValue}
                                />
                                <div
                                    className="space"
                                    style={{ margin: 0, marginTop: "10px" }}
                                />

                                <div className="space" style={{ margin: 0 }} />

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
                                        this.submitUpdateAdminOption(
                                            this.state.addAdminOptionKey,
                                            this.state.addAdminOptionValue
                                        )
                                    }
                                    disabled={
                                        this.state.addAdminOptionKey.length === 0 ||
                                        this.state.addAdminOptionValue.length === 0
                                    }>
                                    Update AdminOption
                                </button>
                            </div>
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

export default AdminOptions;
