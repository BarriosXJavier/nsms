"use client"

import TableSearch from "@/components/TableSearch"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Table from "@/components/Table"
import { useSession } from "next-auth/react"
import FormModel from "@/components/FormModel"

type Parent = {
  id: string
  name: string
  phone: string | null
  address: string | null
  user: {
    email: string
    image: string | null
  }
  students: {
    id: string
    name: string
    studentId: string
    class: {
      name: string
    } | null
  }[]
}

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Students",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
    className: "hidden md:table-cell",
  },
]

const ParentsListPage = () => {
  const { data: session } = useSession()
  const [parents, setParents] = useState<Parent[]>([])
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

  const fetchParents = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = new URL("/api/parents", window.location.origin)
      url.searchParams.set("page", currentPage.toString())
      url.searchParams.set("limit", "10")
      if (search) url.searchParams.set("search", search)

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error("Failed to fetch parents")

      const data = await response.json()
      setParents(data.parents || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParents()
  }, [currentPage, search])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderRow = (item: Parent) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-300 text-sm bg-purple-200"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.user.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.students.map((s) => s.name).join(", ") || "No students"}
      </td>
      <td className="hidden md:table-cell">{item.phone || "N/A"}</td>
      <td className="hidden md:table-cell">{item.address || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2">
          {session?.user.role === "ADMIN" && (
            <>
              <FormModel table="parent" type="delete" id={item.id} />
              <FormModel table="parent" type="update" data={item} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  if (loading) {
    return (
      <div className="bg-white p-2 sm:p-4 rounded-md flex-1 m-2 sm:m-4 mt-0">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading parents...</p>
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
              onClick={fetchParents}
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
      {/*Top*/}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <h1 className="text-lg sm:text-xl font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-yellow-200 hover:bg-yellow-300 transition-colors min-w-[40px]">
              <Image src="/filter.png" width={14} height={14} alt="Filter" />
            </button>
            <button className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-yellow-200 hover:bg-yellow-300 transition-colors min-w-[40px]">
              <Image src="/sort.png" width={14} height={14} alt="Sort" />
            </button>
            {session?.user.role === "ADMIN" && <FormModel table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/*List*/}
      <Table columns={columns} renderRow={renderRow} data={parents} />
      
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
        Showing {parents.length} of {pagination.total} parents (Page{" "}
        {currentPage} of {pagination.totalPages})
      </div>
    </div>
  )
}

export default ParentsListPage
