import React from "react";

const Confirm = ({
  value,
  onClick,
  isSelected,
  flash,
  className = "",
  border = true,
}) => (
  <button
    style={{ paddingTop: "10px" }}
    onClick={onClick}
    className={`confirm  ${flash ? "blink_me" : ""} ${
      isSelected ? "selected-btn" : className || ""
    }`}
    dangerouslySetInnerHTML={{
      __html: value,
    }}
  ></button>
);

export default Confirm;
