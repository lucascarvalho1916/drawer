'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { ButtonAddDraw } from '@/components/ButtonAddDraw'
import Switch from 'react-switch'
import { MdWarning } from 'react-icons/md'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { ModalFormEditDraw } from '@/components/ModalFormEditDraw'
import { InputSearch } from '@/components/InputSearch'
import { SelectResultsPerPage } from '@/components/SelectResultsPerPage'
import { TextFinalSentence } from '@/components/TextFinalSentence'
import { InputPagination } from '@/components/InputPagination'

dayjs.locale(ptBr)

interface Draw {
  id: string
  description: string
  start_at: string
  end_at: string
  publicize: boolean
}

interface Data {
  token: string
}

export function Draws(data: Data) {
  const token = data.token
  const [draws, setDraws] = useState<Draw[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')
  const [responseResultsPerPage, setResponseResultsPerPage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [totalRecords, setTotalRecords] = useState(0)
  const [sortColumn, setSortColumn] = useState<string>('description')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedDraw, setSelectedDraw] = useState<Draw | undefined>(undefined)

  const fetchDraws = async () => {
    const response = await api.get('/draws', {
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

    const transformedData = response.data.draws.draws.map((draw: Draw) => ({
      id: draw.id,
      description: draw.description,
      start_at: draw.start_at,
      end_at: draw.end_at,
      publicize: draw.publicize, // Define o estado inicial como falso para cada draw
    }))
    const total = transformedData.length > 0 ? response.data.draws.total : 0
    const perPage = response.data.draws.perPage

    setDraws(transformedData)
    setTotalRecords(total)
    setResponseResultsPerPage(perPage)
  }

  useEffect(() => {
    fetchDraws()
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

  const handleToggle = async (drawId: string) => {
    try {
      await api.patch(
        `/draws/${drawId}/to-publicize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setDraws((prevDraws) => {
        const updatedDraws = prevDraws.map((draw) => {
          if (draw.id === drawId) {
            return {
              ...draw,
              publicize: !draw.publicize,
            }
          }
          return draw
        })

        return updatedDraws
      })
    } catch (error) {
      const responseError = error as { response: { data: { message: string } } }
      if (
        responseError.response &&
        responseError.response.data &&
        responseError.response.data.message
      ) {
        setErrorMessage(responseError.response.data.message)
      } else {
        setErrorMessage('Ocorreu um erro ao processar a requisição.')
      }
      setShowErrorMessage(true)
    }
  }

  const handleOpenModalEditDraw = (drawId: string) => {
    const draw = draws.find((collab) => collab.id === drawId)
    setSelectedDraw(draw)
  }

  const handleCloseModalEditDraw = () => {
    setSelectedDraw(undefined)
  }

  return (
    <div className="text-md flex h-full flex-col rounded-lg bg-gray-50 p-2 text-black shadow-2xl">
      <div className="flex w-full items-center justify-between p-2">
        <ButtonAddDraw token={token} />
        <div className="flex justify-end gap-2">
          <InputSearch onChange={handleSearch} />
          <SelectResultsPerPage onChange={handleResultsPerPage} />
        </div>
      </div>
      <div className="flex w-full items-center border-b border-b-black p-2">
        <div className="flex w-[40%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('description')}
          >
            <p>Descrição</p>
            {sortColumn === 'description' && (
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
            onClick={() => handleSortColumn('publicize')}
          >
            <p>Divulgação</p>
            {sortColumn === 'publicize' && (
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
      {draws.length === 0 ? (
        <p className="p-2 text-center">Nenhum registro encontrado</p>
      ) : (
        draws.map((draw, index) => {
          const isEven = index % 2 === 0
          const rowClassName = isEven ? 'bg-white' : 'bg-transparent'

          return (
            <div
              key={draw.id}
              className={`flex w-full items-center p-2 ${rowClassName}`}
            >
              <div className="flex w-[40%]">
                <a
                  onClick={() => handleOpenModalEditDraw(draw.id)}
                  className="cursor-pointer text-custom-pink hover:font-semibold"
                >
                  {draw.description}
                </a>
              </div>
              <div className="flex w-[30%] justify-center">
                <Switch
                  checked={draw.publicize}
                  onChange={() => handleToggle(draw.id)}
                  onColor="#A3238E"
                  onHandleColor="#fff"
                  handleDiameter={20}
                  uncheckedIcon={true}
                  checkedIcon={true}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 1px 5px #A3238E"
                  height={20}
                  width={48}
                  className="react-switch"
                />
              </div>
              <div className="flex w-[15%] justify-center">
                <time>
                  {draw.start_at
                    ? dayjs(draw.start_at).format('DD/MM/YYYY')
                    : ''}
                </time>
              </div>
              <div className="flex w-[15%] justify-center">
                <time>
                  {draw.end_at ? dayjs(draw.end_at).format('DD/MM/YYYY') : ''}
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
      <Modal
        isOpen={showErrorMessage}
        onRequestClose={() => setShowErrorMessage(false)}
        contentLabel="Erro no Cadastro de Colaborador"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!errorMessage && (
          <p className="text-red-500">
            Ocorreu um erro ao cadastrar o colaborador.
          </p>
        )}
        <button
          className="w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 "
          onClick={() => setShowErrorMessage(false)}
        >
          Ok
        </button>
      </Modal>
      <Modal
        isOpen={Boolean(selectedDraw)}
        onRequestClose={handleCloseModalEditDraw}
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalEditDraw}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        {selectedDraw && (
          <ModalFormEditDraw
            token={token}
            draw={selectedDraw}
            onCloseModal={handleCloseModalEditDraw}
          />
        )}
      </Modal>
    </div>
  )
}
