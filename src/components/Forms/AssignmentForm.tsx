"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const assignmentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  subjectId: z.string().min(1, { message: "Subject is required" }),
  classId: z.string().min(1, { message: "Class is required" }),
  teacherId: z.string().min(1, { message: "Teacher is required" }),
})

const updateAssignmentSchema = assignmentSchema.partial()

type Subject = {
  id: string
  name: string
}

type Class = {
  id: string
  name: string
}

type Teacher = {
  id: string
  name: string
  teacherId: string
}

const AssignmentForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    title: data?.title || "",
    dueDate: data?.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
    subjectId: data?.subject?.id || "",
    classId: data?.class?.id || "",
    teacherId: data?.teacher?.id || "",
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, classesRes, teachersRes] = await Promise.all([
          fetch("/api/subjects?limit=100"),
          fetch("/api/classes?limit=100"),
          fetch("/api/teachers?limit=100"),
        ])

        if (subjectsRes.ok) {
          const result = await subjectsRes.json()
          setSubjects(result.subjects || [])
        }
        if (classesRes.ok) {
          const result = await classesRes.json()
          setClasses(result.classes || [])
        }
        if (teachersRes.ok) {
          const result = await teachersRes.json()
          setTeachers(result.teachers || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const submitData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      }

      const schema = type === "create" ? assignmentSchema : updateAssignmentSchema
      const validatedData = schema.parse(submitData)

      const url = type === "create" ? "/api/assignments" : `/api/assignments/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save assignment")
      }

      window.location.reload()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        alert(error instanceof Error ? error.message : "An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Assignment" : "Update Assignment"}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Assignment Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., Chapter 5 Homework"
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Due Date *</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
        />
        {errors.dueDate && <span className="text-xs text-red-500">{errors.dueDate}</span>}
      </div>

      {loadingData ? (
        <p className="text-xs text-gray-400">Loading options...</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Subject *</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subjectId && <span className="text-xs text-red-500">{errors.subjectId}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Class *</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors.classId && <span className="text-xs text-red-500">{errors.classId}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Teacher *</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.teacherId})
                </option>
              ))}
            </select>
            {errors.teacherId && <span className="text-xs text-red-500">{errors.teacherId}</span>}
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading || loadingData}
      >
        {loading ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  )
}

export default AssignmentForm