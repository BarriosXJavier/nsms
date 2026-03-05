"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  classId: z.string().optional(),
})

const updateEventSchema = eventSchema.partial()

type Class = {
  id: string
  name: string
}

const EventForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    title: data?.title || "",
    description: data?.description || "",
    date: data?.date ? new Date(data.date).toISOString().split("T")[0] : "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    classId: data?.class?.id || "",
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesRes = await fetch("/api/classes?limit=100")
        if (classesRes.ok) {
          const result = await classesRes.json()
          setClasses(result.classes || [])
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
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
        date: new Date(formData.date).toISOString(),
        classId: formData.classId || undefined,
      }

      const schema = type === "create" ? eventSchema : updateEventSchema
      const validatedData = schema.parse(submitData)

      const url = type === "create" ? "/api/events" : `/api/events/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save event")
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
        {type === "create" ? "Create Event" : "Update Event"}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Event Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          placeholder="e.g., Sports Day, Science Fair"
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          rows={4}
          placeholder="Describe the event..."
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Start Time *</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.startTime && <span className="text-xs text-red-500">{errors.startTime}</span>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">End Time *</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.endTime && <span className="text-xs text-red-500">{errors.endTime}</span>}
        </div>
      </div>

      {loadingData ? (
        <p className="text-xs text-gray-400">Loading options...</p>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Class (Optional)</label>
          <select
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">All Classes (School-wide event)</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && <span className="text-xs text-red-500">{errors.classId}</span>}
        </div>
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

export default EventForm
