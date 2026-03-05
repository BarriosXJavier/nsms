import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  type: z.enum(["EXAM", "ASSIGNMENT"]),
  studentId: z.string(),
  subjectId: z.string(),
  teacherId: z.string(),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
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
    const studentId = searchParams.get("studentId") || ""
    const subjectId = searchParams.get("subjectId") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentId: true,
            },
          },
          subject: {
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
          exam: {
            select: {
              title: true,
              date: true,
            },
          },
          assignment: {
            select: {
              title: true,
              dueDate: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.result.count({ where }),
    ])

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching results:", error)
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
    const data = createResultSchema.parse(body)

    const result = await prisma.result.create({
      data,
      include: {
        student: true,
        subject: true,
        teacher: true,
        exam: true,
        assignment: true,
      },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
