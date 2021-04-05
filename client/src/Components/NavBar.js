import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../public/css/Navbar.css";
import { IconContext } from "react-icons";
import TCDLogo from "../public/media/TCD-logo-home-transparent.png";

function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const location = useLocation();
  return location.pathname === "/login" ? (
    <></>
  ) : (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="/login">
            <button
              className="nav-button"
              onClick={() => {
                sessionStorage.clear();
              }}
            >
              {"Log Out"}
            </button>
          </Link>

          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <Link to="/home">
            <img src={TCDLogo} className="nav-logo"></img>
          </Link>
        </div>
        <nav
          className={sidebar ? "nav-menu active" : "nav-menu"}
          style={{ boxShadow: "0 0 8px #333" }}
        >
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineCloseCircle />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              if (
                !item.adminRequired ||
                (sessionStorage.__user_is_admin__ && item.adminRequired)
              ) {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </IconContext.Provider>
      <div style={{ marginTop: "80px" }} />
    </>
  );
}

export default Navbar;
