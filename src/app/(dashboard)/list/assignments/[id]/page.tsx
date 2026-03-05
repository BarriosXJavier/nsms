"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Assignment = {
  id: string
  title: string
  dueDate: string
  subject: {
    id: string
    name: string
  } | null
  class: {
    id: string
    name: string
  } | null
  teacher: {
    id: string
    name: string
  } | null
  _count: {
    results: number
  }
}

const SingleAssignmentPage = () => {
  const params = useParams()
  const id = params.id as string
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/assignments/${id}`)
        if (!res.ok) throw new Error("Failed to fetch assignment")
        const data = await res.json()
        setAssignment(data)
      } catch (err) {
        setError("Failed to load assignment data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAssignment()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !assignment) return <div className="p-4 text-red-500 text-center">{error || "Assignment not found"}</div>

  const dueDate = new Date(assignment.dueDate)
  const isOverdue = dueDate < new Date()

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-amber-100 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-2">{assignment.title}</h1>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {assignment.subject?.name || "No subject"}
                  </p>
                </div>
                <div className={`text-xs sm:text-sm px-3 py-1 rounded-full ${
                  isOverdue ? "bg-red-500 text-white" : "bg-white"
                }`}>
                  {isOverdue ? "Overdue" : "Active"}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Due Date:</span>
                  <span className={isOverdue ? "text-red-700 font-semibold" : ""}>
                    {dueDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Due Time:</span>
                  <span>{dueDate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Class:</span>
                  {assignment.class ? (
                    <Link 
                      href={`/list/classes/${assignment.class.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {assignment.class.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/avatar.png" alt="" width={16} height={16} />
                  <span className="font-medium">Teacher:</span>
                  {assignment.teacher ? (
                    <Link 
                      href={`/list/teachers/${assignment.teacher.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {assignment.teacher.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/singleClass.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Submissions</span>
              </div>
              <p className="font-semibold text-lg">{assignment._count.results}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Status</span>
              </div>
              <p className={`font-semibold text-sm ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                {isOverdue ? "Overdue" : "Open"}
              </p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Days Left</span>
              </div>
              <p className="font-semibold text-lg">
                {isOverdue ? "0" : Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
          </div>
        </div>

        {/*Bottom - Assignment Details*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Assignment Details</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Subject</span>
              <span className="font-medium">{assignment.subject?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Class</span>
              <span className="font-medium">{assignment.class?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Total Submissions</span>
              <span className="font-medium">{assignment._count.results}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Due Date</span>
              <span className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                {dueDate.toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Quick Actions</h1>
          <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            {assignment.class && (
              <Link 
                href={`/list/classes/${assignment.class.id}`} 
                className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
              >
                View Class
              </Link>
            )}
            {assignment.teacher && (
              <Link 
                href={`/list/teachers/${assignment.teacher.id}`} 
                className="p-2 sm:p-3 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
              >
                View Teacher
              </Link>
            )}
            <Link 
              href={`/list/results?assignmentId=${assignment.id}`} 
              className="p-2 sm:p-3 rounded-md bg-emerald-100 hover:bg-emerald-200 transition-colors"
            >
              View Submissions
            </Link>
            {assignment.class && (
              <Link 
                href={`/list/students?classId=${assignment.class.id}`} 
                className="p-2 sm:p-3 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                View Students
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Assignment Info</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Subject</p>
              <p className="font-medium">{assignment.subject?.name || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Class</p>
              {assignment.class ? (
                <Link 
                  href={`/list/classes/${assignment.class.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {assignment.class.name}
                </Link>
              ) : (
                <p className="font-medium text-gray-500">Not assigned</p>
              )}
            </div>
            <div>
              <p className="text-gray-600 mb-1">Teacher</p>
              {assignment.teacher ? (
                <Link 
                  href={`/list/teachers/${assignment.teacher.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {assignment.teacher.name}
                </Link>
              ) : (
                <p className="font-medium text-gray-500">Not assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Submission Stats</h1>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Submissions</span>
              <span className="font-semibold text-lg">{assignment._count.results}</span>
            </div>
            <div className="p-3 bg-yellow-50 rounded-md">
              <p className="text-xs text-gray-600 mb-1">Due Date</p>
              <p className="font-medium text-sm">
                {dueDate.toLocaleDateString("en-US", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                at {dueDate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleAssignmentPage
