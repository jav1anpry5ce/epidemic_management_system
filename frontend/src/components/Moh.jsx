import React, { useEffect } from "react";
import { getBreakdown, clearState } from "../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import { CasesChart } from "../components";
import Loading from "./Loading";
import { GiDrippingTube } from "react-icons/gi";

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
        icon: false,
      },
      {
        name: "Moderna To Distribute",
        value: data.breakdownData.moderna_to_disb,
        backgroundcolour: "#10496d",
        icon: false,
      },
      {
        name: "Johnson & Johnson To Distribute",
        value: data.breakdownData.JJ_to_disb,
        backgroundcolour: "#10496d",
        icon: false,
      },
      {
        name: "AstraZeneca To Distribute",
        value: data.breakdownData.AZ_to_disb,
        backgroundcolour: "#10496d",
        icon: false,
      },
      {
        name: "Pfizer In Stock",
        value: data.breakdownData.pfizer_in_stock,
        backgroundcolour: "#24ad74",
        icon: true,
      },
      {
        name: "Moderna In Stock",
        value: data.breakdownData.moderna_in_stock,
        backgroundcolour: "#24ad74",
        icon: true,
      },
      {
        name: "Johnson & Johnson In Stock",
        value: data.breakdownData.JJ_in_stock,
        backgroundcolour: "#24ad74",
        icon: true,
      },
      {
        name: "AstraZeneca In Stock",
        value: data.breakdownData.AZ_in_stock,
        backgroundcolour: "#24ad74",
        icon: true,
      },
    ];
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-105px)] max-w-full flex-col">
        <div className="grid w-full grid-cols-3 place-items-center gap-4 px-2 pt-4">
          {cardData.map((data) => (
            <div
              key={data.name}
              className="relative flex h-[4.625rem] w-[18rem] flex-col justify-center rounded bg-white px-2 drop-shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="ml-1 flex items-center gap-2">
                  {data.icon && <GiDrippingTube fontSize={25} />}
                  <p className="max-w-[9rem] font-semibold text-black">
                    {data.name}
                  </p>
                </div>
                <p className="text-lg font-semibold text-black">{data.value}</p>
              </div>
              <div
                style={{ backgroundColor: data.backgroundcolour }}
                className="absolute left-0 top-0 h-full w-2"
              />
            </div>
            // <div
            //   key={data.name}
            //   className="flex h-44 w-60 flex-col justify-between rounded-lg px-4 py-3 pb-12 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            //   style={{ backgroundColor: data.backgroundcolour }}
            // >
            //   <h3 className="text-center text-2xl font-semibold">
            //     {data.name}
            //   </h3>
            //   <p className="text-center text-xl font-semibold">{data.value}</p>
            // </div>
          ))}
        </div>
        <div className="flex w-full flex-1 flex-wrap place-content-center gap-3 px-2 py-4">
          <CasesChart name="Positive Cases" api="api/cases/positive-cases" />
          <CasesChart
            name="Hospitalized Cases"
            api="api/cases/hospitalized-cases"
          />
          <CasesChart name="Death Cases" api="api/cases/death-cases" />
          <CasesChart name="Recovered Cases" api="api/cases/recovered-cases" />
          <CasesChart
            name="Test Administered"
            api="api/cases/test-administered"
          />
          <CasesChart
            name="Vaccine Administered"
            api="api/cases/test-administered"
          />
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
