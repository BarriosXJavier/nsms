import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  subjectId: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
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

    const assignment = await prisma.assignment.findUnique({
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
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
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
    const data = updateAssignmentSchema.parse(body)

    const existing = await prisma.assignment.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    const updateData: any = { ...data }
    if (data.dueDate) {
      updateData.dueDate = new Date(data.dueDate)
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        subject: true,
        class: true,
        teacher: true,
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating assignment:", error)
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

    const existing = await prisma.assignment.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    await prisma.assignment.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("Error deleting assignment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
