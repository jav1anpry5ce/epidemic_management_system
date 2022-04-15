import React, { useEffect } from "react";
import { CasesChart } from ".";
import { setActiveKey } from "../store/navbarSlice";
import { useDispatch } from "react-redux";

export default function EpidemicSummary() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActiveKey("10"));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="content-layout mx-auto">
      <div className="grid grid-cols-2 gap-2">
        <CasesChart
          name="Positive Cases"
          api="api/cases/positive-cases"
          chartType="Bar"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#9400bd"
        />
        <CasesChart
          name="Hospitalized Cases"
          api="api/cases/hospitalized-cases"
          chartType="Bar"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#CC5500"
        />
        <CasesChart
          name="Death Cases"
          api="api/cases/death-cases"
          chartType="Bar"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#e80000"
        />
        <CasesChart
          name="Recovered Cases"
          api="api/cases/recovered-cases"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#00a613"
        />
        <CasesChart
          name="Test Administered"
          api="api/cases/test-administered"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#10496d"
        />
        <CasesChart
          name="Vaccine Administered"
          api="api/cases/vaccine-administered"
          width="w-[40rem]"
          height="h-[25rem]"
          color="#0094b5"
        />
      </div>
    </div>
  );
}
