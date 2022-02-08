import React from "react";

export default function MythFacts({ image, myth, fact }) {
  return (
    <div className="bg-white rounded-xl transform translate hover:scale-105 w-[25rem]">
      <div className="flex flex-col justify-center items-center py-4 px-2">
        <img src={image} alt="cartoon" className="w-20 h-20" />
        <p className="font-bold text-lg text-blue-700">Myth</p>
        <p className="text-center text-gray-600 font-semibold">{myth}</p>
        <p className="font-bold text-xl text-blue-700">FACT</p>
        <p className="font-[900] text-blue-700 text-center">{fact}</p>
      </div>
    </div>
  );
}
