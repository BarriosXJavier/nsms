"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

const SettingsPage = () => {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState({
    email: true,
    announcements: true,
    messages: false,
    updates: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <button
              onClick={() => handleToggle("email")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Announcements</h3>
              <p className="text-sm text-gray-500">Get notified about school announcements</p>
            </div>
            <button
              onClick={() => handleToggle("announcements")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.announcements ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.announcements ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Messages</h3>
              <p className="text-sm text-gray-500">Receive message notifications</p>
            </div>
            <button
              onClick={() => handleToggle("messages")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.messages ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.messages ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-gray-500">Get notified about system updates</p>
            </div>
            <button
              onClick={() => handleToggle("updates")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.updates ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.updates ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Privacy</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Profile Visibility</span>
            <select className="px-3 py-1 border border-gray-300 rounded-md">
              <option>Everyone</option>
              <option>Same Role Only</option>
              <option>Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Show Email</span>
            <select className="px-3 py-1 border border-gray-300 rounded-md">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium mb-2">Change Password</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Update Password
            </button>
          </div>
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-3">
              Once you delete your account, there is no going back. Please contact your administrator.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Request Account Deletion
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
