// React local and library related imports
import React from "react";
import LogoutButton from "../../LogoutButton/LogoutButton";

import "./Profile.scss";
import ScholarId from "./ScholarId/ScholarId";

// Profile Component
const Profile = ({ user }) => {
  return (
    <div className="container">
      <div className="profile-container">
        <div className="box1 box">
          <div className="content">
            <div className="image">
              <img src={user.photoURL} alt="Profile Image" />
            </div>
            <div className="text">
              <p className="name">{user.displayName}</p>
              <p className="job_title">{user.email}</p>
              <ScholarId />
            </div>
            <div className="button">
              <div>
                <button className="message profile-btn" type="button">
                  Generate New
                </button>
              </div>
              <div>
                <button className="connect profile-btn" type="button">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};

export default Profile;
