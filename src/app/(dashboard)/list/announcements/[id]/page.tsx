"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Announcement = {
  id: string
  title: string
  description: string | null
  date: string
  class: {
    id: string
    name: string
  } | null
}

const SingleAnnouncementPage = () => {
  const params = useParams()
  const id = params.id as string
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/announcements/${id}`)
        if (!res.ok) throw new Error("Failed to fetch announcement")
        const data = await res.json()
        setAnnouncement(data)
      } catch (err) {
        setError("Failed to load announcement data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAnnouncement()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !announcement) return <div className="p-4 text-red-500 text-center">{error || "Announcement not found"}</div>

  const announcementDate = new Date(announcement.date)
  const isRecent = (new Date().getTime() - announcementDate.getTime()) < (7 * 24 * 60 * 60 * 1000) // Less than 7 days old

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-sky-200 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-2">{announcement.title}</h1>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span>
                      Posted on {announcementDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {isRecent && (
                  <div className="text-xs sm:text-sm bg-blue-500 text-white px-3 py-1 rounded-full">
                    New
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Date:</span>
                  <span>{announcementDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Target:</span>
                  {announcement.class ? (
                    <Link 
                      href={`/list/classes/${announcement.class.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {announcement.class.name}
                    </Link>
                  ) : (
                    <span>All Classes</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Posted Date</span>
              </div>
              <p className="font-semibold text-sm">
                {announcementDate.toLocaleDateString("en-US", { 
                  weekday: "short", 
                  month: "short", 
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/singleClass.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Audience</span>
              </div>
              <p className="font-semibold text-sm">
                {announcement.class ? announcement.class.name : "School-wide"}
              </p>
            </div>
          </div>
        </div>

        {/*Bottom - Announcement Content*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Announcement Details</h1>
          {announcement.description ? (
            <div className="prose max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {announcement.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No detailed description provided</p>
          )}
        </div>

        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Information</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Posted</span>
              <span className="font-medium">
                {announcementDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Target Audience</span>
              <span className="font-medium">
                {announcement.class ? announcement.class.name : "All Classes"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${isRecent ? "text-blue-600" : "text-gray-600"}`}>
                {isRecent ? "Recent" : "Archived"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*RIGHT*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Quick Actions</h1>
          <div className="flex gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            {announcement.class && (
              <>
                <Link 
                  href={`/list/classes/${announcement.class.id}`} 
                  className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
                >
                  View Class
                </Link>
                <Link 
                  href={`/list/students?classId=${announcement.class.id}`} 
                  className="p-2 sm:p-3 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors"
                >
                  View Students
                </Link>
              </>
            )}
            <Link 
              href="/list/announcements" 
              className="p-2 sm:p-3 rounded-md bg-sky-200 hover:bg-sky-300 transition-colors"
            >
              All Announcements
            </Link>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Announcement Info</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Title</p>
              <p className="font-medium">{announcement.title}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Posted Date</p>
              <p className="font-medium">
                {announcementDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Target Class</p>
              {announcement.class ? (
                <Link 
                  href={`/list/classes/${announcement.class.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {announcement.class.name}
                </Link>
              ) : (
                <p className="font-medium">All Classes (School-wide)</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Timeline</h1>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-md">
              <Image src="/date.png" alt="" width={24} height={24} className="mt-1" />
              <div>
                <p className="text-xs text-gray-600">Posted On</p>
                <p className="font-medium text-sm">
                  {announcementDate.toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor((new Date().getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {isRecent && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-md border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/date.png" alt="" width={20} height={20} />
              <h2 className="font-semibold text-sm">Recent Announcement</h2>
            </div>
            <p className="text-xs text-gray-700">
              This announcement was posted within the last 7 days and is considered recent.
            </p>
          </div>
        )}

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Reach</h1>
          <div className="text-sm">
            <p className="text-gray-600 mb-2">This announcement is visible to:</p>
            <div className="p-3 bg-sky-50 rounded-md">
              <p className="font-medium">
                {announcement.class 
                  ? `Students and teachers in ${announcement.class.name}`
                  : "All students, teachers, and staff across the school"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleAnnouncementPage
