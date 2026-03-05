"use client"

import Image from "next/image"
import { useState } from "react"

import TeacherForm from "./Forms/TeacherForm"
import StudentForm from "./Forms/StudentForm"
import LessonForm from "./Forms/LessonForm"
import ParentForm from "./Forms/ParentForm"
import SubjectForm from "./Forms/SubjectForm"
import ClassForm from "./Forms/ClassForm"
import ExamForm from "./Forms/ExamForm"
import AssignmentForm from "./Forms/AssignmentForm"
import ResultForm from "./Forms/ResultForm"
import EventForm from "./Forms/EventForm"
import AnnouncementForm from "./Forms/AnnouncementForm"

const FormModel = ({ table, type, data, id }: {
  table:
  "teacher" |
  "student" |
  "parent" |
  "subject" |
  "class" |
  "lesson" |
  "exam" |
  "assignment" |
  "result" |
  "attendance" |
  "event" |
  "announcement"
  type: "create" | "update" | "delete"
  data?: any
  id?: any

}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7"
  const bgColor = type === "create" ? "bg-yellow-200" : type === "update" ? "bg-sky-300" : "bg-purple-300"

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/${table}s/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to delete ${table}`)
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <div className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost! Are you sure you want to delete this {table}?
          </span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-400 text-white py-2 px-4 rounded-md border-none w-max self-center disabled:bg-gray-300"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )
    }

    // Render appropriate form based on table
    switch (table) {
      case "teacher":
        return <TeacherForm type={type as "create" | "update"} data={data} />
      case "student":
        return <StudentForm type={type as "create" | "update"} data={data} />
      case "parent":
        return <ParentForm type={type as "create" | "update"} data={data} />
      case "subject":
        return <SubjectForm type={type as "create" | "update"} data={data} />
      case "lesson":
        return <LessonForm type={type as "create" | "update"} data={data} />
      case "class":
        return <ClassForm type={type as "create" | "update"} data={data} />
      case "exam":
        return <ExamForm type={type as "create" | "update"} data={data} />
      case "assignment":
        return <AssignmentForm type={type as "create" | "update"} data={data} />
      case "result":
        return <ResultForm type={type as "create" | "update"} data={data} />
      case "event":
        return <EventForm type={type as "create" | "update"} data={data} />
      case "announcement":
        return <AnnouncementForm type={type as "create" | "update"} data={data} />
      default:
        return <div className="p-4">Form for {table} not implemented yet</div>
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${size} flex items-center justify-center rounded-full ${bgColor}`}>
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
          <Form />
          <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
            <Image src="/close.png" alt="" width={14} height={14} />
          </div>
        </div>
      </div>}
    </>
  )
}

export default FormModel
