import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-navBlue-normal flex h-full w-full justify-center">
      <div className="p-1">
        {/* <h3 className="text-center text-base text-white">
          © 2021{" "}
          <Link className="cursor-pointer hover:underline" to="/accounts/login">
            Ministry of Health
          </Link>{" "}
          & Wellness Jamaica.
        </h3> */}
        <h3 className="text-center text-base text-white">
          Site developed by Blue Star Technologies Solution.
        </h3>
      </div>
    </div>
  );
}
