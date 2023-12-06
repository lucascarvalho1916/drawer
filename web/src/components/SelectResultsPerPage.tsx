import React, { useState } from 'react'

interface SelectResultsPerPageProps {
  onChange: (resultsPerPage: string) => void
}

export function SelectResultsPerPage(data: SelectResultsPerPageProps) {
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')

  const handleResultsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const resultsPerPage = event.target.value
    data.onChange(resultsPerPage)
    setResultsPerPage(resultsPerPage)
  }

  return (
    <div>
      <label htmlFor="" className="flex-col gap-2">
        <select
          className="w-24 rounded-md border-gray-100 p-2 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
          placeholder="Resultados por página"
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="">Todos</option>
        </select>
      </label>
    </div>
  )
}
