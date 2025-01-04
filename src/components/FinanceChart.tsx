"use client"

import Image from 'next/image'
import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    month: 'Jan',
    income: 4000,
    expense: 2400,
    amt: 2400,
  },
  {
    month: 'Feb',
    income: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    month: 'Mar',
    income: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    month: 'Apr',
    income: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    month: 'May',
    income: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    month: 'June',
    income: 2390,
    expense: 3800,
    amt: 2500,
  },
  {
    month: 'July',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: 'Aug',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: 'Sep',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: 'Oct',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: 'Nov',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    month: 'Dec',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/*Title*/}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
          <XAxis dataKey="month" tickMargin={10} />
          <YAxis axisLine={false} tick={{ fill: "#d5d1db" }} tickLine={false} tickMargin={10} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expense" stroke="#8884d8" strokeWidth={5} />
          <Line type="monotone" dataKey="income" stroke=" #ffc0cb" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div >
  )
}

export default FinanceChart
