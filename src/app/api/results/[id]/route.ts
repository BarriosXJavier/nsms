import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateResultSchema = z.object({
  score: z.number().int().min(0).max(100).optional(),
  type: z.enum(["EXAM", "ASSIGNMENT"]).optional(),
  studentId: z.string().optional(),
  subjectId: z.string().optional(),
  teacherId: z.string().optional(),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
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

    const result = await prisma.result.findUnique({
      where: { id },
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
    })

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching result:", error)
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
    const body = await request.json()
    const data = updateResultSchema.parse(body)

    const existing = await prisma.result.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    const result = await prisma.result.update({
      where: { id },
      data,
      include: {
        student: true,
        subject: true,
        teacher: true,
        exam: true,
        assignment: true,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    const existing = await prisma.result.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    await prisma.result.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Result deleted successfully" })
  } catch (error) {
    console.error("Error deleting result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
