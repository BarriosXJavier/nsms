"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Student = {
  id: string
  studentId: string
  name: string
  email: string
  class: { name: string } | null
}

type ParentData = {
  id: string
  name: string
  phone: string | null
  address: string | null
  students: Student[]
}

const ParentDashboard = () => {
  const { data: session } = useSession()
  const [parent, setParent] = useState<ParentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/parents")
        if (!res.ok) throw new Error("Failed to fetch parent data")
        
        const data = await res.json()
        const currentParent = data.items.find((p: any) => p.user.id === session?.user?.id)
        
        if (currentParent) {
          setParent(currentParent)
        } else {
          setError("Parent profile not found")
        }
      } catch (err) {
        setError("Failed to load parent data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchParentData()
    }
  }, [session?.user?.id])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error || !parent) {
    return <div className="p-4 text-red-500">{error || "No parent data found"}</div>
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Parent Dashboard</h1>
      
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{parent.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{parent.phone || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{parent.address || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Children</h2>
        {parent.students.length === 0 ? (
          <p className="text-gray-500">No students linked to your account</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parent.students.map((student) => (
              <Link href={`/list/students/${student.id}`} key={student.id}>
                <div className="border rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="/avatar.png"
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-xs text-gray-500">{student.studentId}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">Class: {student.class?.name || "N/A"}</p>
                    <p className="text-gray-600">{student.email}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentDashboard

