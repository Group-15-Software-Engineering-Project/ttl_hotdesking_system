import React, {useState} from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import {Link, useLocation} from 'react-router-dom';
import { SidebarData} from './SidebarData'
import '../public/css/Navbar.css';
import {IconContext} from 'react-icons'

function Navbar() {

    // Block to allow Admin Access - users who sign in using an admin account have access to admin portal
    // Not fully safe code - has potential for illegal access
    if(false) {
        let result = SidebarData.map(a => a.title === "Admin");
        console.log(result);
        if(result[result.length-1]) {
            SidebarData.splice(SidebarData.length - 1);
            console.log("Admin Access Removed: " + SidebarData[SidebarData.length - 2]);
        }
    }

    const [sidebar, setSidebar]=useState(false);
    const showSidebar =() =>setSidebar(!sidebar);
    const location = useLocation();
    return (location.pathname === '/Login') ?  <></> :
    (
        <>
        <IconContext.Provider value={{color: '#fff'}} >
           <div className="navbar">
               <Link to="#" className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar}/>
                   </Link> 
           </div>
           <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
               <ul className='nav-menu-items' onClick={showSidebar}>
                   <li className='navbar-toggle'>
                       <Link to="#" className='menu-bars'>
                           <AiIcons.AiOutlineClose />
                       </Link>
                   </li>
                    {SidebarData.map((item, index) =>{
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })} 
               </ul>
           </nav>
           </IconContext.Provider>
        </>
    )
}

export default Navbar
