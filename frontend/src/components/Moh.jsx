import React, { useEffect } from "react";
import { getBreakdown, clearState } from "../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import Loading from "./Loading";

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
        backgroundcolour: "#10496d",
      },
      {
        name: "Moderna To Distribute",
        value: data.breakdownData.moderna_to_disb,
        backgroundcolour: "#10496d",
      },
      {
        name: "Johnson & Johnson To Distribute",
        value: data.breakdownData.JJ_to_disb,
        backgroundcolour: "#10496d",
      },
      {
        name: "AstraZeneca To Distribute",
        value: data.breakdownData.AZ_to_disb,
        backgroundcolour: "#10496d",
      },
      {
        name: "Pfizer In Stock",
        value: data.breakdownData.pfizer_in_stock,
        backgroundcolour: "#164e61",
      },
      {
        name: "Moderna In Stock",
        value: data.breakdownData.moderna_in_stock,
        backgroundcolour: "#164e61",
      },
      {
        name: "Johnson & Johnson In Stock",
        value: data.breakdownData.JJ_in_stock,
        backgroundcolour: "#164e61",
      },
      {
        name: "AstraZeneca In Stock",
        value: data.breakdownData.AZ_in_stock,
        backgroundcolour: "#164e61",
      },
      {
        name: "Positive Cases",
        value: data.breakdownData.positive_cases,
        backgroundcolour: "#225955",
      },
      {
        name: "Hospitalized",
        value: data.breakdownData.hospitalized,
        backgroundcolour: "#225955",
      },
      {
        name: "Death",
        value: data.breakdownData.death,
        backgroundcolour: "#225955",
      },
      {
        name: "Recovered",
        value: data.breakdownData.recovered,
        backgroundcolour: "#225955",
      },
      {
        name: "Tests Administered",
        value: data.breakdownData.test_count,
        backgroundcolour: "#437ab2",
      },
      {
        name: "Vaccines Administered",
        value: data.breakdownData.vaccines_administer,
        backgroundcolour: "#437ab2",
      },
    ];
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-105px)] max-w-full">
        <div className="flex w-full flex-1 flex-wrap place-content-center gap-3 px-2 py-4">
          {cardData.map((data) => (
            <div
              key={data.name}
              className="flex h-44 w-80 flex-col justify-between rounded-lg px-4 py-3 pb-12 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: data.backgroundcolour }}
            >
              <h3 className="text-center text-2xl font-semibold">
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
      <div className="flex min-h-[calc(100vh-105px)] items-center justify-center">
        <h1 className="text-3xl font-semibold text-white">
          Something went wrong!
        </h1>
      </div>
    );
}
