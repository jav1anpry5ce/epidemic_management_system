import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NotFound({ setHide }) {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const redirect = () => {
    if (auth.is_moh_staff) navigate("/moh");
    else if (auth.is_auth) navigate(`/${auth.location}`);
    else navigate("/");
  };
  useEffect(() => {
    setHide(true);
    return () => setHide(false);
    // eslint-disable-next-line
  }, []);
  return (
    <div
      className="flex h-full min-h-[calc(100vh-32px)] flex-col items-center justify-center 
    space-y-3 bg-gray-100 px-2 font-mono"
    >
      <h3 className="text-center text-7xl font-bold tracking-wide text-black">
        404
      </h3>
      <p className="text-center text-xl font-semibold text-black">Not Found</p>
      <p className="text-center text-lg font-medium text-black">
        The resource requested could not be found!
      </p>
      <button
        className="transform rounded-lg bg-gray-700 
        py-1.5 px-4 text-white transition duration-300 hover:-translate-y-0.5 
        hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
        onClick={redirect}
      >
        Go Home
      </button>
    </div>
  );
}
