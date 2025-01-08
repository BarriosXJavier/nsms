import React from 'react'
import { Input } from './ui/input'

const TableSearch = () => {
  return (
    <div>
      <div className="w-full md:w-auto text-xs flex items-center gap-2 px-4 ">
        <Input
          type="search"
          placeholder="🔍 Search..."
          className="w-[200px] p-2 rounded-full  outline-none"
        />
      </div>
    </div>
  )
}

export default TableSearch
