import { FormEvent, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '@/lib/api'
import Modal from 'react-modal'
import { MdWarning } from 'react-icons/md'
import utc from 'dayjs/plugin/utc'
import { ButtonChangePassword } from './ButtonChangePassword'

dayjs.extend(utc)
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
  user: User
  onCloseModal: () => void
}

export function ModalFormEditUser(data: Data) {
  const token = data.token
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleEditUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const endAtIfNull =
      formData.get('endAt') === null ? data.user.end_at : formData.get('endAt')

    const endAtEndOfTheDay =
      endAtIfNull !== null ? dayjs(endAtIfNull.toString()).endOf('date') : null

    const endAtUtc =
      endAtEndOfTheDay !== null ? dayjs(endAtEndOfTheDay).utc().format() : null

    try {
      const response = await api.patch(
        `/users/${data.user.id}/edit`,
        {
          name: formData.get('name'),
          login: formData.get('login'),
          email: formData.get('email'),
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
      <div className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text pt-10 text-3xl font-bold uppercase text-transparent">
        Editar usuário
      </div>
      <div className="flex w-full items-center justify-end pr-14 pt-10">
        <ButtonChangePassword token={token} user={data.user} />
      </div>
      <form
        onSubmit={handleEditUser}
        id="draw"
        className="text-md flex flex-col items-center gap-10 rounded-md bg-transparent px-8 pb-16 pt-10 text-black shadow-2xl"
      >
        <div className="w-full justify-center">
          <input
            defaultValue={data.user.name}
            name="name"
            type="text"
            step="0.01"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Nome"
          />
        </div>
        <div className="w-full justify-center">
          <input
            defaultValue={data.user.login}
            name="login"
            type="text"
            step="0.01"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Login"
          />
        </div>
        <div className="w-full justify-center">
          <input
            defaultValue={data.user.email}
            name="email"
            type="text"
            step="0.01"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="E-mail"
          />
        </div>
        <div className="w-full justify-center">
          <input
            defaultValue={
              data.user.end_at === null
                ? ''
                : dayjs(data.user.end_at).format('DD/MM/YYYY')
            }
            name="endAt"
            type={inputType}
            className={`w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0 ${
              dayjs(data.user.end_at).isValid() ? 'bg-transparent' : ''
            }`}
            placeholder="Data fim"
            onFocus={handleInputDateFocus}
            onBlur={handleInputDateBlur}
            disabled={dayjs(data.user.end_at).isValid()}
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
        contentLabel="Edição de Usuário"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        <p>Usuário salvo com sucesso!</p>
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
        contentLabel="Erro na Edição do Usuário"
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
