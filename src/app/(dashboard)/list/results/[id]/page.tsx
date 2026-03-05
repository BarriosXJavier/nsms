"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Result = {
  id: string
  score: number
  type: "EXAM" | "ASSIGNMENT"
  student: {
    id: string
    name: string
    studentId: string
  } | null
  subject: {
    id: string
    name: string
  } | null
  teacher: {
    id: string
    name: string
  } | null
  exam: {
    title: string
    date: string
  } | null
  assignment: {
    title: string
    dueDate: string
  } | null
}

const SingleResultPage = () => {
  const params = useParams()
  const id = params.id as string
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/results/${id}`)
        if (!res.ok) throw new Error("Failed to fetch result")
        const data = await res.json()
        setResult(data)
      } catch (err) {
        setError("Failed to load result data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchResult()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !result) return <div className="p-4 text-red-500 text-center">{error || "Result not found"}</div>

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: "A", color: "text-green-600" }
    if (score >= 80) return { letter: "B", color: "text-blue-600" }
    if (score >= 70) return { letter: "C", color: "text-yellow-600" }
    if (score >= 60) return { letter: "D", color: "text-orange-600" }
    return { letter: "F", color: "text-red-600" }
  }

  const grade = getGrade(result.score)

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-green-200 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-2">
                    {result.type === "EXAM" ? result.exam?.title : result.assignment?.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {result.subject?.name || "No subject"}
                  </p>
                </div>
                <div className="text-xs sm:text-sm bg-white px-3 py-1 rounded-full">
                  {result.type}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/avatar.png" alt="" width={16} height={16} />
                  <span className="font-medium">Student:</span>
                  {result.student ? (
                    <Link 
                      href={`/list/students/${result.student.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {result.student.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Subject:</span>
                  <span>{result.subject?.name || "Not assigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/avatar.png" alt="" width={16} height={16} />
                  <span className="font-medium">Teacher:</span>
                  {result.teacher ? (
                    <Link 
                      href={`/list/teachers/${result.teacher.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {result.teacher.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Date:</span>
                  <span>
                    {result.type === "EXAM" && result.exam
                      ? new Date(result.exam.date).toLocaleDateString()
                      : result.assignment
                      ? new Date(result.assignment.dueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/singleClass.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Score</span>
              </div>
              <p className="font-semibold text-2xl">{result.score}%</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/singleClass.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Grade</span>
              </div>
              <p className={`font-semibold text-2xl ${grade.color}`}>{grade.letter}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/singleClass.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Type</span>
              </div>
              <p className="font-semibold text-sm">{result.type}</p>
            </div>
          </div>
        </div>

        {/*Bottom - Performance Analysis*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Performance Analysis</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Score Percentage</span>
              <span className="font-medium">{result.score}%</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Letter Grade</span>
              <span className={`font-medium ${grade.color}`}>{grade.letter}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Performance Level</span>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      result.score >= 90 ? "bg-green-500" :
                      result.score >= 80 ? "bg-blue-500" :
                      result.score >= 70 ? "bg-yellow-500" :
                      result.score >= 60 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Quick Actions</h1>
          <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            {result.student && (
              <Link 
                href={`/list/students/${result.student.id}`} 
                className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
              >
                View Student
              </Link>
            )}
            {result.teacher && (
              <Link 
                href={`/list/teachers/${result.teacher.id}`} 
                className="p-2 sm:p-3 rounded-md bg-purple-200 hover:bg-purple-300 transition-colors"
              >
                View Teacher
              </Link>
            )}
            {result.student && (
              <Link 
                href={`/list/results?studentId=${result.student.id}`} 
                className="p-2 sm:p-3 rounded-md bg-green-200 hover:bg-green-300 transition-colors"
              >
                Student Results
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Student Information</h1>
          {result.student ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image src="/avatar.png" alt="" width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-medium text-sm">{result.student.name}</p>
                  <p className="text-xs text-gray-500">ID: {result.student.studentId}</p>
                </div>
              </div>
              <Link
                href={`/list/students/${result.student.id}`}
                className="block w-full text-center p-2 mt-3 bg-sky-200 hover:bg-sky-300 rounded-md text-sm transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No student assigned</p>
          )}
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">{result.type} Details</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Title</p>
              <p className="font-medium">
                {result.type === "EXAM" ? result.exam?.title : result.assignment?.title}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Subject</p>
              <p className="font-medium">{result.subject?.name || "Not assigned"}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p className="font-medium">
                {result.type === "EXAM" && result.exam
                  ? new Date(result.exam.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : result.assignment
                  ? new Date(result.assignment.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Teacher</p>
              {result.teacher ? (
                <Link 
                  href={`/list/teachers/${result.teacher.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {result.teacher.name}
                </Link>
              ) : (
                <p className="font-medium text-gray-500">Not assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Grade Scale</h1>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-md bg-green-50">
              <span>A (Excellent)</span>
              <span className="font-medium">90-100%</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-blue-50">
              <span>B (Good)</span>
              <span className="font-medium">80-89%</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-yellow-50">
              <span>C (Average)</span>
              <span className="font-medium">70-79%</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-orange-50">
              <span>D (Below Average)</span>
              <span className="font-medium">60-69%</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-red-50">
              <span>F (Fail)</span>
              <span className="font-medium">0-59%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleResultPage
