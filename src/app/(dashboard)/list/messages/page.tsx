"use client"

import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"

const MessagesPage = () => {
  const { data: session } = useSession()
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)

  const messages = [
    {
      id: 1,
      from: "John Doe",
      role: "Teacher",
      subject: "Regarding Assignment Submission",
      preview: "Hi, I wanted to discuss the assignment deadline...",
      message: "Hi, I wanted to discuss the assignment deadline for Mathematics. Could we extend it by 2 days?",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      from: "Admin",
      role: "Administration",
      subject: "School Event Announcement",
      preview: "Important: Annual day celebration on...",
      message: "Important: Annual day celebration on December 15th. All students and staff are requested to attend.",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      from: "Jane Smith",
      role: "Parent",
      subject: "Parent-Teacher Meeting",
      preview: "Thank you for the meeting yesterday...",
      message: "Thank you for the meeting yesterday. It was very helpful to understand my child's progress.",
      time: "1 day ago",
      unread: false,
    },
  ]

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Messages List */}
        <div className="lg:col-span-1 border-r border-gray-200">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              New Message
            </button>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg.id)}
                className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedMessage === msg.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                } ${msg.unread ? "bg-blue-50/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src="/avatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full min-w-[40px]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {msg.from}
                      </h3>
                      {msg.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{msg.role}</p>
                    <p className="text-sm font-medium mb-1 truncate">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {msg.preview}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 hidden lg:block">
          {selectedMessage ? (
            <div className="p-4 sm:p-6">
              {(() => {
                const msg = messages.find((m) => m.id === selectedMessage)
                if (!msg) return null
                return (
                  <>
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                      <Image
                        src="/avatar.png"
                        alt=""
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-1">
                          {msg.subject}
                        </h2>
                        <p className="text-sm text-gray-600">
                          From: <span className="font-medium">{msg.from}</span> ({msg.role})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2">
                        Reply
                      </button>
                      <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                        Archive
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Image
                  src="/message.png"
                  alt=""
                  width={80}
                  height={80}
                  className="mx-auto mb-4 opacity-50"
                />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Message View */}
        {selectedMessage && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setSelectedMessage(null)}
                className="mb-4 text-blue-600 hover:text-blue-700"
              >
                ← Back to messages
              </button>
              {(() => {
                const msg = messages.find((m) => m.id === selectedMessage)
                if (!msg) return null
                return (
                  <>
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                      <Image
                        src="/avatar.png"
                        alt=""
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-1">
                          {msg.subject}
                        </h2>
                        <p className="text-sm text-gray-600">
                          From: <span className="font-medium">{msg.from}</span> ({msg.role})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Reply
                      </button>
                      <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                        Archive
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagesPage
