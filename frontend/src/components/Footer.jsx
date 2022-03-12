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
        <Link
          className="flex items-center justify-center text-center text-base text-white"
          to="/accounts/login"
        >
          © 2022 Site developed by Blue Star Technologies Solution.
        </Link>
      </div>
    </div>
  );
}
