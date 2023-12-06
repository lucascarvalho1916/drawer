'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'
import { TextFinalSentence } from '@/components/TextFinalSentence'
import { InputPagination } from '@/components/InputPagination'
import { SelectResultsPerPage } from '@/components/SelectResultsPerPage'
import { InputSearch } from '@/components/InputSearch'
import Switch from 'react-switch'
import { ButtonAddUser } from '@/components/ButtonAddUser'
import { ModalFormEditUser } from '@/components/ModalFormEditUser'
import { MdWarning } from 'react-icons/md'

dayjs.locale(ptBr)

interface User {
  id: string
  name: string
  login: string
  email: string
  is_admin: boolean
  start_at: string
  end_at: string
}

interface Data {
  token: string
}

export default function Users(data: Data) {
  const token = data.token
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [resultsPerPage, setResultsPerPage] = useState<string>('15')
  const [responseResultsPerPage, setResponseResultsPerPage] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchUsers = async () => {
    const response = await api.get('/users', {
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

    const data = response.data.users.users
    const total = data.length > 0 ? response.data.users.total : 0
    const perPage = response.data.users.perPage

    setResultsPerPage(resultsPerPage)
    setUsers(data)
    setTotalRecords(total)
    setResponseResultsPerPage(perPage)
  }

  useEffect(() => {
    fetchUsers()
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

  const handleOpenModalEditUser = (userId: string) => {
    const user = users.find((collab) => collab.id === userId)

    setSelectedUser(user)
  }

  const handleCloseModalEditUser = () => {
    setSelectedUser(undefined)
  }

  const handleToggle = async (userId: string) => {
    try {
      await api.patch(
        `/users/${userId}/to-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              is_admin: !user.is_admin,
            }
          }
          return user
        })

        return updatedUsers
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

  return (
    <div className="text-md flex h-full flex-col rounded-lg bg-gray-50 p-2 text-black shadow-2xl">
      <div className="flex w-full items-center justify-between p-2">
        <ButtonAddUser token={token} />
        <div className="flex justify-end gap-2">
          <InputSearch onChange={handleSearch} />
          <SelectResultsPerPage onChange={handleResultsPerPage} />
        </div>
      </div>
      <div className="flex w-full items-center border-b border-b-black p-2">
        <div className="flex w-[30%] items-center justify-center text-center font-bold uppercase">
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
        <div className="flex w-[10%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('login')}
          >
            <p>login</p>
            {sortColumn === 'login' && (
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
        <div className="flex w-[25%] items-center justify-center text-center font-bold uppercase">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleSortColumn('email')}
          >
            <p>email</p>
            {sortColumn === 'email' && (
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
            onClick={() => handleSortColumn('is_admin')}
          >
            <p>Administrador</p>
            {sortColumn === 'is_admin' && (
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
        <div className="flex w-[10%] items-center justify-center text-center font-bold uppercase">
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
        <div className="flex w-[10%] items-center justify-center text-center font-bold uppercase">
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
      {users.length === 0 ? (
        <p className="p-2 text-center">Nenhum registro encontrado</p>
      ) : (
        users.map((user, index) => {
          const isEven = index % 2 === 0
          const rowClassName = isEven ? 'bg-white' : 'bg-transparent'

          return (
            <div
              key={user.id}
              className={`flex w-full items-center p-2 ${rowClassName}`}
            >
              <div className="flex w-[30%]">
                <a
                  onClick={() => handleOpenModalEditUser(user.id)}
                  className="cursor-pointer text-custom-pink hover:font-semibold"
                >
                  {user.name}
                </a>
              </div>
              <div className="flex w-[10%] justify-center">
                <p>{user.login}</p>
              </div>
              <div className="flex w-[25%] justify-center">
                <p>{user.email}</p>
              </div>
              <div className="flex w-[15%] justify-center">
                <Switch
                  checked={user.is_admin}
                  onChange={() => handleToggle(user.id)}
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
              <div className="flex w-[10%] justify-center">
                <time>
                  {user.start_at
                    ? dayjs(user.start_at).format('DD/MM/YYYY')
                    : ''}
                </time>
              </div>
              {user.end_at === null ? (
                <div className="flex w-[10%] justify-center" />
              ) : (
                <div className="flex w-[10%] justify-center">
                  <time>{dayjs(user.end_at).format('DD/MM/YYYY')}</time>
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
        isOpen={Boolean(selectedUser)}
        onRequestClose={handleCloseModalEditUser}
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalEditUser}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        {selectedUser && (
          <ModalFormEditUser
            token={token}
            user={selectedUser}
            onCloseModal={handleCloseModalEditUser}
          />
        )}
      </Modal>
      <Modal
        isOpen={showErrorMessage}
        onRequestClose={() => setShowErrorMessage(false)}
        contentLabel="Erro no Cadastro de Colaborador"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!errorMessage && (
          <p className="text-red-500">Ocorreu um erro ao editar o usuário.</p>
        )}
        <button
          className="w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 "
          onClick={() => setShowErrorMessage(false)}
        >
          Ok
        </button>
      </Modal>
    </div>
  )
}
