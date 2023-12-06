import React, { useState } from 'react'

interface InputSearchProps {
  onChange: (searchTerm: string) => void
}

export function InputSearch(data: InputSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const searchTerm = event.target.value
    data.onChange(searchTerm)
    setSearchTerm(searchTerm)
  }

  return (
    <div>
      <input
        className="w-52 rounded-md border-gray-100 p-2 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
    </div>
  )
}
