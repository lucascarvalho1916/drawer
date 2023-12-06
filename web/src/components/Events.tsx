'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { ButtonExportCSV } from '@/components/ButtonExportCSV'
import { InputSearch } from '@/components/InputSearch'
import { SelectResultsPerPage } from '@/components/SelectResultsPerPage'
import { TextFinalSentence } from '@/components/TextFinalSentence'
import { InputPagination } from '@/components/InputPagination'

dayjs.locale(ptBr)

interface Collaborator {
  name: string
}

interface Draw {
  description: string
}

interface Event {
  id: string
  collaborator: Collaborator
  draw: Draw
  value: number
  drawn_at: string
}

interface Data {
  token: string
}

export default function Events(data: Data) {
  const token = data.token
  const [events, setEvents] = useState<Event[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')
  const [responseResultsPerPage, setResponseResultsPerPage] = useState('')
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  // eslint-disable-next-line no-unused-vars
  const [exporting, setExporting] = useState(false)

  const fetchEvents = async () => {
    const response = await api.get('/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: currentPage,
        resultsPerPage,
        query: searchTerm,
        sortColumn,
        sortDirection,
      },
    })

    const data = response.data.events.events
    const total = data.length > 0 ? response.data.events.total : 0
    const perPage = response.data.events.perPage

    setEvents(data)
    setTotalRecords(total)
    setResponseResultsPerPage(perPage)
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, resultsPerPage, searchTerm, sortColumn, sortDirection])

  const handleSortColumn = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setCurrentPage(1)
  }

  const handleResultsPerPage = (resultsPerPage: string) => {
    setResultsPerPage(resultsPerPage)
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const formattedValue = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const columns = ['collaborator.name', 'draw.description', 'value', 'drawn_at']

  const columnLabels = {
    'collaborator.name': 'Nome do Colaborador',
    'draw.description': 'Descrição do Sorteio',
    value: 'Valor',
    drawn_at: 'Data do Sorteio',
  }

  const title = 'colaboradores sorteados'

  return (
    <div className="text-md flex h-full flex-col rounded-lg bg-gray-50 p-2 text-black">
      <div className="flex w-full items-center justify-between p-2">
        <ButtonExportCSV
          data={events}
          title={title}
          columns={columns}
          valueKey="value"
          columnLabels={columnLabels}
          onClick={() => setExporting(true)}
        />
        <p className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-2xl font-bold uppercase text-transparent">
          {title}
        </p>
        <div className="mr-2 flex justify-end gap-2">
          <InputSearch onChange={handleSearch} />
          <SelectResultsPerPage onChange={handleResultsPerPage} />
        </div>
      </div>
      <div className="flex w-full items-center border-b border-b-black p-2">
        <div className="flex w-[40%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('name')}
          >
            <p>Nome</p>
            {sortColumn === 'name' && (
              <div>
                {sortDirection === 'asc' ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-[30%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('draw.description')}
          >
            <p>Sorteio</p>
            {sortColumn === 'draw.description' && (
              <div>
                {sortDirection === 'asc' ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-[15%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('value')}
          >
            <p>Valor</p>
            {sortColumn === 'value' && (
              <div>
                {sortDirection === 'asc' ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-[15%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('drawn_at')}
          >
            <p>Data</p>
            {sortColumn === 'drawn_at' && (
              <div>
                {sortDirection === 'asc' ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {events.length === 0 ? (
        <p className="p-2 text-center">Nenhum registro encontrado</p>
      ) : (
        events.map((event, index) => {
          const isEven = index % 2 === 0
          const rowClassName = isEven ? 'bg-white' : 'bg-transparent'

          return (
            <div
              key={event.id}
              className={`flex w-full items-center p-2 ${rowClassName}`}
            >
              <div className="w-[40%]">
                <p>{event.collaborator.name}</p>
              </div>
              <div className="w-[30%] text-center">
                <p>{event.draw.description}</p>
              </div>
              <div className="w-[15%] text-center">
                <p>{formattedValue(event.value)}</p>
              </div>
              <div className="w-[15%] text-center">
                <time>
                  {event.drawn_at
                    ? dayjs(event.drawn_at).format('DD/MM/YYYY')
                    : ''}
                </time>
              </div>
            </div>
          )
        })
      )}

      <div className="flex w-full items-center justify-between border-t border-t-black p-2">
        <TextFinalSentence
          totalRecords={totalRecords}
          responseResultsPerPage={responseResultsPerPage}
          currentPage={currentPage}
        />
        <InputPagination
          totalRecords={totalRecords}
          responseResultsPerPage={responseResultsPerPage}
          currentPage={currentPage}
          onClick={handlePageChange}
        />
      </div>
    </div>
  )
}
