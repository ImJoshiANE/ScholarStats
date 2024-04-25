import { Link } from "react-router-dom";
import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <nav>
      <div className="logo">
        <Link to="/ScholarStat" className="logo-link">
          <h2>ScholarStat</h2>
        </Link>
      </div>
      <ul className="nav-links">
        <li className="nav-item">
          <Link className="nav-link" to="/ScholarStat">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/ScholarStat/HowTo">
            HowTo
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Header;
