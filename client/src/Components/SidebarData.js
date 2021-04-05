import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";
import * as CgIcons from "react-icons/cg";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "Book a Desk",
    path: "/booking-page",
    icon: <BiIcons.BiBookAdd />,
    cName: "nav-text",
    adminRequired: false,
  },
  {
    title: "My Bookings",
    path: "/past-bookings",
    icon: <AiIcons.AiOutlineHistory />,
    cName: "nav-text",
    adminRequired: false,
  },
  {
    title: "Account",
    path: "/account",
    icon: <CgIcons.CgProfile />,
    cName: "nav-text",
    adminRequired: false,
  },
  // {
  //   title: "Messages",
  //   path: "/messages",
  //   icon: <FaIcons.FaEnvelopeOpenText />,
  //   cName: "nav-text",
  // },
  {
    title: "Reports",
    path: "/reports",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
    adminRequired: true,
  },
  {
    title: "Locations",
    path: "/locations",
    icon: <GiIcons.GiDesk />,
    cName: "nav-text",
    adminRequired: true,
  },
  {
    title: "Users",
    path: "/users",
    icon: <AiIcons.AiOutlineUser />,
    cName: "nav-text",
    adminRequired: true,
  },
  {
    title: "Admin",
    path: "/Admin",
    icon: <RiIcons.RiUserStarFill />,
    cName: "nav-text",
    adminRequired: true,
  },
];
