import React from "react";
import { motion } from "framer-motion";

export default function MythFacts({ image, myth, fact }) {
  return (
    <motion.div
      layout
      whileInView={{ opacity: [0, 1] }}
      viewport={{ once: true }}
      transition={{ ease: "linear" }}
      exit={{ opacity: 0 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="flex max-w-[25rem] items-center rounded-xl bg-white hover:shadow-xl 
      hover:shadow-slate-900/40 hover:outline hover:outline-2 hover:outline-blue-500/70 
      active:outline active:outline-2 active:outline-blue-500/70"
    >
      <div className="flex flex-col items-center justify-center py-4 px-2">
        <img src={image} alt="cartoon" className="aspect-square h-20 w-20" />
        <p className="text-lg font-bold text-blue-700">Myth</p>
        <p className="text-center font-semibold text-gray-600">{myth}</p>
        <p className="text-xl font-bold text-blue-700">FACT</p>
        <p className="text-center font-[900] text-blue-700">{fact}</p>
      </div>
    </motion.div>
  );
}
