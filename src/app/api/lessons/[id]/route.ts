import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateLessonSchema = z.object({
  name: z.string().min(1, "Lesson name is required").optional(),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]).optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)").optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)").optional(),
  subjectId: z.string().min(1, "Subject is required").optional(),
  classId: z.string().min(1, "Class is required").optional(),
  teacherId: z.string().min(1, "Teacher is required").optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            capacity: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Role-based access control
    if (session.user.role === "TEACHER" && lesson.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (session.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { id: session.user.id },
        select: { classId: true },
      })
      if (!student || student.classId !== lesson.classId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    })

    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Teachers can only update their own lessons
    if (session.user.role === "TEACHER" && existingLesson.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Teachers can only update their own lessons" }, { status: 403 })
    }

    const body = await request.json()
    const data = updateLessonSchema.parse(body)

    // If teacher is being changed, ensure the requesting user has permission
    if (session.user.role === "TEACHER" && data.teacherId && data.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Teachers cannot assign lessons to other teachers" }, { status: 403 })
    }

    // Validate time if both startTime and endTime are provided or being updated
    const startTime = data.startTime || existingLesson.startTime
    const endTime = data.endTime || existingLesson.endTime

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    // Check for conflicts if day, time, teacher, or class are being updated
    if (data.day || data.startTime || data.endTime || data.teacherId || data.classId) {
      const teacherId = data.teacherId || existingLesson.teacherId
      const classId = data.classId || existingLesson.classId
      const day = data.day || existingLesson.day

      // Check teacher conflicts
      const teacherConflict = await prisma.lesson.findFirst({
        where: {
          id: { not: id },
          teacherId,
          day,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      })

      if (teacherConflict) {
        return NextResponse.json({ 
          error: "Teacher has a conflicting lesson at this time" 
        }, { status: 400 })
      }

      // Check class conflicts
      const classConflict = await prisma.lesson.findFirst({
        where: {
          id: { not: id },
          classId,
          day,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      })

      if (classConflict) {
        return NextResponse.json({ 
          error: "Class has a conflicting lesson at this time" 
        }, { status: 400 })
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            capacity: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            teacherId: true,
          },
        },
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    })

    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Teachers can only delete their own lessons
    if (session.user.role === "TEACHER" && existingLesson.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Teachers can only delete their own lessons" }, { status: 403 })
    }

    await prisma.lesson.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Lesson deleted successfully" })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
