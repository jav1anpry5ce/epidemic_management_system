import React, { useEffect } from "react";
import { getBreakdown, clearState } from "../../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../../store/navbarSlice";
import Loading from "../Loading";

export default function MOHHOME() {
  const data = useSelector((state) => state.moh);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBreakdown());
    dispatch(setActiveKey("1"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  if (data.breakdownData) {
    const cardData = [
      {
        name: "Pfizer To Distribute",
        value: data.breakdownData.pfizer_to_disb,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Moderna To Distribute",
        value: data.breakdownData.moderna_to_disb,
        backgroundcolour: "#10496d",
      },
      {
        name: "Johnson&Johnson To Distribute",
        value: data.breakdownData.JJ_to_disb,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Pfizer In Stock",
        value: data.breakdownData.pfizer_in_stock,
        backgroundcolour: "#225955",
      },
      {
        name: "Moderna In Stock",
        value: data.breakdownData.moderna_in_stock,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Johnson&Johnson In Stock",
        value: data.breakdownData.JJ_in_stock,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Positive Cases",
        value: data.breakdownData.positive_cases,
        backgroundcolour: "#10496d",
      },
      {
        name: "Hospitalized",
        value: data.breakdownData.hospitalized,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Death",
        value: data.breakdownData.death,
        backgroundcolour: "#10496d",
      },
      {
        name: "Recovered",
        value: data.breakdownData.recovered,
        backgroundcolour: "#4f8598",
      },
      {
        name: "Tests Administered",
        value: data.breakdownData.test_count,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Vaccines Administered",
        value: data.breakdownData.vaccines_administer,
        backgroundcolour: "#225955",
      },
    ];
    return (
      <div className="container max-w-8xl mx-auto min-h-[86.89vh] flex">
        <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-content-center gap-4 px-2 py-4">
          {cardData.map((data) => (
            <div
              key={data.name}
              className="text-white px-4 py-3 h-44 rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 space-y-10"
              style={{ backgroundColor: data.backgroundcolour }}
            >
              <h3 className="text-2xl font-semibold text-center">
                {data.name}
              </h3>
              <p className="text-center text-xl font-semibold">{data.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (data.loading && !data.breakdownData) {
    return <Loading />;
  }
  if (!data.loading && !data.breakdownData)
    return (
      <div
        style={{ minHeight: "83.5vh" }}
        className="flex justify-center items-center"
      >
        <h1 className="text-3xl font-semibold text-white">
          Something went wrong!
        </h1>
      </div>
    );
}
