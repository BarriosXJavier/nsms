"use client"

import TableSearch from '@/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, studentsData } from '@/lib/data'
import FormModel from '@/components/FormModel'

type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  class: string;
  phone?: string;
  grade: number;
  address: string;
}
const columns = [
  {
    header: "info",
    accessor: "info"
  },
  {
    student: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell"
  },
  {
    subjects: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell"
  },
  {
    Classes: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell"
  },
  {
    Phone: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell"
  },
  {
    Address: "Address",
    accessor: "address",
    className: "hidden md:table-cell"
  },
  {
    Actions: "Actions",
    accessor: "actions",
    className: "hidden md:table-cell"
  }

]

const renderRow = (item: Student) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200">
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.photo} width={40} height={40} alt="Student" className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
      <div className="flex flex-col">
        <h3 className="font-semibold">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500">{item?.class}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.studentId}</td>
    <td className="hidden md:table-cell">{item.class}</td>
    <td className="hidden md:table-cell">{item.grade}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-200">
            <Image src="/view.png" width={16} height={16} alt="" />
          </button>
        </Link>
        {role === "admin" && (
          <FormModel table="student" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr >
)


const StudentsListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/filter.png" width={14} height={14} alt="Filter" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/sort.png" width={14} height={14} alt="Sort" /></button>
            {role === "admin" && (
              <FormModel table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={studentsData} />
      {/*Pagination*/}
      <Pagination />
    </div>
  )
}

export default StudentsListPage

