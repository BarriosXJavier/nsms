"use client"

import TableSearch from '@/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, examsData } from '@/lib/data'
import FormModel from '@/components/FormModel'

type Exam = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
}
const columns = [
  {
    header: "Subject Name",
    accessor: "name"
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
  },
  {
    header: "Date",
    accessor: "date",
  },
  {
    Actions: "Actions",
    accessor: "actions",
    className: "hidden md:table-cell"
  }

]


const ExamsListPage = () => {
  const renderRow = (item: Exam) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200">
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td className="">{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`list/exams/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-200">
              <Image src="/edit.png" width={16} height={16} alt="" />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModel table="exam" type="delete" id={item.id} />
              <FormModel table="exam" type="update" data={item} />
            </>
          )}
        </div>
      </td>
    </tr >
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/filter.png" width={14} height={14} alt="Filter" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/sort.png" width={14} height={14} alt="Sort" /></button>
            {role === "admin" && (
              <FormModel table="exam" type="create" />
            )}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={examsData} />
      {/*Pagination*/}
      <Pagination />
    </div>
  )
}

export default ExamsListPage
