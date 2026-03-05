"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

const resultSchema = z.object({
  score: z.number().int().min(0).max(100, { message: "Score must be between 0 and 100" }),
  type: z.enum(["EXAM", "ASSIGNMENT"], { message: "Type is required" }),
  studentId: z.string().min(1, { message: "Student is required" }),
  subjectId: z.string().min(1, { message: "Subject is required" }),
  teacherId: z.string().min(1, { message: "Teacher is required" }),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
})

const updateResultSchema = resultSchema.partial()

type Student = {
  id: string
  name: string
  studentId: string
}

type Subject = {
  id: string
  name: string
}

type Teacher = {
  id: string
  name: string
  teacherId: string
}

type Exam = {
  id: string
  title: string
}

type Assignment = {
  id: string
  title: string
}

const ResultForm = ({
  type,
  data,
}: {
  type: "create" | "update"
  data?: any
}) => {
  const [formData, setFormData] = useState({
    score: data?.score || 0,
    type: data?.type || "EXAM",
    studentId: data?.student?.id || "",
    subjectId: data?.subject?.id || "",
    teacherId: data?.teacher?.id || "",
    examId: data?.exam?.id || "",
    assignmentId: data?.assignment?.id || "",
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, subjectsRes, teachersRes, examsRes, assignmentsRes] = await Promise.all([
          fetch("/api/students?limit=100"),
          fetch("/api/subjects?limit=100"),
          fetch("/api/teachers?limit=100"),
          fetch("/api/exams?limit=100"),
          fetch("/api/assignments?limit=100"),
        ])

        if (studentsRes.ok) {
          const result = await studentsRes.json()
          setStudents(result.students || [])
        }
        if (subjectsRes.ok) {
          const result = await subjectsRes.json()
          setSubjects(result.subjects || [])
        }
        if (teachersRes.ok) {
          const result = await teachersRes.json()
          setTeachers(result.teachers || [])
        }
        if (examsRes.ok) {
          const result = await examsRes.json()
          setExams(result.exams || [])
        }
        if (assignmentsRes.ok) {
          const result = await assignmentsRes.json()
          setAssignments(result.assignments || [])
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
        score: parseInt(formData.score.toString()),
        type: formData.type,
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
        examId: formData.type === "EXAM" && formData.examId ? formData.examId : undefined,
        assignmentId: formData.type === "ASSIGNMENT" && formData.assignmentId ? formData.assignmentId : undefined,
      }

      const schema = type === "create" ? resultSchema : updateResultSchema
      const validatedData = schema.parse(submitData)

      const url = type === "create" ? "/api/results" : `/api/results/${data?.id}`
      const method = type === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save result")
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
        {type === "create" ? "Create Result" : "Update Result"}
      </h1>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Score (0-100) *</label>
          <input
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            min="0"
            max="100"
          />
          {errors.score && <span className="text-xs text-red-500">{errors.score}</span>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs text-gray-500">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="EXAM">Exam</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
          {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
        </div>
      </div>

      {loadingData ? (
        <p className="text-xs text-gray-400">Loading options...</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Student *</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.studentId})
                </option>
              ))}
            </select>
            {errors.studentId && <span className="text-xs text-red-500">{errors.studentId}</span>}
          </div>

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

          {formData.type === "EXAM" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Exam (Optional)</label>
              <select
                value={formData.examId}
                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title}
                  </option>
                ))}
              </select>
              {errors.examId && <span className="text-xs text-red-500">{errors.examId}</span>}
            </div>
          )}

          {formData.type === "ASSIGNMENT" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Assignment (Optional)</label>
              <select
                value={formData.assignmentId}
                onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })}
                className="ring-1 ring-gray-300 p-2 rounded-md text-sm"
              >
                <option value="">Select Assignment</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
              {errors.assignmentId && <span className="text-xs text-red-500">{errors.assignmentId}</span>}
            </div>
          )}
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

export default ResultForm