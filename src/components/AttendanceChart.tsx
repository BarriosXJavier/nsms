"use client";

import Image from "next/image";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const data = [
  {
    day: "Mon",
    present: 670,
    absent: 1500,
  },
  {
    day: "Tue",
    present: 700,
    absent: 1989,
  },
  {
    day: "Wed",
    present: 2000,
    absent: 34,
  },
  {
    day: "Thu",
    present: 2780,
    absent: 3908,
  },
  {
    day: "Fri",
    present: 1890,
    amt: 2181,
  },
];

const AttendanceChart = () => {
  return (
    <div className="h-full bg-white rounded-lg">
      <div className="flex justify-between items-center p-4">
        <h1 className="font-semibold text-lg">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%"   >
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dddddd" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: "#d5d1db" }} />

          <Tooltip />
          <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
          <Bar
            dataKey="present"
            fill="#fae37c"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#c3ebfa"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div >
  );
};

export default AttendanceChart;
