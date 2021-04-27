import React from "react";

const Button = ({
  value,
  onClick,
  isSelected,
  className = "",
  border = true,
}) => (
  <button
    onClick={onClick}
    className={`answer ${
      isSelected ? "selected-btn" : className || "bg-blue-300"
    }`}
    dangerouslySetInnerHTML={{
      __html: value,
    }}
  ></button>
);

export default Button;
