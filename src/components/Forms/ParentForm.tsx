"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const parentSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
})

const updateParentSchema = parentSchema.partial().omit({ email: true, password: true })

type Student = {
  id: string
  name: string
  studentId: string
}

const ParentForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    ...data,
    email: data?.user?.email || "",
    studentIds: data?.students?.map((s: any) => s.id) || [],
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  // Fetch students for linking
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students?limit=100")
        if (response.ok) {
          const result = await response.json()
          setStudents(result.students || [])
        }
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const schema = type === "create" ? parentSchema : updateParentSchema
      const validatedData = schema.parse(formData)

      const url = type === "create" ? "/api/parents" : `/api/parents/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save parent")
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

  const handleStudentSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((option) => option.value)
    setFormData({ ...formData, studentIds: selected })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Parent" : "Update Parent"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {type === "create" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Email *</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Password *</label>
              <input
                type="password"
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
              />
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Full Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Phone</label>
          <input
            type="text"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="+1234567890"
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs text-gray-500">Address</label>
          <textarea
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            rows={3}
            placeholder="Street, City, State, ZIP"
          />
          {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-xs text-gray-500">Link to Students</label>
          {loadingStudents ? (
            <p className="text-xs text-gray-400">Loading students...</p>
          ) : (
            <>
              <select
                multiple
                value={formData.studentIds || []}
                onChange={handleStudentSelection}
                className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
                size={5}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple students
              </p>
            </>
          )}
          {errors.studentIds && <span className="text-xs text-red-500">{errors.studentIds}</span>}
        </div>
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

export default ParentForm
