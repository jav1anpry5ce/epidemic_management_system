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
    <div className="bg-gray-100 flex justify-center items-center flex-col space-y-3 font-mono px-2 min-h-[93.5vh]">
      <h3 className="text-7xl font-bold tracking-wide text-center text-black">
        404
      </h3>
      <p className="text-xl font-semibold text-center text-black">Not Found</p>
      <p className="text-lg font-medium text-center text-black">
        The resource requested could not be found!
      </p>
      <button
        className="py-1.5 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white transform transition hover:-translate-y-0.5 duration-300"
        onClick={redirect}
      >
        Go Home
      </button>
    </div>
  );
}
