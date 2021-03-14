import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
  {
    title: "Book",
    path: "/booking-page",
    icon: <AiIcons.AiOutlineDesktop />,
    cName: "nav-text",
  },
  {
    title: "Account",
    path: "/",
    icon: <AiIcons.AiOutlineHistory />,
    cName: "nav-text",
  },
  {
    title: "Past Bookings",
    path: "/products",
    icon: <AiIcons.AiOutlineHistory />,
    cName: "nav-text",
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Desks",
    path: "/desks",
    icon: <GiIcons.GiDesk />,
    cName: "nav-text",
  },
  {
    title: "Users",
    path: "/users",
    icon: <AiIcons.AiOutlineUser />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/Support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];
