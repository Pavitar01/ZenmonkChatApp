import React from "react";

const TypingIndicator = ({ isTyping }) => {
  return (
    <div className="typing-indicator">
      {isTyping && <div className="typing-indicator__dot"></div>}
      {isTyping && <div className="typing-indicator__dot"></div>}
      {isTyping && <div className="typing-indicator__dot"></div>}
    </div>
  );
};

export default TypingIndicator;
