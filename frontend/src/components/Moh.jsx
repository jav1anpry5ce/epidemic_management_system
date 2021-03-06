import React, { useEffect } from "react";
import { getBreakdown, clearState } from "../store/mohSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
// import { CasesChart } from "../components";
import Loading from "./Loading";
import { GiDrippingTube } from "react-icons/gi";
import { GoLocation } from "react-icons/go";
import { motion } from "framer-motion";

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
        name: "Pfizer",
        type: "Distribute",
        value: data.breakdownData.pfizer_to_disb,
        backgroundcolour: "#24ad74",
        icon: false,
      },
      {
        name: "Moderna",
        type: "Distribute",
        value: data.breakdownData.moderna_to_disb,
        backgroundcolour: "#24ad74",
        icon: false,
      },
      {
        name: "Johnson & Johnson",
        type: "Distribute",
        value: data.breakdownData.JJ_to_disb,
        backgroundcolour: "#24ad74",
        icon: false,
      },
      {
        name: "AstraZeneca",
        type: "Distribute",
        value: data.breakdownData.AZ_to_disb,
        backgroundcolour: "#24ad74",
        icon: false,
      },
      {
        name: "Pfizer",
        type: "Stock",
        value: data.breakdownData.pfizer_in_stock,
        backgroundcolour: "#8018d4",
        icon: true,
      },
      {
        name: "Moderna",
        type: "Stock",
        value: data.breakdownData.moderna_in_stock,
        backgroundcolour: "#8018d4",
        icon: true,
      },
      {
        name: "Johnson & Johnson",
        type: "Stock",
        value: data.breakdownData.JJ_in_stock,
        backgroundcolour: "#8018d4",
        icon: true,
      },
      {
        name: "AstraZeneca",
        type: "Stock",
        value: data.breakdownData.AZ_in_stock,
        backgroundcolour: "#8018d4",
        icon: true,
      },
      {
        name: "Total Sites",
        value: data.breakdownData.number_of_locations,
        backgroundcolour: "#8018d4",
        icon: false,
      },
    ];
    return (
      <div className="content-layout max-w-full">
        <motion.div
          layout
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="flex flex-col gap-12"
        >
          <div>
            <h3 className="mb-6 text-center text-3xl font-bold text-white">
              Vaccine to Distribute
            </h3>
            <div className="grid w-full grid-cols-4 place-items-center gap-4 px-2 pt-4">
              {cardData.map(
                (data) =>
                  data.type === "Distribute" && (
                    <div
                      key={data.name}
                      className="relative flex h-[4.625rem] w-[18rem] transform flex-col justify-center rounded bg-white px-2 drop-shadow-xl duration-300 hover:translate-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="ml-1 flex items-center gap-2">
                          {data.name === "Total Sites" && (
                            <GoLocation fontSize={25} />
                          )}
                          {data.icon && <GiDrippingTube fontSize={25} />}
                          <p className="max-w-[9rem] font-semibold text-black">
                            {data.name}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-black">
                          {data.value}
                        </p>
                      </div>
                      <div
                        style={{ backgroundColor: data.backgroundcolour }}
                        className="absolute left-0 top-0 h-full w-1.5"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-center text-3xl font-bold text-white">
              Vaccine in Stock
            </h3>
            <div className="grid w-full grid-cols-4 place-items-center gap-4 px-2 pt-4">
              {cardData.map(
                (data) =>
                  data.type === "Stock" && (
                    <div
                      key={data.name}
                      className="relative flex h-[4.625rem] w-[18rem] transform flex-col justify-center rounded bg-white px-2 drop-shadow-xl duration-300 hover:translate-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="ml-1 flex items-center gap-2">
                          {data.name === "Total Sites" && (
                            <GoLocation fontSize={25} />
                          )}
                          {data.icon && <GiDrippingTube fontSize={25} />}
                          <p className="max-w-[9rem] font-semibold text-black">
                            {data.name}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-black">
                          {data.value}
                        </p>
                      </div>
                      <div
                        style={{ backgroundColor: data.backgroundcolour }}
                        className="absolute left-0 top-0 h-full w-1.5"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          {/* {cardData.map((data) => (
            <div
              key={data.name}
              className="relative flex h-[4.625rem] w-[18rem] transform flex-col justify-center rounded bg-white px-2 drop-shadow-xl duration-300 hover:translate-x-6"
            >
              <div className="flex items-center justify-between">
                <div className="ml-1 flex items-center gap-2">
                  {data.name === "Total Sites" && <GoLocation fontSize={25} />}
                  {data.icon && <GiDrippingTube fontSize={25} />}
                  <p className="max-w-[9rem] font-semibold text-black">
                    {data.name}
                  </p>
                </div>
                <p className="text-lg font-semibold text-black">{data.value}</p>
              </div>
              <div
                style={{ backgroundColor: data.backgroundcolour }}
                className="absolute left-0 top-0 h-full w-1.5"
              />
            </div>
          ))} */}
        </motion.div>
        {/* <div className="flex w-full flex-1 flex-wrap place-content-center gap-3 px-2 py-4">
          <CasesChart
            name="Positive Cases"
            api="api/cases/positive-cases"
            chartType="Bar"
          />
          <CasesChart
            name="Hospitalized Cases"
            api="api/cases/hospitalized-cases"
            chartType="Bar"
          />
          <CasesChart
            name="Death Cases"
            api="api/cases/death-cases"
            chartType="Bar"
          />
          <CasesChart name="Recovered Cases" api="api/cases/recovered-cases" />
          <CasesChart
            name="Test Administered"
            api="api/cases/test-administered"
          />
          <CasesChart
            name="Vaccine Administered"
            api="api/cases/vaccine-administered"
          />
        </div> */}
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
          No data was returned.
        </h1>
      </div>
    );
}
