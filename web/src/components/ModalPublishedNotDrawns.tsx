'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '@/lib/api'
import { MdWarning } from 'react-icons/md'
import { InputSearch } from './InputSearch'
import { TextFinalSentence } from './TextFinalSentence'

dayjs.locale(ptBr)

interface Collaborator {
  id: string
  name: string
  cpf: string
  start_at: string
  end_at: string
}

export function ModalPublishedNotDrawns() {
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState('')
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  const fetchPublishedNotDrawns = async () => {
    const publishedDraw = await api.get(`/draws/published-draws`, {})

    const drawId = publishedDraw.data.draws.draws[0].id

    try {
      const response = await api.get(
        `/collaborators/${drawId}/publishedNotDrawns`,
        {
          params: {
            query: searchTerm,
          },
        },
      )

      const data = response.data.collaborators.collaborators
      const total = data.length > 0 ? response.data.collaborators.total : 0

      setTotalRecords(total)
      setCollaborators(data)
    } catch (error) {
      // Tratar erros, se necessário
    }
  }

  useEffect(() => {
    fetchPublishedNotDrawns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm)
  }

  return (
    <div className="w-full">
      {errorMessage ? (
        <div className="text-md flex w-full flex-col items-center gap-10 bg-transparent text-black">
          <MdWarning className="text-4xl text-custom-pink" />
          <p className="text-red-500">{errorMessage}</p>
        </div>
      ) : (
        <div className="text-md flex w-full flex-col items-center gap-10 bg-transparent text-black">
          <h2 className="text-2xl font-semibold uppercase">
            Colaboradores não sorteados
          </h2>
          <div className="flex w-full justify-end">
            <InputSearch onChange={handleSearch} />
          </div>
          {collaborators.length === 0 ? (
            <p className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text p-2 text-center text-xl text-transparent">
              Nenhum registro encontrado
            </p>
          ) : (
            <ul className="max-h-96 w-full overflow-y-auto pr-4">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="flex items-center justify-between gap-10 bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-xl text-transparent"
                >
                  <span className="justify-start text-left">
                    {collaborator.name}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <TextFinalSentence
            totalRecords={totalRecords}
            responseResultsPerPage={totalRecords.toString()}
            currentPage={1}
          />
        </div>
      )}
    </div>
  )
}
