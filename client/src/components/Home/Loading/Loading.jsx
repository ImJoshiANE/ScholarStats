import React from "react";
import "./Loading.scss";
import Spinner from "../Spinner/Spinner";

const Loading = () => {
  return (
    <div className="spinner-container">
      <Spinner/>
    </div>
  );
};

export default Loading;
