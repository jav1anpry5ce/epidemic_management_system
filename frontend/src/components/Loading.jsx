import React from "react";
import { SpinnerCircular } from "spinners-react";

function Loading() {
  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
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
