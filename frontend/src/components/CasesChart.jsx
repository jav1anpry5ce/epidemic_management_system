import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import { DatePicker } from "antd";
import { motion } from "framer-motion";

export default function PositiveCasesChart({ name, api, width, height, chartType, color }) {
  const [cases, setCases] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("token"),
      },
    };
    axios.get(`${api}?year=${year}&month=${month}`, config).then((res) => {
      setCases(res.data);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [year, month]);

  const getYearMonth = (e) => {
    setYear(new Date(e._d).getFullYear());
    setMonth(new Date(e._d).getMonth() + 1);
  };
  if (chartType === "Bar") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`${width ? width : "w-[28rem]"} ${
          height ? height : "h-[20rem]"
        }  overflow-hidden rounded bg-white`}
      >
        <h3
          style={{ background: color }}
          className={`rounded-t py-1 text-center text-lg font-semibold text-white`}
        >
          {name}
        </h3>
        <div className="flex h-full w-full flex-col items-center p-2">
          <div className="flex w-full items-center justify-between gap-2">
            <DatePicker
              picker="month"
              className="w-[40%]"
              onChange={(e) => getYearMonth(e)}
            />
            <p className="font-semibold">
              Total: {loading ? "loading..." : cases?.total}
            </p>
          </div>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="-mt-16">Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="79%">
              <BarChart
                width={500}
                height={300}
                data={cases?.Data}
                margin={{
                  top: 10,
                  right: 5,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval="preserveStart" />
                <YAxis interval="preserveStart" />
                <Tooltip />
                <Legend />
                {cases?.Data && cases?.Data[0]?.Administered >= 0 ? (
                  <Bar dataKey="Administered" fill={color} />
                ) : (
                  <Bar dataKey="Cases" fill={color} />
                )}
                {/* <Bar dataKey={"cases" || "Administered"} fill={color} /> */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`h-[20rem] ${width ? width : "w-[28rem]"} ${
          height ? height : "h-[20rem]"
        } overflow-hidden rounded bg-white`}
      >
        <h3
          style={{ background: color }}
          className="rounded-t py-1 text-center text-lg font-semibold text-white"
        >
          {name}
        </h3>

        <div className="flex h-full w-full flex-col items-center p-2">
          <div className="flex w-full items-center justify-between gap-2">
            <DatePicker
              picker="month"
              className="w-[40%]"
              onChange={(e) => getYearMonth(e)}
            />
            <p className="font-semibold">
              Total: {loading ? "loading..." : cases?.total}
            </p>
          </div>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="-mt-16">Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="79%">
              <LineChart
                width={500}
                height={300}
                data={cases?.Data}
                margin={{
                  top: 10,
                  right: 5,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval="preserveStart" />
                <YAxis interval="preserveStart" />
                <Tooltip />
                <Legend />
                {console.log(cases?.Data && cases?.Data[0]?.Administered)}
                {cases?.Data && cases?.Data[0]?.Administered >= 0 ? (
                  <Line
                    type="monotone"
                    dataKey="Administered"
                    stroke={color}
                    activeDot={{ r: 8 }}
                  />
                ) : (
                  <Line
                    type="monotone"
                    dataKey="Cases"
                    stroke={color}
                    activeDot={{ r: 8 }}
                  />
                )}
                {/* <Line
                  type="monotone"
                  dataKey="cases"
                  stroke={color}
                  activeDot={{ r: 8 }}
                /> */}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    );
  }
}
