"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Exam = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
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
}

const SingleExamPage = () => {
  const params = useParams()
  const id = params.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/exams/${id}`)
        if (!res.ok) throw new Error("Failed to fetch exam")
        const data = await res.json()
        setExam(data)
      } catch (err) {
        setError("Failed to load exam data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchExam()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !exam) return <div className="p-4 text-red-500 text-center">{error || "Exam not found"}</div>

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-100 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-2">{exam.title}</h1>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {exam.subject?.name || "No subject"}
                  </p>
                </div>
                <div className="text-xs sm:text-sm bg-white px-3 py-1 rounded-full">
                  Exam
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Date:</span>
                  <span>{new Date(exam.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Time:</span>
                  <span>{exam.startTime} - {exam.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Class:</span>
                  {exam.class ? (
                    <Link 
                      href={`/list/classes/${exam.class.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {exam.class.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/avatar.png" alt="" width={16} height={16} />
                  <span className="font-medium">Teacher:</span>
                  {exam.teacher ? (
                    <Link 
                      href={`/list/teachers/${exam.teacher.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {exam.teacher.name}
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
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Date</span>
              </div>
              <p className="font-semibold text-sm">
                {new Date(exam.date).toLocaleDateString("en-US", { 
                  weekday: "short", 
                  month: "short", 
                  day: "numeric" 
                })}
              </p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Start Time</span>
              </div>
              <p className="font-semibold text-sm">{exam.startTime}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">End Time</span>
              </div>
              <p className="font-semibold text-sm">{exam.endTime}</p>
            </div>
          </div>
        </div>

        {/*Bottom - Exam Details*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Exam Details</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Subject</span>
              <span className="font-medium">{exam.subject?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">
                {exam.startTime} - {exam.endTime}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Status</span>
              <span className="font-medium">
                {new Date(exam.date) > new Date() ? (
                  <span className="text-blue-600">Upcoming</span>
                ) : (
                  <span className="text-gray-600">Completed</span>
                )}
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
            {exam.class && (
              <Link 
                href={`/list/classes/${exam.class.id}`} 
                className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
              >
                View Class
              </Link>
            )}
            {exam.teacher && (
              <Link 
                href={`/list/teachers/${exam.teacher.id}`} 
                className="p-2 sm:p-3 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
              >
                View Teacher
              </Link>
            )}
            {exam.class && (
              <Link 
                href={`/list/results?examId=${exam.id}`} 
                className="p-2 sm:p-3 rounded-md bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                View Results
              </Link>
            )}
            {exam.class && (
              <Link 
                href={`/list/students?classId=${exam.class.id}`} 
                className="p-2 sm:p-3 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                View Students
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Exam Information</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Subject</p>
              <p className="font-medium">{exam.subject?.name || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Class</p>
              {exam.class ? (
                <Link 
                  href={`/list/classes/${exam.class.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {exam.class.name}
                </Link>
              ) : (
                <p className="font-medium text-gray-500">Not assigned</p>
              )}
            </div>
            <div>
              <p className="text-gray-600 mb-1">Teacher</p>
              {exam.teacher ? (
                <Link 
                  href={`/list/teachers/${exam.teacher.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {exam.teacher.name}
                </Link>
              ) : (
                <p className="font-medium text-gray-500">Not assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Schedule</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-md">
              <Image src="/date.png" alt="" width={24} height={24} />
              <div>
                <p className="text-xs text-gray-600">Exam Date</p>
                <p className="font-medium text-sm">
                  {new Date(exam.date).toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-md">
              <Image src="/date.png" alt="" width={24} height={24} />
              <div>
                <p className="text-xs text-gray-600">Time Slot</p>
                <p className="font-medium text-sm">{exam.startTime} - {exam.endTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleExamPage
