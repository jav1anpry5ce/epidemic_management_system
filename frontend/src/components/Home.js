import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGraphicalData, clearState } from "../store/graphSlice";
import { setActiveKey } from "./../store/navbarSlice";
import Container from "@mui/material/Container";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Select } from "antd";
import Loading from "./Loading";
import moment from "moment";
import shortid from "shortid";

const { Option } = Select;

const parishData = [
  { label: "All", value: "All" },
  { label: "St. Andrew", value: "St. Andrew" },
  { label: "Portland ", value: "Portland " },
  { label: "St. Thomas", value: "St. Thomas" },
  { label: "St. Catherine", value: "St. Catherine" },
  { label: "St. Mary", value: "St. Mary" },
  { label: "St. Ann", value: "St. Ann" },
  { label: "Manchester", value: "Manchester" },
  { label: "Clarendon", value: "Clarendon" },
  { label: "Hanover", value: "Hanover" },
  { label: "Westmoreland", value: "Westmoreland" },
  { label: "St. James", value: "St. James" },
  { label: "Trelawny", value: "Trelawny" },
  { label: "St. Elizabeth", value: "St. Elizabeth" },
];

export default function Home() {
  const graph = useSelector((state) => state.graph);
  const dispatch = useDispatch();
  const [month, setMonth] = useState(parseInt(new Date().getMonth()) + 1);
  const [year, setYear] = useState(parseInt(new Date().getFullYear()));
  const [mobile, setMobile] = useState(false);
  const [death, setDeath] = useState();
  const [recovered, setRecovered] = useState();
  const [hospitalized, setHospitalized] = useState();
  const [male, setMale] = useState();
  const [female, setFemale] = useState();
  const [vaccinations, setVaccinations] = useState();
  const [parish, setParish] = useState("All");

  useEffect(() => {
    dispatch(setActiveKey("1"));
    window.addEventListener("resize", resize);
    if (window.innerHeight <= 600 || window.innerWidth <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
    // eslint-disable-next-line
  }, []);

  const resize = () => {
    if (window.innerHeight <= 600 || window.innerWidth <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  };

  useEffect(() => {
    const data = {
      year,
      month,
      parish,
    };
    dispatch(getGraphicalData(data));

    // eslint-disable-next-line
  }, [year, month, parish]);

  useEffect(() => {
    return () => dispatch(clearState());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (graph.data) {
      let d = 0;
      let r = 0;
      let h = 0;
      let f = 0;
      let m = 0;
      let v = 0;
      graph.data.drl.map((item) => {
        d += item.death;
        r += item.recovered;
        h += item.recovered;
        return d;
      });
      graph.data.mvf.map((item) => {
        m += item.male;
        f += item.female;
        return f;
      });
      graph.data.vaccinations.map((item) => {
        v += item.vaccinations;
        return v;
      });
      setDeath(d);
      setRecovered(r);
      setHospitalized(h);
      setMale(m);
      setFemale(f);
      setVaccinations(v);
    }
    // eslint-disable-next-line
  }, [graph.data]);

  if (!graph.data && graph.loading) return <Loading />;
  if (graph.data) {
    if (!mobile)
      return (
        <Container maxWidth="lg">
          {/* <article className="bg-slate-800/70 backdrop-blur-sm w-full h-full px-4 py-2 rounded-md mt-4">
            <p className="text-white text-2xl">
              The Epidemic Response Management System is a web based application
              that is designed to manage and track data of the COVID-19 pandemic
              in Jamaica in order to reduce the likelihood of an epidemic. ERMS
              is a user-friendly centralized system for user testing &
              vaccination, digitalized reporting and the monitoring of vaccine
              inventory for a reduction of shortage.
            </p>
          </article> */}
          <div className="flex flex-col justify-center items-center py-2 space-y-2 w-full h-full my-2">
            <div className="bg-white rounded-md shadow-md w-full py-2">
              <div className="px-2 mb-2">
                <div className="flex justify-between items-center">
                  <DatePicker
                    picker="month"
                    format="MMM-YYYY"
                    className="w-64"
                    onChange={(e) => {
                      setMonth(parseInt(new Date(e._d).getMonth()) + 1);
                      setYear(parseInt(new Date(e._d).getFullYear()));
                    }}
                    defaultValue={moment(new Date())}
                    allowClear={false}
                  />
                  <h1 className="text-center font-semibold text-2xl">
                    Death Vs Recovered Vs Hospitalized
                  </h1>
                  <Select
                    className="w-64"
                    value={parish}
                    onChange={(e) => setParish(e)}
                  >
                    {parishData.map((item) => (
                      <Option value={item.value} key={shortid.generate()}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div style={{ width: "100%", height: 400 }} className="px-8">
                <ResponsiveContainer>
                  {/* <BarChart data={graph.data.drl} width={730}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="death" fill="#e83b2e" />
                    <Bar dataKey="recovered" fill="#82ca9d" />
                    <Bar dataKey="hospitalized" fill="#355ce8" />
                  </BarChart> */}
                  <LineChart
                    data={graph.data.drl}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="death" stroke="#e83b2e" />
                    <Line
                      type="monotone"
                      dataKey="recovered"
                      stroke="#82ca9d"
                    />
                    <Line
                      type="monotone"
                      dataKey="hospitalized"
                      stroke="#355ce8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-md shadow-md w-full py-2">
              <h1 className="text-center font-semibold text-2xl">
                Male Vs Female
              </h1>
              <div style={{ width: "100%", height: 400 }} className="px-8">
                <ResponsiveContainer>
                  <LineChart
                    data={graph.data.mvf}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="male" stroke="#355ce8" />
                    <Line type="monotone" dataKey="female" stroke="#f36eff" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>{" "}
            <div className="bg-white rounded-md shadow-md w-full py-2">
              <h1 className="text-center font-semibold text-2xl">
                Vaccination
              </h1>
              <div style={{ width: "100%", height: 400 }} className="px-8">
                <ResponsiveContainer>
                  <LineChart
                    data={graph.data.vaccinations}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="vaccinations"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Container>
      );
    else
      return (
        <Container maxWidth="xls">
          <div
            className="flex flex-col items-center justify-center space-y-4 my-2"
            style={{ minHeight: "85vh" }}
          >
            <div className="bg-red-700 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Death</h1>
              <p className="text-xl font-bold text-white">{death}</p>
            </div>
            <div className="bg-green-700 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Recovered</h1>
              <p className="text-xl font-bold text-white">{recovered}</p>
            </div>
            <div className="bg-purple-700 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Hospitalized</h1>
              <p className="text-xl font-bold text-white">{hospitalized}</p>
            </div>
            <div className="bg-blue-700 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Male</h1>
              <p className="text-xl font-bold text-white">{male}</p>
            </div>
            <div className="bg-pink-600 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Female</h1>
              <p className="text-xl font-bold text-white">{female}</p>
            </div>
            <div className="bg-green-500 rounded-md shadow-md px-2 py-2 text-center w-80 ">
              <h1 className="text-2xl font-bold text-white">Vaccinations</h1>
              <p className="text-xl font-bold text-white">{vaccinations}</p>
            </div>
          </div>
        </Container>
      );
  }
  if (!graph.loading && !graph.data)
    return (
      <div
        style={{ minHeight: "80vh" }}
        className="flex justify-center items-center"
      >
        <h1 className="text-3xl font-semibold text-white text-center">
          There was a problem loading this page!
        </h1>
      </div>
    );
}
