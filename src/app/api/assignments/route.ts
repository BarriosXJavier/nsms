import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createAssignmentSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string().datetime(),
  subjectId: z.string(),
  classId: z.string(),
  teacherId: z.string(),
})

const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  dueDate: z.string().datetime().optional(),
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

    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
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
        orderBy: { dueDate: "desc" },
      }),
      prisma.assignment.count({ where }),
    ])

    return NextResponse.json({
      assignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching assignments:", error)
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
    const data = createAssignmentSchema.parse(body)

    const assignment = await prisma.assignment.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
      },
      include: {
        subject: true,
        class: true,
        teacher: true,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
