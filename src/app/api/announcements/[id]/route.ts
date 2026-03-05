import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateAnnouncementSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  classId: z.string().optional(),
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

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error fetching announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateAnnouncementSchema.parse(body)

    const existing = await prisma.announcement.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        class: true,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating announcement:", error)
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

    const existing = await prisma.announcement.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    await prisma.announcement.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
