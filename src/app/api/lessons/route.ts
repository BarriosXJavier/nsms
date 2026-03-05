import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createLessonSchema = z.object({
  name: z.string().min(1, "Lesson name is required"),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  subjectId: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  teacherId: z.string().min(1, "Teacher is required"),
}).refine((data) => {
  // Validate that endTime is after startTime
  const [startHour, startMin] = data.startTime.split(":").map(Number)
  const [endHour, endMin] = data.endTime.split(":").map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  return endMinutes > startMinutes
}, {
  message: "End time must be after start time",
  path: ["endTime"],
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const classId = searchParams.get("classId") || ""
    const teacherId = searchParams.get("teacherId") || ""
    const subjectId = searchParams.get("subjectId") || ""
    const day = searchParams.get("day") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.name = { contains: search, mode: "insensitive" as const }
    }

    if (classId) {
      where.classId = classId
    }

    if (teacherId) {
      where.teacherId = teacherId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (day) {
      where.day = day
    }

    // Role-based filtering
    if (session.user.role === "TEACHER") {
      where.teacherId = session.user.id
    } else if (session.user.role === "STUDENT") {
      // Find student's class and filter lessons
      const student = await prisma.student.findUnique({
        where: { id: session.user.id },
        select: { classId: true },
      })
      if (student) {
        where.classId = student.classId
      }
    }

    const [lessons, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: [
          { day: "asc" },
          { startTime: "asc" },
        ],
      }),
      prisma.lesson.count({ where }),
    ])

    return NextResponse.json({
      lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = createLessonSchema.parse(body)

    // If teacher is creating, ensure they are the teacher for the lesson
    if (session.user.role === "TEACHER" && data.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Teachers can only create lessons for themselves" }, { status: 403 })
    }

    // Validate that subject, class, and teacher exist
    const [subject, classData, teacher] = await Promise.all([
      prisma.subject.findUnique({ where: { id: data.subjectId } }),
      prisma.class.findUnique({ where: { id: data.classId } }),
      prisma.teacher.findUnique({ where: { id: data.teacherId } }),
    ])

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 400 })
    }

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 400 })
    }

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 400 })
    }

    // Check for time conflicts for the teacher on the same day
    const conflictingLesson = await prisma.lesson.findFirst({
      where: {
        teacherId: data.teacherId,
        day: data.day,
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: data.startTime } },
              { endTime: { lte: data.endTime } },
            ],
          },
        ],
      },
    })

    if (conflictingLesson) {
      return NextResponse.json({ 
        error: "Teacher has a conflicting lesson at this time" 
      }, { status: 400 })
    }

    // Check for time conflicts for the class on the same day
    const classConflict = await prisma.lesson.findFirst({
      where: {
        classId: data.classId,
        day: data.day,
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: data.startTime } },
              { endTime: { lte: data.endTime } },
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

    const lesson = await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
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

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
