"use client"

import Announcements from "@/components/Announcements"
import BigCalendar from "@/components/BigCalendar"
import Performance from "@/components/Performance"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Student = {
  id: string
  studentId: string
  name: string
  email: string
  phone: string | null
  address: string | null
  bloodType: string | null
  birthday: string | null
  class: { name: string } | null
  grade: { level: number } | null
  parents: { name: string }[]
}

const SingleStudentPage = () => {
  const params = useParams()
  const id = params.id as string
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/students/${id}`)
        if (!res.ok) throw new Error("Failed to fetch student")
        const data = await res.json()
        setStudent(data)
      } catch (err) {
        setError("Failed to load student data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchStudent()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !student) return <div className="p-4 text-red-500 text-center">{error || "Student not found"}</div>

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-sky-200 py-4 sm:py-6 px-3 sm:px-4 rounded-md flex flex-col sm:flex-row gap-4">
            <div className="flex justify-center sm:w-1/3">
              <Image
                src="/avatar.png"
                alt=""
                width={144}
                height={144}
                className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl font-semibold text-center sm:text-left">{student.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">Student ID: {student.studentId}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span className="text-xs">{student.birthday ? new Date(student.birthday).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span className="text-xs truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span className="text-xs">{student.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/*Cards*/}
            <div className="bg-white p-3 sm:p-4 rounded-md flex gap-3 sm:gap-4">
              <Image src="/branches.png" alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">{student.grade?.level || "N/A"}</h1>
                <span className="text-xs sm:text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md flex gap-3 sm:gap-4">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold truncate">{student.class?.name || "N/A"}</h1>
                <span className="text-xs sm:text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/*Bottom*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4 h-[500px] sm:h-[700px] lg:h-[800px]">
          <h1 className="text-base sm:text-lg mb-2">Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/*RIGHT*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Shortcuts</h1>
          <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-gray-500">
            <Link href={`/list/lessons?classId=${student.class?.name}`} className="p-2 sm:p-3 rounded-md bg-sky-200 hover:bg-sky-300 transition-colors">Student&apos;s Lessons</Link>
            <Link href={`/list/exams?classId=${student.class?.name}`} className="p-2 sm:p-3 rounded-md bg-rose-100 hover:bg-rose-200 transition-colors">Student&apos;s Exams</Link>
            <Link href={`/list/assignments?classId=${student.class?.name}`} className="p-2 sm:p-3 rounded-md bg-sky-300 hover:bg-sky-400 transition-colors">Student&apos;s Assignments</Link>
            <Link href={`/list/results?studentId=${student.studentId}`} className="p-2 sm:p-3 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors">Student&apos;s Results</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default SingleStudentPage
