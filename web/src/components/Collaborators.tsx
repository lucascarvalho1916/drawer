'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { ModalFormEditCollaborator } from '@/components/ModalFormEditCollaborator'
import { ButtonAddCollaborator } from '@/components/ButtonAddCollaborator'
import { TextFinalSentence } from '@/components/TextFinalSentence'
import { InputPagination } from '@/components/InputPagination'
import { SelectResultsPerPage } from '@/components/SelectResultsPerPage'
import { InputSearch } from '@/components/InputSearch'

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

export function Collaborators(data: Data) {
  const token = data.token
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')
  const [responseResultsPerPage, setResponseResultsPerPage] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCollaborator, setSelectedCollaborator] = useState<
    Collaborator | undefined
  >(undefined)

  const fetchCollaborators = async () => {
    const response = await api.get('/collaborators', {
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

    setResultsPerPage(resultsPerPage)
    setCollaborators(data)
    setTotalRecords(total)
    setResponseResultsPerPage(perPage)
  }

  useEffect(() => {
    fetchCollaborators()
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

  const handleOpenModalEditCollaborator = (collaboratorId: string) => {
    const collaborator = collaborators.find(
      (collab) => collab.id === collaboratorId,
    )

    setSelectedCollaborator(collaborator)
  }

  const handleCloseModalEditCollaborator = () => {
    setSelectedCollaborator(undefined)
  }

  return (
    <div className="text-md flex h-full flex-col rounded-lg bg-gray-50 p-2 text-black shadow-2xl">
      <div className="flex w-full items-center justify-between p-2">
        <ButtonAddCollaborator token={token} />
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
              <div className="flex w-[40%]">
                <a
                  onClick={() =>
                    handleOpenModalEditCollaborator(collaborator.id)
                  }
                  className="cursor-pointer text-custom-pink hover:font-semibold"
                >
                  {collaborator.name}
                </a>
              </div>
              <div className="flex w-[30%] justify-center">
                <p>{collaborator.cpf}</p>
              </div>
              <div className="flex w-[15%] justify-center">
                <time>
                  {collaborator.start_at
                    ? dayjs(collaborator.start_at).format('DD/MM/YYYY')
                    : ''}
                </time>
              </div>
              {collaborator.end_at === null ? (
                <div className="flex w-[15%] justify-center" />
              ) : (
                <div className="flex w-[15%] justify-center">
                  <time>{dayjs(collaborator.end_at).format('DD/MM/YYYY')}</time>
                </div>
              )}
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
      <Modal
        isOpen={Boolean(selectedCollaborator)}
        onRequestClose={handleCloseModalEditCollaborator}
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalEditCollaborator}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        {selectedCollaborator && (
          <ModalFormEditCollaborator
            token={token}
            collaborator={selectedCollaborator}
            onCloseModal={handleCloseModalEditCollaborator}
          />
        )}
      </Modal>
    </div>
  )
}
