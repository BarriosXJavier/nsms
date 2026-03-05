"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const subjectSchema = z.object({
  name: z.string().min(1, { message: "Subject name is required" }),
  teacherIds: z.array(z.string()).optional(),
})

const updateSubjectSchema = subjectSchema.partial()

type Teacher = {
  id: string
  name: string
  teacherId: string
}

const SubjectForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    teacherIds: data?.teachers?.map((t: any) => t.id) || [],
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loadingTeachers, setLoadingTeachers] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("/api/teachers?limit=100")
        if (response.ok) {
          const result = await response.json()
          setTeachers(result.teachers || [])
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
      } finally {
        setLoadingTeachers(false)
      }
    }
    fetchTeachers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const schema = type === "create" ? subjectSchema : updateSubjectSchema
      const validatedData = schema.parse(formData)

      const url = type === "create" ? "/api/subjects" : `/api/subjects/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save subject")
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

  const handleTeacherSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((option) => option.value)
    setFormData({ ...formData, teacherIds: selected })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Subject" : "Update Subject"}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Subject Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., Mathematics"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Assign Teachers</label>
        {loadingTeachers ? (
          <p className="text-xs text-gray-400">Loading teachers...</p>
        ) : (
          <>
            <select
              multiple
              value={formData.teacherIds}
              onChange={handleTeacherSelection}
              className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
              size={6}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.teacherId})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400">
              Hold Ctrl/Cmd to select multiple teachers
            </p>
          </>
        )}
        {errors.teacherIds && <span className="text-xs text-red-500">{errors.teacherIds}</span>}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  )
}

export default SubjectForm
