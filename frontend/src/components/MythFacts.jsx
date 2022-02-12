import React from "react";

export default function MythFacts({ image, myth, fact }) {
  return (
    <div className="flex max-w-[25rem] items-center rounded-xl  bg-white hover:scale-[1.01] hover:shadow-xl hover:shadow-slate-900/40 hover:outline hover:outline-2 hover:outline-blue-500/70">
      <div className="flex flex-col items-center justify-center py-4 px-2">
        <img src={image} alt="cartoon" className="h-20 w-20" />
        <p className="text-lg font-bold text-blue-700">Myth</p>
        <p className="text-center font-semibold text-gray-600">{myth}</p>
        <p className="text-xl font-bold text-blue-700">FACT</p>
        <p className="text-center font-[900] text-blue-700">{fact}</p>
      </div>
    </div>
  );
}
