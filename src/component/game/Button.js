import React from "react";

const Button = ({
  value,
  onClick,
  isSelected,
  className = "",
  border = true,
}) => (
  <div className="col-sm-6">
    <button
      style={{ width: "100%" }}
      onClick={onClick}
      className={`answer ${
        isSelected ? "selected-btn" : className || "bg-blue-300"
      }`}
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></button>
  </div>
);

export default Button;
