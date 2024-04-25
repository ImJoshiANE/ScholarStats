import React, { useState } from "react";
import LineAnimation from "../../../LineAnimation/LineAnimation";
import Input from "./Input";
import "./ScholarId.scss";

const ScholarId = () => {
  const [googleScholarId, setGoogleScholarId] = useState(null);

  if (googleScholarId == "unknown") {
    return <LineAnimation />;
  } else if (googleScholarId == null) {
    return <Input />;
  } else {
    return (
      <div className="id-container">
        {"Google Scholar ID - " + googleScholarId}
      </div>
    );
  }
};

export default ScholarId;
