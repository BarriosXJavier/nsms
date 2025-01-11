"use client";

import TableSearch from "@/components/TableSearch";
import React from "react";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role, parentsData } from "@/lib/data";
import FormModel from "@/components/FormModel";

type Parent = {
  id: number;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};
const columns = [
  {
    header: "info",
    accessor: "info",
  },
  {
    students: "Student Names",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    Phone: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    Address: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  {
    Actions: "Actions",
    accessor: "actions",
    className: "hidden md:table-cell",
  },
];

const renderRow = (item: Parent) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.students.join(",")}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModel table="parent" type="delete" id={item.id} />
            <FormModel table="parent" type="update" data={item} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ParentsListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/filter.png" width={14} height={14} alt="Filter" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/sort.png" width={14} height={14} alt="Sort" />
            </button>
            {role === "admin" && <FormModel table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={parentsData} />
      {/*Pagination*/}
      <Pagination />
    </div>
  );
};

export default ParentsListPage;
