import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound({ setHide }) {
  const navigate = useNavigate();
  useEffect(() => {
    setHide(true);
    return () => setHide(false);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="bg-gray-100 flex justify-center items-center flex-col space-y-3 font-mono px-2 h-[93vh]">
      <h3 className="text-7xl font-bold tracking-wide text-center">404</h3>
      <p className="text-xl font-semibold text-center">Not Found</p>
      <p className="text-lg font-medium text-center">
        The resource requested could not be found!
      </p>
      <button
        className="py-1.5 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transform transition hover:-translate-y-0.5 duration-300"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}
