"use client"

import TableSearch from '@/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, teachersData } from '@/lib/data'

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
}
const columns = [
  {
    header: "info", accessor: "info"
  },
  {
    teacher: "Teacher Id", accessor: "teacherId", className: "hidden md:table-cell"
  },
  {
    Subjects: "Subjects", accessor: "subjects", className: "hidden md:table-cell"
  },
  {
    Classes: "Classes", accessor: "classes", className: "hidden md:table-cell"
  },
  {
    Phone: "Phone", accessor: "phone", className: "hidden md:table-cell"
  },
  {
    Address: "Address", accessor: "address", className: "hidden md:table-cell"
  },
  {
    Actions: "Actions", accessor: "actions", className: "hidden md:table-cell"
  }

]

const renderRow = (item: Teacher) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200">
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.photo} width={40} height={40} alt="Teacher" className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
      <div className="flex flex-col">
        <h3 className="font-semibold">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.teacherId}</td>
    <td className="hidden md:table-cell">{item.classes.join(",")}</td>
    <td className="hidden md:table-cell">{item.subjects.join(",")}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-200">
            <Image src="/view.png" width={16} height={16} alt="" />
          </button>
        </Link>
        {role === "admin" && (
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-200">
            <Image src="/delete.png" width={16} height={16} alt="" />
          </button>
        )}
      </div>
    </td>
  </tr >
)


const TeachersListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/filter.png" width={14} height={14} alt="Filter" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/sort.png" width={14} height={14} alt="Sort" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/plus.png" width={14} height={14} alt="plus" /></button>
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={teachersData} />
      {/*Pagination*/}
      <Pagination />
    </div>
  )
}

export default TeachersListPage
