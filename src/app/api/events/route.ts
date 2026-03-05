import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  classId: z.string().optional(),
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

    const skip = (page - 1) * limit

    const where: any = {}

    if (classId) {
      where.classId = classId
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
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
    const data = createEventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: {
        class: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
