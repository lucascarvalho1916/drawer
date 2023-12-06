'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { InputSearch } from '@/components/InputSearch'
import Card from './Card'
import Carousel from './Carousel'
import 'simplebar/dist/simplebar.min.css'
import SimpleBar from 'simplebar-react'
import Modal from 'react-modal'
import { ModalPublishedNotDrawns } from './ModalPublishedNotDrawns'
import Cookies from 'js-cookie'

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

export default function PublishedEvents() {
  const isAuthenticated = Cookies.get('token')

  if (isAuthenticated) {
    window.location.href = '/'
  }

  const [events, setEvents] = useState<Event[]>([])
  // eslint-disable-next-line no-unused-vars
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)
  const [showModalPublishedNotDrawns, setShowModalPublishedNotDrawns] =
    useState(false)

  const handleOpenModalPublishedNotDrawns = () => {
    setShowModalPublishedNotDrawns(true)
  }
  const handleCloseModalPublishedNotDrawns = () => {
    setShowModalPublishedNotDrawns(false)
  }

  const fetchEvents = async () => {
    setLoading(true)

    try {
      const response = await api.get('/published-events', {
        params: {
          query: searchTerm,
        },
      })

      const data = response.data.events.events
      const total = data.length > 0 ? response.data.events.total : 0

      setEvents(data)
      setTotalRecords(total)
    } catch (error) {
      // Tratar erros, se necessário
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm)
  }

  const formattedValue = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const title = 'SORTEADOS VALE COMPRAS'

  const groupEventsByDate = (events: Event[]) => {
    const groupedEvents: { [key: string]: { [key: string]: Event[] } } = {}

    events.forEach((event) => {
      const date = dayjs(event.drawn_at).format('YYYY-MM')
      const value = event.value.toString()

      if (!groupedEvents[date]) {
        groupedEvents[date] = {}
      }

      if (!groupedEvents[date][value]) {
        groupedEvents[date][value] = []
      }

      groupedEvents[date][value].push(event)
    })

    const pages = Object.entries(groupedEvents).map(([date, eventsByDate]) => ({
      date,
      events: eventsByDate,
    }))

    return pages
  }

  const renderGroupedEventCards = (pages: any[]) => {
    return pages.map((page) => (
      <div key={page.date}>
        <SimpleBar className="mx-5 mb-40 mt-10 h-96 items-center rounded-lg bg-gradient-to-b from-gray-200 to-white text-center text-black shadow-2xl">
          <h2 className="mt-4 bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-3xl font-bold capitalize text-transparent">
            {dayjs(page.date).format('MMMM')}
          </h2>
          <h2 className="mb-4 bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-lg font-bold capitalize text-transparent">
            {dayjs(page.date).format('YYYY')}
          </h2>
          <div className="simplebar-content w-full">
            {Object.entries(page.events)
              .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
              .map(([value, eventsByValue]) => (
                <div key={value} className="flex">
                  <div className="m-2 w-full">
                    <Card>
                      <p className="mb-1 bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold capitalize text-transparent">
                        {formattedValue(parseFloat(value))}
                      </p>
                      {(eventsByValue as Event[]).map((event: Event) => (
                        <div key={event.id}>
                          <p className="text-md text-black">
                            {event.collaborator.name}
                          </p>
                        </div>
                      ))}
                    </Card>
                  </div>
                </div>
              ))}
          </div>
        </SimpleBar>
      </div>
    ))
  }

  return (
    <div
      className={`text-md flex flex-col rounded-lg bg-gray-50 bg-[url('../assets/bg.png')] bg-left-bottom p-2 text-black`}
    >
      <div className="flex w-full items-center justify-between p-5 pb-10">
        <button
          onClick={handleOpenModalPublishedNotDrawns}
          className="rounded-md border border-custom-pink bg-transparent px-6 py-2 text-center text-custom-pink hover:border-transparent hover:bg-gradient-to-r hover:from-custom-purple hover:to-custom-pink hover:text-white"
        >
          Veja se seu nome está na lista
        </button>
        <p className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-4xl font-bold uppercase text-transparent">
          {title}
        </p>
        <div className="mr-2 flex justify-end gap-2">
          <InputSearch onChange={handleSearch} />
        </div>
      </div>
      {events.length === 0 ? (
        <div className="flex h-96 items-center">
          <p className="text-md w-full justify-center bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text p-2 text-center font-bold uppercase text-transparent">
            Nenhum registro encontrado
          </p>
        </div>
      ) : (
        <Carousel className={`cursor-grab justify-center`}>
          {renderGroupedEventCards(groupEventsByDate(events))}
        </Carousel>
      )}
      <div className="flex h-10 w-full items-center justify-between p-2" />
      <Modal
        isOpen={showModalPublishedNotDrawns}
        onRequestClose={handleCloseModalPublishedNotDrawns}
        contentLabel="Colaboradores não sorteados"
        className="text-md absolute right-1/2 top-1/2 flex w-[30%] -translate-y-1/2 translate-x-1/2 flex-col items-center gap-10 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-16 pt-10 text-center text-black shadow-2xl"
      >
        <ModalPublishedNotDrawns />
        <div className="flex w-full items-center justify-center">
          <button
            className="w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 "
            onClick={handleCloseModalPublishedNotDrawns}
          >
            Voltar
          </button>
        </div>
      </Modal>
    </div>
  )
}
