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
      <div className="flex flex-col gap-3">
        <CasesChart
          name="Positive Cases"
          api="api/cases/positive-cases"
          chartType="Bar"
          width="w-[75rem]"
          height="h-[30rem]"
        />
        <CasesChart
          name="Hospitalized Cases"
          api="api/cases/hospitalized-cases"
          chartType="Bar"
          width="w-[75rem]"
          height="h-[30rem]"
        />
        <CasesChart
          name="Death Cases"
          api="api/cases/death-cases"
          chartType="Bar"
          width="w-[75rem]"
          height="h-[30rem]"
        />
        <CasesChart
          name="Recovered Cases"
          api="api/cases/recovered-cases"
          width="w-[75rem]"
          height="h-[30rem]"
        />
        <CasesChart
          name="Test Administered"
          api="api/cases/test-administered"
          width="w-[75rem]"
          height="h-[30rem]"
        />
        <CasesChart
          name="Vaccine Administered"
          api="api/cases/vaccine-administered"
          width="w-[75rem]"
          height="h-[30rem]"
        />
      </div>
    </div>
  );
}
