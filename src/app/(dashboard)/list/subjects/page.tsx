"use client"

import TableSearch from "@/components/TableSearch"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Table from "@/components/Table"
import { useSession } from "next-auth/react"
import FormModel from "@/components/FormModel"

type Subject = {
  id: string
  name: string
  teachers: {
    id: string
    name: string
  }[]
  _count: {
    lessons: number
    exams: number
  }
}

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "hidden md:table-cell",
  },
]

const SubjectsListPage = () => {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState("")

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = new URL("/api/subjects", window.location.origin)
      url.searchParams.set("page", currentPage.toString())
      url.searchParams.set("limit", "10")
      if (search) url.searchParams.set("search", search)

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch subjects")

      const data = await response.json()
      setSubjects(data.subjects || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [currentPage, search])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderRow = (item: Subject) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200"
    >
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">
        <p className="text-xs text-gray-500">
          {item.teachers.length > 0
            ? item.teachers.map((t) => t.name).join(", ")
            : "No teachers"}
        </p>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {session?.user.role === "ADMIN" && (
            <>
              <FormModel table="subject" type="delete" id={item.id} />
              <FormModel table="subject" type="update" data={item} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading subjects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchSubjects}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/*Top*/}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/filter.png" width={14} height={14} alt="Filter" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200">
              <Image src="/sort.png" width={14} height={14} alt="Sort" />
            </button>
            {session?.user.role === "ADMIN" && <FormModel table="subject" type="create" />}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={subjects} />
      
      {/* Pagination */}
      <div className="p-4 flex items-center justify-between text-gray-500">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="flex items-center gap-2 text-sm">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - currentPage) <= 1
              )
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span key={`ellipsis-${page}`}>...</span>
                )}
                <button
                  
                  onClick={() => handlePageChange(page)}
                  className={`px-2 rounded-sm ${
                    currentPage === page ? "bg-sky-200" : ""
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.totalPages}
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center mt-2">
        Showing {subjects.length} of {pagination.total} subjects (Page{" "}
        {currentPage} of {pagination.totalPages})
      </div>
    </div>
  )
}

export default SubjectsListPage
