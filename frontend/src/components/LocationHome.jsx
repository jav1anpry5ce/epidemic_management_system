import React, { useEffect } from "react";
import { locationBreakdown, clearState } from "../store/locationSlice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveKey } from "../store/navbarSlice";
import Loading from "./Loading";

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
        backgroundcolour: "#4f8598",
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
        backgroundcolour: "#10496d",
        visible: true,
      },
      data.locationData.offer_testing && {
        name: "Tests Administerd",
        data: data.locationData.number_of_tests,
        backgroundcolour: "#4f8598",
        visible: true,
      },
      data.locationData.offer_vaccines &&
        data.locationData.vaccines_administer !== null && {
          name: "Vaccines Administerd",
          data: data.locationData.vaccines_administer,
          backgroundcolour: "#10496d",
          visible:
            data.locationData.vaccines_administer !== null ? true : false,
        },
    ];
    return (
      <div className="container mx-auto flex min-h-[86vh] max-w-7xl">
        <div className="flex w-full flex-1 flex-wrap place-content-center gap-6 px-2 py-4">
          {cardData.map(
            (data) =>
              data.visible && (
                <div
                  key={data.name}
                  className="flex h-44 w-96 flex-col justify-between rounded-lg px-4 py-3 pb-12 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: data.backgroundcolour }}
                >
                  <h3 className="text-center text-2xl font-semibold">
                    {data.name}
                  </h3>
                  <p className="text-center text-xl font-semibold">
                    {data.data}
                  </p>
                </div>
              )
          )}
        </div>
      </div>
    );
  }
  if (data.loading) return <Loading />;
  if (!data.loading && !data.locationData)
    return (
      <div className="flex min-h-[83vh] items-center justify-center">
        <h1 className="text-3xl font-semibold text-white">
          Something went wrong!
        </h1>
      </div>
    );
}
