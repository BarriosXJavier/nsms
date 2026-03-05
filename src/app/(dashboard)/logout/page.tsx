"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

const LogoutPage = () => {
  useEffect(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Signing out...</p>
    </div>
  )
}

export default LogoutPage
