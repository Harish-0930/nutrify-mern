import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import './header.css';

export default function Header(){
    const [navActive, setNavActive] = useState(false);
    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('nutrify-user');
        loggedData.setLoggedUser(null);
        navigate('/login');
    }

    function toggleMenu() {
        setNavActive(!navActive);
    }

    return (
        <div className="header">
            <h1 className="Brand">Nutrify</h1>
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={`nav-links ${navActive ? 'active' : ''}`}>
                <li><Link to="/track">Track Food</Link></li>
                <li><Link to="/diet">Diet</Link></li>
                <div className="user-name">{loggedData.loggedUser.name}</div>
                <li onClick={logout} className="logout">Logout</li>
            </ul>
            
        </div>
    );
}
