import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../public/css/Navbar.css";
import { IconContext } from "react-icons";
import * as BiIcons from "react-icons/bi";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";
import { verify } from "./Misc";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const location = useLocation();
    const verified = verify(true);
    return location.pathname === "/login" ? (
        <></>
    ) : (
        <>
            <IconContext.Provider value={{ color: "white" }}>
                <div className="navbar">
                    <Link to="/login">
                        <button
                            className="nav-button no-outline"
                            onClick={() => {
                                sessionStorage.clear();
                            }}>
                            {"Log Out"}
                        </button>
                    </Link>

                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                    <Link to="/home">
                        <img src={TCDLogo} alt="TCD logo" className="nav-logo"></img>
                    </Link>
                </div>
                <nav
                    className={sidebar ? "nav-menu active" : "nav-menu"}
                    style={{ boxShadow: "0 0 8px #333" }}>
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <AiIcons.AiOutlineCloseCircle />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            if (!item.adminRequired || (verified && item.adminRequired)) {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span className="nav-menu-items">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            } else {
                                return null;
                            }
                        })}
                        <li className="nav-text">
                            <a
                                target="_blank"
                                href="https://www.tcd.ie/teaching-learning/hotdesk/info.php"
                                rel="noreferrer">
                                <BiIcons.BiGlobe />
                                <span className="nav-menu-items">TT&L Website</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </IconContext.Provider>
            <div style={{ marginTop: "80px" }} />
        </>
    );
}

export default Navbar;
