import React from "react";
import { SpinnerCircular } from "spinners-react";

function Loading() {
  return (
    <div
      className="flex h-[calc(100vh-125px)] flex-1 items-center justify-center"
      style={{ margin: "10px" }}
    >
      <SpinnerCircular
        size={90}
        thickness={67}
        speed={100}
        color="rgba(71, 172, 255, 255)"
        secondaryColor="rgba(172, 57, 59, 0)"
      />
    </div>
  );
}

export default Loading;
