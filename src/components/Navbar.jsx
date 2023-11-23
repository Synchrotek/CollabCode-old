import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import './Navbar.css'
import { IconContext } from 'react-icons';
import TodoApp from './TodoApp';

const Navbar = () => {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);


    return (<IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
            <Link to="" className='menu-bars'>
                <FaBars onClick={showSidebar} />
            </Link>
            <div className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <div className='nav-menu-items'>
                    <div className="navbar-toggle">
                        <Link className='menu-bar-close'>
                            <AiOutlineClose onClick={showSidebar} />
                        </Link>
                    </div>
                    <TodoApp />
                </div>
            </div>
        </div>
    </IconContext.Provider>
    )
}

export default Navbar