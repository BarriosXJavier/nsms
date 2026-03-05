"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import TableSearch from "@/components/TableSearch"
import Table from "@/components/Table"
import FormModel from "@/components/FormModel"

type Lesson = {
  id: string
  name: string
  day: string
  startTime: string
  endTime: string
  subject: {
    id: string
    name: string
  }
  class: {
    id: string
    name: string
  }
  teacher: {
    id: string
    name: string
  }
}

const columns = [
  {
    header: "Lesson Name",
    accessor: "name",
  },
  {
    header: "Subject",
    accessor: "subject",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Day",
    accessor: "day",
    className: "hidden lg:table-cell",
  },
  {
    header: "Time",
    accessor: "time",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
]

const LessonsListPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const currentPage = parseInt(searchParams.get("page") || "1")
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    fetchLessons()
  }, [currentPage, searchQuery])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/lessons?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch lessons")
      }

      const data = await response.json()
      setLessons(data.lessons)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleSearch = (query: string) => {
    const params = new URLSearchParams()
    params.set("page", "1")
    if (query) params.set("search", query)
    router.push(`?${params.toString()}`)
  }

  const renderRow = (item: Lesson) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-indigo-50"
    >
      <td className="p-4 font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">{item.subject?.name}</td>
      <td>{item.class?.name}</td>
      <td className="hidden md:table-cell">{item.teacher?.name}</td>
      <td className="hidden lg:table-cell">
        {item.day.charAt(0) + item.day.slice(1).toLowerCase()}
      </td>
      <td className="hidden lg:table-cell">
        {item.startTime} - {item.endTime}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <FormModel table="lesson" type="update" data={item} id={item.id} />
          <FormModel table="lesson" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  )

  if (loading) {
    return (
      <div className="bg-white p-2 sm:p-4 rounded-md flex-1 m-2 sm:m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading lessons...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-2 sm:p-4 rounded-md flex-1 m-2 sm:m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchLessons}
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
    <div className="bg-white p-2 sm:p-4 rounded-md flex-1 m-2 sm:m-4 mt-0">
      {/* Top */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <h1 className="text-lg sm:text-xl font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 transition-colors min-w-[40px]">
              <Image src="/filter.png" width={14} height={14} alt="Filter" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 transition-colors min-w-[40px]">
              <Image src="/sort.png" width={14} height={14} alt="Sort" />
            </button>
            <FormModel table="lesson" type="create" />
          </div>
        </div>
      </div>

      {/* List */}
      {lessons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No lessons found. {searchQuery && "Try a different search."}
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={lessons} />
      )}

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between text-gray-500">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto py-2 sm:py-2 px-6 sm:px-4 rounded-md bg-slate-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors min-h-[44px] sm:min-h-0"
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
          className="w-full sm:w-auto py-2 sm:py-2 px-6 sm:px-4 rounded-md bg-slate-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors min-h-[44px] sm:min-h-0"
        >
          Next
        </button>
      </div>

      {/* Info */}
      <div className="text-xs sm:text-sm text-gray-500 text-center mt-2 px-2">
        Showing {lessons.length} of {pagination.total} lessons (Page{" "}
        {currentPage} of {pagination.totalPages})
      </div>
    </div>
  )
}

export default LessonsListPage
