"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import TableSearch from "@/components/TableSearch"
import Table from "@/components/Table"
import FormModel from "@/components/FormModel"

type Teacher = {
  id: string
  teacherId: string
  name: string
  phone: string
  address: string
  user: {
    email: string
  }
  subjects: { id: string; name: string }[]
  classes: { id: string; name: string }[]
  _count: {
    subjects: number
    classes: number
  }
}

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
]

const TeachersListPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [teachers, setTeachers] = useState<Teacher[]>([])
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
    fetchTeachers()
  }, [currentPage, searchQuery])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/teachers?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch teachers")
      }

      const data = await response.json()
      setTeachers(data.teachers)
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

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-indigo-50"
    >
      <td className="p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.user?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell px-4">{item.teacherId}</td>
      <td className="hidden md:table-cell px-4">
        {item.subjects?.length > 0
          ? item.subjects.map((s) => s.name).join(", ")
          : `${item._count?.subjects || 0} subjects`}
      </td>
      <td className="hidden md:table-cell px-4">
        {item.classes?.length > 0
          ? item.classes.map((c) => c.name).join(", ")
          : `${item._count?.classes || 0} classes`}
      </td>
      <td className="hidden lg:table-cell px-4">{item.phone || "-"}</td>
      <td className="hidden lg:table-cell px-4">{item.address || "-"}</td>
      <td className="px-4">
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-sky-200 hover:bg-sky-300 transition-colors min-w-[40px] sm:min-w-0">
              <Image src="/view.png" width={16} height={16} alt="View" />
            </button>
          </Link>
          <FormModel table="teacher" type="update" data={item} id={item.id} />
          <FormModel table="teacher" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  )

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading teachers...</p>
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
              onClick={fetchTeachers}
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
        <h1 className="text-lg sm:text-xl font-semibold">All Teachers</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 transition-colors min-w-[40px]">
              <Image src="/filter.png" width={16} height={16} alt="Filter" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 transition-colors min-w-[40px]">
              <Image src="/sort.png" width={16} height={16} alt="Sort" />
            </button>
            <FormModel table="teacher" type="create" />
          </div>
        </div>
      </div>

      {/* List */}
      {teachers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No teachers found. {searchQuery && "Try a different search."}
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={teachers} />
      )}

      {/* Pagination */}
      <div className="p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto py-2 sm:py-2 px-6 sm:px-4 rounded-md bg-slate-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors min-h-[44px] sm:min-h-0"
        >
          Prev
        </button>
        <div className="flex items-center gap-1 sm:gap-2 text-sm flex-wrap justify-center">
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
                  <span key={`ellipsis-${page}`} className="px-1">...</span>
                )}
                <button
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:px-3 sm:py-1 rounded-md transition-colors ${
                    currentPage === page ? "bg-sky-200 font-semibold" : "hover:bg-slate-100"
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
        Showing {teachers.length} of {pagination.total} teachers (Page{" "}
        {currentPage} of {pagination.totalPages})
      </div>
    </div>
  )
}

export default TeachersListPage
