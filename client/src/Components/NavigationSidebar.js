import React from "react";
import "../public/css/NavigationSidebar.css";
import { SidebarData } from "./SidebarData";
import { Link, useHistory } from "react-router-dom";
import { BiGlobe } from "react-icons/bi";
import { AiFillPushpin } from "react-icons/ai";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";
import { verify } from "./Misc";

function NavigationSidebar() {
    const history = useHistory();
    const [thisNav, setThisNav] = React.useState(null);

    const addTabIndices = () => {
        let navbarItems = document.querySelectorAll(".nav-content-item");
        for (let item of navbarItems) {
            item.setAttribute("tabIndex", "0");
        }
        let buttons = document.querySelectorAll(".navigation-sidebar-button");
        for (let item of buttons) {
            item.setAttribute("tabIndex", "0");
        }
        let pin = document.querySelector(".navigation-pin");
        if (pin) {
            pin.setAttribute("tabIndex", "0");
        }
    };
    const removeTabIndices = () => {
        let navbarItems = document.querySelectorAll(".nav-content-item");
        for (let item of navbarItems) {
            item.removeAttribute("tabIndex");
        }
        let buttons = document.querySelectorAll(".navigation-sidebar-button");
        for (let item of buttons) {
            item.removeAttribute("tabIndex");
        }
        let pin = document.querySelector(".navigation-pin");
        if (pin) pin.removeAttribute("tabIndex");
    };
    React.useEffect(() => {
        let nav = document.getElementById("navigation-sidebar");
        setThisNav(nav);
        if (sessionStorage.pinnedNavbar === "pinned") {
            nav.classList.add("pinned");
            nav.classList.add("open");
            addTabIndices();
        }
    }, []);

    const ToggleSidebar = (e) => {
        if (!thisNav.classList.contains("pinned")) {
            thisNav.classList.toggle("open");
            if (thisNav.classList.contains("open")) {
                addTabIndices();
            } else {
                removeTabIndices();
            }
        }
        if (e.target.getAttribute("path")) history.push(String(e.target.getAttribute("path")));
    };
    return (
        <div>
            <div id="navigation-sidebar">
                <div
                    tabIndex="0"
                    className="navigation-sidebar-toggle"
                    onKeyPress={ToggleSidebar}
                    onClick={ToggleSidebar}>
                    <div id="navigation-sidebar-menu-button" />
                </div>
                <div className="navigation-sidebar-header">
                    <img src={TCDLogo} alt="TCD logo"></img>
                </div>
                <div className="navigation-sidebar-content">
                    <ul>
                        {SidebarData.map((data) => {
                            if (data.adminRequired && verify(true)) {
                                return (
                                    <li
                                        className="nav-content-item"
                                        onClick={ToggleSidebar}
                                        onKeyPress={ToggleSidebar}
                                        path={data.path}>
                                        <Link
                                            tabIndex="-1"
                                            to={data.path}
                                            style={{ color: "#fdaf12", fontWeight: "bold" }}>
                                            {data.icon}
                                            {"  " + data.title}
                                        </Link>
                                    </li>
                                );
                            } else if (!data.adminRequired)
                                return (
                                    <li
                                        className="nav-content-item"
                                        onClick={ToggleSidebar}
                                        onKeyPress={ToggleSidebar}
                                        path={data.path}>
                                        <Link tabIndex="-1" to={data.path}>
                                            {data.icon}
                                            {data.title}
                                        </Link>
                                    </li>
                                );
                            else return null;
                        })}

                        <li
                            className="nav-content-item"
                            onClick={ToggleSidebar}
                            onKeyPress={(e) => {
                                ToggleSidebar(e);
                                window.open(
                                    "https://www.tcd.ie/teaching-learning/hotdesk/info.php",
                                    "_blank"
                                );
                            }}>
                            <a
                                target="_blank"
                                tabIndex="-1"
                                href="https://www.tcd.ie/teaching-learning/hotdesk/info.php"
                                rel="noreferrer">
                                <BiGlobe />
                                TT & L Website
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="navigation-sidebar-buttons">
                    <div
                        className="navigation-sidebar-button"
                        onClick={() => {
                            sessionStorage.clear();
                            window.location = "/login";
                        }}
                        onKeyPress={() => {
                            sessionStorage.clear();
                            window.location = "/login";
                        }}>
                        Log Out
                    </div>
                </div>
                {window.innerWidth < 768 ? null : (
                    <div
                        className="navigation-pin"
                        onKeyPress={(e) => e.target.click()}
                        onClick={() => {
                            document
                                .getElementById("navigation-sidebar")
                                .classList.toggle("pinned");

                            if (sessionStorage.pinnedNavbar) {
                                sessionStorage.removeItem("pinnedNavbar");
                            } else {
                                sessionStorage.setItem("pinnedNavbar", "pinned");
                            }
                        }}>
                        <AiFillPushpin />
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavigationSidebar;
