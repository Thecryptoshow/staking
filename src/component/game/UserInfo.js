import React, { useState } from "react";
import Button from "./Button";

const UserInfo = ({ updateUserName, wsClient }) => {
  const [userName, updateName] = useState();

  return (
    <div
      className={"modal-container user-input-modal fixed"}
      style={{
        top: "50%",
        left: "50%",
        // transform: "translate(-50%, -50%)",
        // minWidth: 800,
        minHeight: 400,
      }}
    >
      <div
        className="modal-content py-4 text-left px-6 grid gap-6"
        style={{ height: "100%", padding: "15px" }}
      >
        <h2 className={"cols-span-6 row-span-5 text-4xl text-center"}>
          Enter your name
        </h2>
        <div
          className="content-center flex justify-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <input
            value={userName}
            onChange={(evt) => updateName(evt.target.value)}
            className=""
          />
          <Button
            border={false}
            value={"Continue"}
            onClick={() => updateUserName(userName)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
