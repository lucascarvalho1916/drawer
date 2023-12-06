'use client'

import { useState, FormEvent, useEffect } from 'react'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import '../app/globals.css'
import Modal from 'react-modal'
import { ToDraw } from './ToDraw'
import { MdWarning } from 'react-icons/md'
import { FaHourglassHalf } from 'react-icons/fa'
import { EmptyDraws } from './EmptyDraws'
import { ConflictPublishedDraws } from './ConflictPublishedDraws'

dayjs.locale(ptBr)

interface Draw {
  id: string
  description: string
}

interface Data {
  token: string
}

export function FormDraw(data: Data) {
  const token = data.token
  const [publishedDraws, setPublishedDraws] = useState<Draw[]>([])
  const [selectedDrawId, setSelectedDrawId] = useState<string>('')
  const [inputType, setInputType] = useState('text')
  const [showModalDrawns, setShowModalDrawns] = useState(false)
  const [formFields, setFormFields] = useState({
    value: 0,
    quantity: 0,
    releaseDate: '',
  })

  async function handleFetchPublishedDraws() {
    const response = await api.get(`/draws/published-draws`, {})

    setPublishedDraws(response.data.draws.draws)
    setSelectedDrawId(response.data.draws.draws[0].id)

    if (publishedDraws.length === 0) {
      return <EmptyDraws />
    }

    if (publishedDraws.length !== 1) {
      return <ConflictPublishedDraws />
    }
  }

  useEffect(() => {
    handleFetchPublishedDraws()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const isFormValid = () => {
    return Object.values(formFields).every(
      (value) => String(value).trim() !== '',
    )
  }

  const handleInputDateFocus = () => {
    setInputType('date')
  }

  const handleInputDateBlur = () => {
    setInputType('text')
  }

  const handleToDraw =
    (drawId: string) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      setSelectedDrawId(drawId)
      setShowModalDrawns(true)
    }

  const handleCloseModalDrawns = () => {
    setShowModalDrawns(false)
  }

  return (
    <div>
      {publishedDraws.length === 0 ? (
        <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
          <div className="text-md flex w-[40%] flex-col items-center gap-6 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl">
            <FaHourglassHalf className="animate-spin text-2xl text-custom-pink" />
            <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
              Carregando...
            </p>
          </div>
        </div>
      ) : publishedDraws.length !== 1 ? (
        <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
          <div className="text-md flex w-[40%] flex-col items-center gap-6 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl">
            <MdWarning className="text-4xl text-custom-pink" />
            <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
              Há conflito nas divulgações dos sorteios.
            </p>
            <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
              É permitida a divulgação de apenas 1 sorteio simultâneo.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
          {publishedDraws.map((draw) => (
            <div key={draw.id}>
              <form
                onSubmit={handleToDraw(draw.id)}
                id="draw"
                className="text-md flex min-w-[30%] flex-col items-center gap-10 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl"
              >
                <div className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-3xl font-bold uppercase text-transparent">
                  {publishedDraws.map((draw) => (
                    <div key={draw.id}>{draw.description}</div>
                  ))}
                </div>
                <div className="flex w-full items-center">
                  <input
                    name="value"
                    type="number"
                    step="0.01"
                    className="w-full rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
                    placeholder="Valor"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex w-full items-center">
                  <input
                    name="quantity"
                    type="number"
                    className="w-full rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
                    placeholder="Quantidade"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex w-full items-center">
                  <input
                    name="releaseDate"
                    type={inputType}
                    className="w-full rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
                    placeholder="Data de divulgação"
                    onChange={handleInputChange}
                    onFocus={handleInputDateFocus}
                    onBlur={handleInputDateBlur}
                  />
                </div>
                <div className="flex w-full items-center justify-center pt-6">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`w-[60%] rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 
            ${
              isFormValid()
                ? ''
                : 'cursor-not-allowed bg-gray-500 opacity-40 hover:scale-100'
            }`}
                  >
                    Sortear
                  </button>
                </div>
              </form>
              <Modal
                isOpen={showModalDrawns}
                onRequestClose={handleCloseModalDrawns}
                contentLabel="Sortear"
                className="text-md absolute right-1/2 top-1/2 flex -translate-y-1/2 translate-x-1/2 flex-col items-center gap-10 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-16 pt-10 text-center text-black shadow-2xl"
              >
                <ToDraw
                  token={token}
                  drawId={selectedDrawId}
                  value={formFields.value}
                  quantity={formFields.quantity}
                  releaseDate={formFields.releaseDate}
                  onClose={handleCloseModalDrawns}
                />
                <div className="flex w-full items-center justify-center">
                  <button
                    className="w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 "
                    onClick={handleCloseModalDrawns}
                  >
                    Voltar
                  </button>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
