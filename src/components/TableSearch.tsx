"use client"

import { useState } from "react"
import { Input } from "./ui/input"

const TableSearch = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full md:w-auto text-xs flex items-center gap-2 px-4">
        <Input
          type="search"
          placeholder="🔍 Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[200px] p-2 rounded-full outline-none"
        />
      </div>
    </form>
  )
}

export default TableSearch
