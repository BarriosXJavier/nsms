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

  if (loading) return <div className="p-4">Loading...</div>
  if (error || !student) return <div className="p-4 text-red-500">{error || "Student not found"}</div>

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full xl:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-sky-200 py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3 ">
              <Image
                src="/avatar.png"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover" />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{student.name}</h1>
              <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-sm font-medium">
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span className="">{student.bloodType || "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span className="">{student.birthday ? new Date(student.birthday).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span className="">{student.email}</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span className="">{student.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 gap-4 justify-between flex-wrap">
            {/*Card*/}
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/branches.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">{student.grade?.level || "N/A"}</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class?.name || "N/A"}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/*Bottom*/}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/*RIGHT*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-4 ">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold ">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href={`/list/lessons?classId=${student.class?.name}`} className="p-3 rounded-md bg-sky-200">Student&apos;s Lessons</Link>
            <Link href={`/list/exams?classId=${student.class?.name}`} className="p-3 rounded-md bg-pink-200">Student&apos;s Exams</Link>
            <Link href={`/list/assignments?classId=${student.class?.name}`} className="p-3 rounded-md bg-sky-300">Student&apos;s Assignments</Link>
            <Link href={`/list/results?studentId=${student.studentId}`} className="p-3 rounded-md bg-purple-200">Student&apos;s Results</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default SingleStudentPage
