import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MythFacts({ image, myth, fact }) {
  const [show, setShow] = useState(false);
  const buttonRef = useRef();
  useEffect(() => {
    if (show) buttonRef.current.textContent = "Hide Fact";
    else buttonRef.current.textContent = "View Fact";
  }, [show]);
  return (
    <motion.div
      layout
      initial={{ opacity: 0.3, scale: 0.75 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ease: "easeInOut" }}
      className="flex w-[22rem] overflow-hidden rounded-xl bg-white
      hover:scale-105 hover:shadow-md hover:shadow-slate-900/40 hover:outline
      hover:outline-2 hover:outline-blue-500/70 active:outline active:outline-2 active:outline-blue-500/70"
    >
      <motion.div
        layout="position"
        transition={{ layout: { duration: 1, type: "spring" } }}
        className="flex h-full w-full flex-col items-center justify-between gap-1 p-3"
      >
        <img src={image} alt="cartoon" className="aspect-square h-20 w-20" />
        <p className="text-lg font-bold text-blue-700">Myth</p>
        <p className="text-center font-semibold text-gray-600">{myth}</p>
        <button
          ref={buttonRef}
          className="my-4 rounded bg-violet-600 px-6 py-2 text-white hover:shadow-xl hover:shadow-violet-600/40"
          onClick={() => setShow(!show)}
        >
          View Fact
        </button>
        {show && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-[900] text-blue-700"
          >
            {fact}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
