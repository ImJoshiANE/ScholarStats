// Firebase Related imports
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";

// React local and library related imports
import React, { useState } from "react";
import Auth from "./Auth/Auth";
import Profile from "./Profile/Profile";
import "./Home.scss";
import Loading from "./Loading/Loading";

export default Home = () => {
  const [user, setUser] = useState("unknown");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  if (user == "unknown") return <Loading />;
  else if (user == null) return <Auth />;
  else return <Profile user = {user} />;
};

// export default Home;
