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
  const size = type === "create" ? "w-10 h-10 sm:w-9 sm:h-9" : "w-10 h-10 sm:w-8 sm:h-8"
  const bgColor = type === "create" ? "bg-blue-200 hover:bg-blue-300" : type === "update" ? "bg-sky-300 hover:bg-sky-400" : "bg-indigo-300 hover:bg-indigo-400"

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
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <span className="text-center font-medium text-sm sm:text-base">
            All data will be lost! Are you sure you want to delete this {table}?
          </span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-400 hover:bg-red-500 text-white py-3 sm:py-2 px-6 sm:px-4 rounded-md border-none w-full sm:w-max self-center disabled:bg-gray-300 min-h-[44px] sm:min-h-0 transition-colors"
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
      <button 
        onClick={() => setOpen(true)} 
        className={`${size} flex items-center justify-center rounded-full ${bgColor} transition-colors min-w-[40px] sm:min-w-0`}
        aria-label={`${type} ${table}`}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && <div className="w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 sm:p-6 rounded-md relative w-full sm:w-[95%] md:w-[85%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <Form />
          <button 
            className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center" 
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <Image src="/close.png" alt="" width={16} height={16} />
          </button>
        </div>
      </div>}
    </>
  )
}

export default FormModel
