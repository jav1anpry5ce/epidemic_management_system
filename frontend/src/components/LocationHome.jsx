import React, { useEffect } from "react";
import { locationBreakdown, clearState } from "../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import Loading from "./Loading";
import { CasesChart } from "../components";
import { motion } from "framer-motion";

export default function LocationHome() {
  const data = useSelector((state) => state.location);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(locationBreakdown());
    dispatch(setActiveKey("1"));
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  if (data.locationData) {
    const cardData = [
      data.locationData.pfizer_in_stock !== null && {
        name: "Pfizer In Stock",
        data: data.locationData.pfizer_in_stock,
        backgroundcolour: "#10496d",
        visible: data.locationData.pfizer_in_stock !== null ? true : false,
      },
      data.locationData.moderna_in_stock !== null && {
        name: "Moderna In Stock",
        data: data.locationData.moderna_in_stock,
        backgroundcolour: "#10496d",
        visible: data.locationData.moderna_in_stock !== null ? true : false,
      },
      data.locationData.jj_in_stock !== null && {
        name: "Johnson & Johnson In Stock",
        data: data.locationData.jj_in_stock,
        backgroundcolour: "#10496d",
        visible: data.locationData.jj_in_stock !== null ? true : false,
      },
      data.locationData.az_in_stock !== null && {
        name: "AstraZeneca In Stock",
        data: data.locationData.az_in_stock,
        backgroundcolour: "#4f8598",
        visible: data.locationData.az_in_stock !== null ? true : false,
      },
      {
        name: "Pending Appointments",
        data: data.locationData.pending_appointments,
        backgroundcolour: "#4f8598",
        visible: true,
      },
    ];
    return (
      <div className="content-layout container max-w-full flex-col">
        <motion.div
          layout
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="grid w-full grid-cols-3 place-items-center gap-4 px-2 pt-4"
        >
          {cardData.map(
            (data) =>
              data.visible && (
                <div
                  key={data.name}
                  className="relative flex h-[4.625rem] w-[18rem] transform flex-col justify-center rounded bg-white px-2 drop-shadow-xl duration-300 hover:translate-x-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="ml-1 flex items-center gap-2">
                      <p className="max-w-[9rem] font-semibold text-black">
                        {data.name}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-black">
                      {data.data}
                    </p>
                  </div>
                  <div
                    style={{ backgroundColor: data.backgroundcolour }}
                    className="absolute left-0 top-0 h-full w-1.5"
                  />
                </div>
              )
          )}
        </motion.div>
        <div className="flex w-full flex-1 flex-wrap place-content-center gap-3 px-2 py-4">
          <CasesChart
            width="w-[40rem]"
            name="Test Administered"
            api="api/cases/test-administered"
          />
          <CasesChart
            width="w-[40rem]"
            name="Vaccine Administered"
            api="api/cases/vaccine-administered"
          />
        </div>
      </div>
    );
  }
  if (data.loading) return <Loading />;
  if (!data.loading && !data.locationData)
    return (
      <div className="flex min-h-[calc(100vh-104px)] items-center justify-center">
        <h1 className="text-3xl font-semibold text-white">
          Something went wrong!
        </h1>
      </div>
    );
}
