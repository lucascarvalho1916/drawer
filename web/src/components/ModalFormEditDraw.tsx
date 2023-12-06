import { FormEvent, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '@/lib/api'
import Modal from 'react-modal'
import { MdWarning } from 'react-icons/md'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
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
  draw: Draw
  onCloseModal: () => void
}

export function ModalFormEditDraw(data: Data) {
  const token = data.token
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleEditDraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const endAtIfNull = formData.get('endAt') === null ? data.draw.end_at : null

    const endAtEndOfTheDay =
      endAtIfNull !== null ? dayjs(endAtIfNull.toString()).endOf('date') : null

    const endAtUtc =
      endAtEndOfTheDay !== null ? dayjs(endAtEndOfTheDay).utc().format() : null

    try {
      const response = await api.patch(
        `/draws/${data.draw.id}/edit`,
        {
          description: formData.get('description'),
          endAt: endAtUtc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 200) {
        setShowSuccessMessage(true)
      }
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

  const [inputType, setInputType] = useState('text')

  const handleInputDateFocus = () => {
    setInputType('date')
  }

  const handleInputDateBlur = () => {
    setInputType('text')
  }

  return (
    <div>
      <form
        onSubmit={handleEditDraw}
        id="draw"
        className="text-md flex flex-col items-center gap-10 rounded-md bg-transparent px-8 pb-16 pt-10 text-black shadow-2xl"
      >
        <div className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-3xl font-bold uppercase text-transparent">
          Editar sorteio
        </div>
        <div className="w-full justify-center">
          <input
            defaultValue={data.draw.description}
            name="description"
            type="text"
            step="0.01"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Nome"
          />
        </div>
        <div className="w-full justify-center">
          <input
            defaultValue={
              data.draw.end_at === null
                ? ''
                : dayjs(data.draw.end_at).format('DD/MM/YYYY')
            }
            name="endAt"
            type={inputType}
            className={`w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0 ${
              dayjs(data.draw.end_at).isValid() ? 'bg-transparent' : ''
            }`}
            placeholder="Data fim"
            onFocus={handleInputDateFocus}
            onBlur={handleInputDateBlur}
            disabled={dayjs(data.draw.end_at).isValid()}
          />
        </div>
        <div className="items-center">
          <button
            type="submit"
            className={`w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105`}
          >
            Salvar
          </button>
        </div>
      </form>
      <Modal
        isOpen={showSuccessMessage}
        onRequestClose={() => setShowSuccessMessage(false)}
        contentLabel="Edição de sorteio"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        <p>Sorteio salvo com sucesso!</p>
        <button
          className="w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 "
          onClick={() => setShowSuccessMessage(false)}
        >
          Ok
        </button>
      </Modal>
      <Modal
        isOpen={showErrorMessage}
        onRequestClose={() => setShowErrorMessage(false)}
        contentLabel="Erro na Edição de Sorteio"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!errorMessage && (
          <p className="text-red-500">Ocorreu um erro ao editar o sorteio.</p>
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
