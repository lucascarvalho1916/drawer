'use client'

import { useState, useEffect } from 'react'
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
  id: string
  name: string
  cpf: string
  start_at: string
  end_at: string
}

interface Data {
  token: string
}

export default function NotDraws(data: Data) {
  const token = data.token
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')
  const [responseResultsPerPage, setResponseResultsPerPage] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [exporting, setExporting] = useState(false)

  const fetchNotDrawns = async () => {
    const publicizeDraw = await api.get('/draws/published-draws', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const drawId = publicizeDraw.data.draws.draws[0].id

    const response = await api.get(`/collaborators/${drawId}/notDrawns`, {
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

    const data = response.data.collaborators.collaborators
    const total = data.length > 0 ? response.data.collaborators.total : 0
    const perPage = response.data.collaborators.perPage

    setCollaborators(data)
    setTotalRecords(total)
    setResponseResultsPerPage(perPage)
  }

  useEffect(() => {
    fetchNotDrawns()
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

  const columns = ['name', 'cpf', 'start_at', 'end_at']

  const columnLabels = {
    name: 'Nome do Colaborador',
    cpf: 'CPF',
    start_at: 'Data de Início',
    end_at: 'Data Fim',
  }

  const title = 'colaboradores não sorteados'

  return (
    <div className="text-md flex h-full flex-col rounded-lg bg-gray-50 p-2 text-black">
      <div className="flex w-full items-center justify-between p-2">
        <ButtonExportCSV
          data={collaborators}
          title={title}
          columns={columns}
          valueKey="value"
          columnLabels={columnLabels}
          onClick={() => setExporting(true)}
        />
        <p className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-2xl font-bold uppercase text-transparent">
          {title}
        </p>
        <div className="flex justify-end gap-2">
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
            onClick={() => handleSortColumn('cpf')}
          >
            <p>cpf</p>
            {sortColumn === 'cpf' && (
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
            onClick={() => handleSortColumn('start_at')}
          >
            <p>Início</p>
            {sortColumn === 'start_at' && (
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
            onClick={() => handleSortColumn('end_at')}
          >
            <p>Fim</p>
            {sortColumn === 'end_at' && (
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
      {collaborators.length === 0 ? (
        <p className="p-2 text-center">Nenhum registro encontrado</p>
      ) : (
        collaborators.map((collaborator, index) => {
          const isEven = index % 2 === 0
          const rowClassName = isEven ? 'bg-white' : 'bg-transparent'
          return (
            <div
              key={collaborator.id}
              className={`flex w-full items-center p-2 ${rowClassName}`}
            >
              <div className="w-[40%]">
                <p>{collaborator.name}</p>
              </div>
              <div className="w-[30%] text-center">
                <p>{collaborator.cpf}</p>
              </div>
              <div className="w-[15%] text-center">
                <time>
                  {collaborator.start_at
                    ? dayjs(collaborator.start_at).format('DD/MM/YYYY')
                    : ''}
                </time>
              </div>
              <div className="w-[15%] text-center">
                <time>
                  {collaborator.end_at
                    ? dayjs(collaborator.end_at).format('DD/MM/YYYY')
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
