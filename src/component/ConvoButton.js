import React, { useState, useEffect } from "react";
import bg1 from "../assets/images/bg1.png";

const ConvoButton = ({ setStartConvo, startcConvo }) => {

  return (
    <div className="startconvo">
      <img src={bg1} />
      <button
        onClick={() => {
          startcConvo ? setStartConvo(false) : setStartConvo(true);
        }}
      >
        Start Conversation
      </button>
    </div>
  );
};

export default ConvoButton;
