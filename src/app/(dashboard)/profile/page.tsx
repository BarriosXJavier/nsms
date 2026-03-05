"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Image from "next/image"

const ProfilePage = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        const role = (session.user as any).role?.toLowerCase()
        let endpoint = ""

        if (role === "admin") {
          endpoint = `/api/teachers?search=${session.user.email}`
        } else if (role === "teacher") {
          endpoint = `/api/teachers?search=${session.user.email}`
        } else if (role === "student") {
          endpoint = `/api/students?search=${session.user.email}`
        } else if (role === "parent") {
          endpoint = `/api/parents?search=${session.user.email}`
        }

        if (endpoint) {
          const res = await fetch(endpoint)
          const data = await res.json()
          setUserData(data.items?.[0] || data.teachers?.[0] || data.students?.[0] || null)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session])

  if (loading) {
    return <div className="p-4 text-center">Loading profile...</div>
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <Image
            src="/avatar.png"
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              {userData?.name || session?.user?.email?.split("@")[0] || "User"}
            </h2>
            <p className="text-gray-600 capitalize mb-1">{(session?.user as any)?.role}</p>
            <p className="text-gray-500 text-sm">{session?.user?.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{session?.user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-medium capitalize">{(session?.user as any)?.role}</p>
            </div>
            {userData?.phone && (
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{userData.phone}</p>
              </div>
            )}
            {userData?.address && (
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{userData.address}</p>
              </div>
            )}
            {userData?.bloodType && (
              <div>
                <label className="text-sm text-gray-500">Blood Type</label>
                <p className="font-medium">{userData.bloodType}</p>
              </div>
            )}
            {userData?.birthday && (
              <div>
                <label className="text-sm text-gray-500">Birthday</label>
                <p className="font-medium">
                  {new Date(userData.birthday).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <p className="text-gray-600 text-sm mb-4">
          To update your profile information or change your password, please contact your administrator.
        </p>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          Request Profile Update
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
