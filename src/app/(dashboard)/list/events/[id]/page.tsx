"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Event = {
  id: string
  title: string
  description: string | null
  date: string
  startTime: string
  endTime: string
  class: {
    id: string
    name: string
  } | null
}

const SingleEventPage = () => {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/events/${id}`)
        if (!res.ok) throw new Error("Failed to fetch event")
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        setError("Failed to load event data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEvent()
  }, [id])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error || !event) return <div className="p-4 text-red-500 text-center">{error || "Event not found"}</div>

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  return (
    <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/*LEFT*/}
      <div className="w-full lg:w-2/3">
        {/*CARD*/}
        <div className="flex flex-col gap-4">
          <div className="bg-rose-100 py-4 sm:py-6 px-3 sm:px-4 rounded-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-2">{event.title}</h1>
                  {event.description && (
                    <p className="text-xs sm:text-sm text-gray-700 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className={`text-xs sm:text-sm px-3 py-1 rounded-full ${
                  isUpcoming ? "bg-blue-500 text-white" : "bg-white"
                }`}>
                  {isUpcoming ? "Upcoming" : "Past"}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Date:</span>
                  <span>{eventDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={16} height={16} />
                  <span className="font-medium">Time:</span>
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Image src="/singleClass.png" alt="" width={16} height={16} />
                  <span className="font-medium">Class:</span>
                  {event.class ? (
                    <Link 
                      href={`/list/classes/${event.class.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {event.class.name}
                    </Link>
                  ) : (
                    <span className="text-gray-500">All Classes</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Event Date</span>
              </div>
              <p className="font-semibold text-sm">
                {eventDate.toLocaleDateString("en-US", { 
                  weekday: "short", 
                  month: "short", 
                  day: "numeric" 
                })}
              </p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">Start Time</span>
              </div>
              <p className="font-semibold text-sm">{event.startTime}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/date.png" alt="" width={20} height={20} />
                <span className="text-xs text-gray-500">End Time</span>
              </div>
              <p className="font-semibold text-sm">{event.endTime}</p>
            </div>
          </div>
        </div>

        {/*Bottom - Event Description*/}
        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Event Description</h1>
          {event.description ? (
            <p className="text-sm text-gray-700 leading-relaxed">
              {event.description}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">No description provided</p>
          )}
        </div>

        <div className="mt-4 bg-white rounded-md p-3 sm:p-4">
          <h1 className="text-base sm:text-lg font-semibold mb-3">Event Details</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${isUpcoming ? "text-blue-600" : "text-gray-600"}`}>
                {isUpcoming ? "Upcoming" : "Completed"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Target Audience</span>
              <span className="font-medium">
                {event.class ? event.class.name : "All Classes"}
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
            {event.class && (
              <>
                <Link 
                  href={`/list/classes/${event.class.id}`} 
                  className="p-2 sm:p-3 rounded-md bg-blue-200 hover:bg-blue-300 transition-colors"
                >
                  View Class
                </Link>
                <Link 
                  href={`/list/students?classId=${event.class.id}`} 
                  className="p-2 sm:p-3 rounded-md bg-amber-100 hover:bg-amber-200 transition-colors"
                >
                  View Students
                </Link>
              </>
            )}
            <Link 
              href="/list/events" 
              className="p-2 sm:p-3 rounded-md bg-rose-100 hover:bg-rose-200 transition-colors"
            >
              All Events
            </Link>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Event Information</h1>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Title</p>
              <p className="font-medium">{event.title}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p className="font-medium">
                {eventDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Time Slot</p>
              <p className="font-medium">{event.startTime} - {event.endTime}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Class</p>
              {event.class ? (
                <Link 
                  href={`/list/classes/${event.class.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {event.class.name}
                </Link>
              ) : (
                <p className="font-medium">All Classes (School-wide)</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-md">
          <h1 className="text-lg sm:text-xl font-semibold mb-3">Schedule</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-md">
              <Image src="/date.png" alt="" width={24} height={24} />
              <div>
                <p className="text-xs text-gray-600">Event Date</p>
                <p className="font-medium text-sm">
                  {eventDate.toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-md">
              <Image src="/date.png" alt="" width={24} height={24} />
              <div>
                <p className="text-xs text-gray-600">Time Slot</p>
                <p className="font-medium text-sm">{event.startTime} - {event.endTime}</p>
              </div>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-md border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/date.png" alt="" width={20} height={20} />
              <h2 className="font-semibold text-sm">Upcoming Event</h2>
            </div>
            <p className="text-xs text-gray-700">
              This event is scheduled for{" "}
              {Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
              day(s) from now.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleEventPage
