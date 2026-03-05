import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createSubjectSchema = z.object({
  name: z.string().min(1),
  teacherIds: z.array(z.string()).optional(),
})

const updateSubjectSchema = z.object({
  name: z.string().min(1).optional(),
  teacherIds: z.array(z.string()).optional(),
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

    const skip = (page - 1) * limit

    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          teachers: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              exams: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.subject.count({ where }),
    ])

    return NextResponse.json({
      subjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const data = createSubjectSchema.parse(body)

    const existingSubject = await prisma.subject.findUnique({
      where: { name: data.name },
    })

    if (existingSubject) {
      return NextResponse.json({ error: "Subject name already exists" }, { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        ...(data.teacherIds && {
          teachers: {
            connect: data.teacherIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
