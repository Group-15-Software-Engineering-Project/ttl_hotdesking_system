import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { verify } from "../Components/Misc";
import "../public/css/main.css";

export default class AdminOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            key: "default",
        };
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);
        this.getAdminOptions();
    };

    getAdminOptions = () => {
        fetch("/api/adminOptions")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to retrieve options");
                return res.json();
            })
            .then((res) => {
                this.setState({
                    options: res.options,
                });

                for (let opt of res.options) {
                    this.setState({ [opt.key]: "" });
                }
            })
            .catch(console.error);
    };
    submitUpdateOptions = (key) => {
        console.log(key);
        fetch(`/api/adminOptions/${key}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                value: this.state[key],
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to update ${key}`);
                else this.getAdminOptions();
            })
            .catch(alert);
    };

    displayAdminOptions = () => {
        return (
            <div>
                {this.state.options.map((x) => {
                    return (
                        <div className="admin-option-wrapper">
                            <div className="admin-option-text">
                                <span className="admin-option-key">
                                    {x.key.replaceAll("_", " ")}
                                </span>
                                <span className="admin-option-value">
                                    {"Current: " +
                                        x.value +
                                        (x.value === 1 ? " week" : " weeks")}
                                </span>
                            </div>
                            <div className="admin-option-input">
                                <input
                                    type="number"
                                    min="1"
                                    className="text-input"
                                    placeholder="New value (in weeks)"
                                    value={this.state[x.key]}
                                    onChange={(e) => {
                                        this.setState({ [x.key]: parseInt(e.target.value) });
                                    }}
                                    name={x.key}></input>
                                <button
                                    disabled={
                                        !this.state[x.key] ||
                                        this.state[x.key] === 0 ||
                                        this.state[x.key] ===
                                            this.state.options[
                                                this.state.options.findIndex(
                                                    (e) => e.key === x.key
                                                )
                                            ].value
                                    }
                                    className="button-style"
                                    onClick={() => {
                                        this.submitUpdateOptions(x.key);
                                    }}>
                                    Update
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render = () => {
        return verify(true) ? (
            <div className="wrapper TCD-BG" key={this.state.key}>
                <div key={"side_cont_1"} className="flex-container-1" />
                <div key={this.state.options} className="flex-container-5 main-body">
                    <div className="space"></div>
                    <h1
                        className="page-divider-header"
                        style={{ marginLeft: "2.5%", marginBottom: "2%" }}>
                        Admin Options
                    </h1>
                    {this.displayAdminOptions()}
                </div>
                <div key={"side_cont_2"} className="flex-container-1" />
            </div>
        ) : (
            <Redirect to="/home" />
        );
    };
}
