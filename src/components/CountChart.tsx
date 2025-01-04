"use client";

import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const data = [
  {
    name: "Boys",
    count: 800,
    fill: "white",
  },
  {
    name: "Girls",
    count: 468,
    fill: "#fae37c",
  },
  {
    name: "Total",
    count: 1268,
    fill: "#c3ebfa",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/*Title */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className=""></div>
      {/*Chart*/}
      <div className="w-full h-[75%] relative">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex-col gap-1">
          <div className="w-5 h-5 bg-blue-300 rounded-full" />
          <h1 className="font-bold">2304</h1>
          <h2 className="text-xs text-gray-500">Boys (62%)</h2>
        </div>
        <div>
          <div className="flex-col gap-1">
            <div className="w-5 h-5 bg-yellow-300 rounded-full" />
            <h1 className="font-bold">978</h1>
            <h2 className="text-xs text-gray-500">Girls (38%)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
