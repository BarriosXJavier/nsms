"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const classSchema = z.object({
  name: z.string().min(1, { message: "Class name is required" }),
  capacity: z.number().int().min(1, { message: "Capacity must be at least 1" }),
  grade: z.number().int().min(1).max(12, { message: "Grade must be between 1 and 12" }),
  supervisorId: z.string().optional(),
})

const updateClassSchema = classSchema.partial()

type Teacher = {
  id: string
  name: string
  teacherId: string
}

const ClassForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    capacity: data?.capacity || 30,
    grade: data?.grade || 1,
    supervisorId: data?.supervisor?.id || "",
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
      const submitData = {
        name: formData.name,
        capacity: parseInt(formData.capacity.toString()),
        grade: parseInt(formData.grade.toString()),
        supervisorId: formData.supervisorId || undefined,
      }

      const schema = type === "create" ? classSchema : updateClassSchema
      const validatedData = schema.parse(submitData)

      const url = type === "create" ? "/api/classes" : `/api/classes/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save class")
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
        {type === "create" ? "Create Class" : "Update Class"}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Class Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., 1A, 5B"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Capacity *</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            min="1"
          />
          {errors.capacity && <span className="text-xs text-red-500">{errors.capacity}</span>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Grade (1-12) *</label>
          <input
            type="number"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 1 })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            min="1"
            max="12"
          />
          {errors.grade && <span className="text-xs text-red-500">{errors.grade}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Supervisor (Optional)</label>
        {loadingTeachers ? (
          <p className="text-xs text-gray-400">Loading teachers...</p>
        ) : (
          <select
            value={formData.supervisorId}
            onChange={(e) => setFormData({ ...formData, supervisorId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">No Supervisor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.teacherId})
              </option>
            ))}
          </select>
        )}
        {errors.supervisorId && <span className="text-xs text-red-500">{errors.supervisorId}</span>}
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

export default ClassForm