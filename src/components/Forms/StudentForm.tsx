"use client"

import { useState } from "react"
import { z } from "zod"

const studentSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  studentId: z.string().min(1, { message: "Student ID is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  photo: z.string().url().optional().or(z.literal("")),
  bloodType: z.string().optional(),
  classId: z.string().min(1, { message: "Class is required" }),
  gradeLevel: z.number().int().min(1).max(12),
  parentId: z.string().optional(),
})

const updateStudentSchema = studentSchema.partial().omit({ email: true, password: true })

const StudentForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState(data || { gradeLevel: 1 })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const schema = type === "create" ? studentSchema : updateStudentSchema
      const validatedData = schema.parse({
        ...formData,
        gradeLevel: parseInt(formData.gradeLevel) || 1,
      })

      const url = type === "create" ? "/api/students" : `/api/students/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save student")
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create Student" : "Update Student"}</h1>

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
          <label className="text-xs text-gray-500">Name *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Student ID *</label>
          <input
            type="text"
            value={formData.studentId || ""}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
          {errors.studentId && <span className="text-xs text-red-500">{errors.studentId}</span>}
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
          <label className="text-xs text-gray-500">Grade Level *</label>
          <select
            value={formData.gradeLevel || ""}
            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          {errors.gradeLevel && <span className="text-xs text-red-500">{errors.gradeLevel}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Phone</label>
          <input
            type="text"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Address</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Birthday</label>
          <input
            type="date"
            value={formData.birthday || ""}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Sex *</label>
          <select
            value={formData.sex || ""}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">Select sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex && <span className="text-xs text-red-500">{errors.sex}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Blood Type</label>
          <input
            type="text"
            value={formData.bloodType || ""}
            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="A+, B-, O+, etc."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Parent ID (Optional)</label>
          <input
            type="text"
            value={formData.parentId || ""}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Photo URL</label>
          <input
            type="text"
            value={formData.photo || ""}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            placeholder="https://..."
          />
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

export default StudentForm
