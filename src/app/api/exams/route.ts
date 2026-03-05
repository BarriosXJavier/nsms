import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createExamSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  subjectId: z.string(),
  classId: z.string(),
  teacherId: z.string(),
})

const updateExamSchema = z.object({
  title: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  subjectId: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
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
    const classId = searchParams.get("classId") || ""
    const subjectId = searchParams.get("subjectId") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (classId) {
      where.classId = classId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
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
            },
          },
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              results: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.exam.count({ where }),
    ])

    return NextResponse.json({
      exams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching exams:", error)
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
    const data = createExamSchema.parse(body)

    const exam = await prisma.exam.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        subject: true,
        class: true,
        teacher: true,
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating exam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
