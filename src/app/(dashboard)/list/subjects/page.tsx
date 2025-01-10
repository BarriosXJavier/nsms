"use client"

import TableSearch from '@/components/TableSearch'
import React from 'react'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, subjectsData } from '@/lib/data'
import FormModel from '@/components/FormModel'

type Subject = {
  id: number;
  name: string;
  teachers: string[];
}
const columns = [
  {
    header: "Subject Name", accessor: "name"
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell"
  },
  {
    Actions: "Actions", accessor: "actions", className: "hidden md:table-cell"
  }

]

const renderRow = (item: Subject) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200">
    <td className="flex items-center gap-4 p-4">
      {item.name}
    </td>
    <td>
      <p className="text-xs text-gray-500">{item.teachers.join(",")}</p>
    </td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`list/subjects/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-200">
            <Image src="/edit.png" width={16} height={16} alt="" />
          </button>
        </Link>
        {role === "admin" && (
          <>
            <FormModel table="subject" type="delete" id={item.id} />
            <FormModel table="subject" type="update" data={item} />
          </>
        )}
      </div>
    </td>
  </tr >
)


const SubjectsListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/filter.png" width={14} height={14} alt="Filter" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200"><Image src="/sort.png" width={14} height={14} alt="Sort" /></button>
            {role === "admin" && (
              <FormModel table="subject" type="create" />
            )}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={subjectsData} />
      {/*Pagination*/}
      <Pagination />
    </div>
  )
}

export default SubjectsListPage

