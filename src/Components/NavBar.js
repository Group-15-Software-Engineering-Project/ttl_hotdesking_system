import React from 'react'
import { Link } from 'react-router-dom';
//hey
function NavBar() {
    return (
        <ol>
            <li><Link exact to="/">Home</Link></li>
            <li><Link exact to="/login">Login</Link></li>
        </ol>
    )
}

export default NavBar;