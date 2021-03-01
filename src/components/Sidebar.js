import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../Sidebar.css";
import { IconContext } from "react-icons";
import StickyHeader from "react-sticky-header";

function Sidebar(props) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => {
    setSidebar(!sidebar);
  };
  return (
    <>
      <IconContext.Provider value={{ color: "#00AAFF" }}>
        <StickyHeader
          header={
            <div className="sidebar">
              <Link to="#" className="menu-bars">
                {sidebar ? (
                  <AiIcons.AiFillCloseCircle onClick={showSidebar} />
                ) : (
                  <FaIcons.FaBars onClick={showSidebar} />
                )}
              </Link>
              <span
                style={{
                  color: "white",
                  textDecoration: "none",
                  textAlign: "center",
                  width: "90%",
                }}
              >
                {props.currentPageTitle.length > 0
                  ? props.currentPageTitle
                  : "TT & L Desk Booking"}
              </span>
            </div>
          }
        >
          <div className="sidebar">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
        </StickyHeader>

        <nav className={sidebar ? "sidebar-menu active" : "sidebar-menu"}>
          <ul className="sidebar-menu-items">
            <li className="sidebar-toggle">
              <Link to="#" className="menu-bars"></Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.className}>
                  <Link to={item.path} onClick={showSidebar}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
