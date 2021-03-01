import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

export const SidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    className: "sidebar-text",
  },
  {
    title: "Book Desk",
    path: "/booking-page",
    icon: <IoIcons.IoIosPaper />,
    className: "sidebar-text",
  },
  {
    title: "Booking History",
    path: "/history",
    icon: <AiIcons.AiOutlineHistory />,
    className: "sidebar-text",
  },
  {
    title: "Account",
    path: "/account",
    icon: <MdIcons.MdAccountCircle />,
    className: "sidebar-text",
  },
];
