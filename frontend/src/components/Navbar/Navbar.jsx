import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav>
            <div className="navbar-container">
                <div className="lgo">
                    <Link to="/" onClick={closeMenu}>
                        <span>Gym</span><span className="highlight">Hut</span>
                    </Link>
                </div>

                <div className="hamburger" onClick={toggleMenu}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/featured-courses" onClick={closeMenu}>Courses</Link></li>
                    <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
                    <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
                    <li><Link to="/admin" onClick={closeMenu}>Admin</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
