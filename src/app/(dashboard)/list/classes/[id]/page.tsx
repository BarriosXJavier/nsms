"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Class = {
  id: string
  name: string
  capacity: number
  grade: number
  supervisor: {
    id: string
    name: string
    teacherId: string
  } | null
  _count: {
    students: number
  }
}

const SingleClassPage = () => {
  const params = useParams()
  const id = params.id as string
  const [classData, setClassData] = useState<Class | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/classes/${id}`)
        if (!res.ok) throw new Error("Failed to fetch class")
        const data = await res.json()
        setClassData(data)
      } catch (err) {
        setError("Failed to load class data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchClass()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !classData) return <div className="p-4 text-red-500 text-center">{error || "Class not found"}</div>

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-sky-200 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-semibold">{classData.name}</h1>
                <div className="text-xs sm:text-sm bg-white px-3 py-1 rounded-full">
                  Grade {classData.grade}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Capacity:</span>
                  <span>{classData.capacity} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Enrolled:</span>
                  <span>{classData._count.students} students</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Supervisor:</span>
                  {classData.supervisor ? (
                    <Link 
                      href={`/list/teachers/${classData.supervisor.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {classData.supervisor.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-md flex gap-3 sm:gap-4">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">{classData._count.students}</h1>
                <span className="text-xs sm:text-sm text-gray-400">Students</span>
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md flex gap-3 sm:gap-4">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">{classData.capacity}</h1>
                <span className="text-xs sm:text-sm text-gray-400">Capacity</span>
              </div>
            </div>
          </div>
        </div>

        {/*Bottom - Class Schedule*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Class Information</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Grade Level</span>
              <span className="font-medium">Grade {classData.grade}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Available Seats</span>
              <span className="font-medium">{classData.capacity - classData._count.students}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Utilization</span>
              <span className="font-medium">
                {Math.round((classData._count.students / classData.capacity) * 100)}%
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
            <Link 
              href={`/list/students?classId=${classData.id}`} 
              className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
            >
              View Students
            </Link>
            <Link 
              href={`/list/lessons?classId=${classData.id}`} 
              className="p-2 sm:p-3 rounded-md bg-purple-200 hover:bg-purple-300 transition-colors"
            >
              Class Schedule
            </Link>
            <Link 
              href={`/list/exams?classId=${classData.id}`} 
              className="p-2 sm:p-3 rounded-md bg-pink-200 hover:bg-pink-300 transition-colors"
            >
              Exams
            </Link>
            <Link 
              href={`/list/assignments?classId=${classData.id}`} 
              className="p-2 sm:p-3 rounded-md bg-yellow-200 hover:bg-yellow-300 transition-colors"
            >
              Assignments
            </Link>
            <Link 
              href={`/list/events?classId=${classData.id}`} 
              className="p-2 sm:p-3 rounded-md bg-green-200 hover:bg-green-300 transition-colors"
            >
              Events
            </Link>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Class Statistics</h1>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Students</span>
              <span className="font-semibold text-lg">{classData._count.students}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${(classData._count.students / classData.capacity) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0 students</span>
              <span>{classData.capacity} capacity</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Supervisor Info</h1>
          {classData.supervisor ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image src="/avatar.png" alt="" width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-medium text-sm">{classData.supervisor.name}</p>
                  <p className="text-xs text-gray-500">ID: {classData.supervisor.teacherId}</p>
                </div>
              </div>
              <Link
                href={`/list/teachers/${classData.supervisor.id}`}
                className="block w-full text-center p-2 mt-3 bg-sky-200 hover:bg-sky-300 rounded-md text-sm transition-colors"
              >
                View Profile
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No supervisor assigned</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleClassPage
