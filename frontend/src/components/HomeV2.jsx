import React from "react";
import MythFacts from "./MythFacts";

export default function HomeV2() {
  const data = [
    {
      image:
        "https://vaccination.moh.gov.jm/wp-content/uploads/2021/07/Vaccine-Icon-1.png",
      myth: "The COVID-19 vaccine is not safe because it was rapidly developed.",
      fact: "The vaccine is proven safe and effective. It has gone through the same rigorous processes as every other vaccine, meeting all safety standards.",
    },
    {
      image:
        "https://vaccination.moh.gov.jm/wp-content/uploads/2021/07/Vaccine-Icon-3.png",
      myth: "The COVID-19 vaccine causes infertility in women.",
      fact: "No vaccine suspected of impacting a person’s ability to conceive, has ever been or will ever be approved.",
    },
  ];

  return (
    <div className="container p-4 max-w-7xl mx-auto ">
      <div className="grid gap-3 grid-cols-3 justify-items-center content-center">
        {data.map((item, index) => (
          <MythFacts
            key={index}
            image={item.image}
            myth={item.myth}
            fact={item.fact}
          />
        ))}
      </div>
    </div>
  );
}
