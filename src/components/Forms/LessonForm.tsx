"use client"

import { useState } from "react"
import { z } from "zod"

const lessonSchema = z.object({
  name: z.string().min(1, "Lesson name is required"),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  subjectId: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  teacherId: z.string().min(1, "Teacher is required"),
})

const LessonForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState(data || {})
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validatedData = lessonSchema.parse(formData)

      const url = type === "create" ? "/api/lessons" : `/api/lessons/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save lesson")
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Lesson" : "Update Lesson"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Lesson Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Day *</label>
          <select
            value={formData.day || ""}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">Select day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
            <option value="SUNDAY">Sunday</option>
          </select>
          {errors.day && <span className="text-xs text-red-500">{errors.day}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Start Time * (HH:MM)</label>
          <input
            type="time"
            value={formData.startTime || ""}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.startTime && <span className="text-xs text-red-500">{errors.startTime}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">End Time * (HH:MM)</label>
          <input
            type="time"
            value={formData.endTime || ""}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.endTime && <span className="text-xs text-red-500">{errors.endTime}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Subject ID *</label>
          <input
            type="text"
            value={formData.subjectId || ""}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Enter subject ID"
          />
          {errors.subjectId && <span className="text-xs text-red-500">{errors.subjectId}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Class ID *</label>
          <input
            type="text"
            value={formData.classId || ""}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Enter class ID"
          />
          {errors.classId && <span className="text-xs text-red-500">{errors.classId}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Teacher ID *</label>
          <input
            type="text"
            value={formData.teacherId || ""}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="Enter teacher ID"
          />
          {errors.teacherId && <span className="text-xs text-red-500">{errors.teacherId}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-300"
      >
        {loading ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  )
}

export default LessonForm
