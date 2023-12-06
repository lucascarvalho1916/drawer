import React, { FormEvent, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '@/lib/api'
import Modal from 'react-modal'
import { MdWarning } from 'react-icons/md'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

dayjs.locale(ptBr)

interface Data {
  token: string
}

export function ModalFormNewUser(data: Data) {
  const token = data.token
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRegisterUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const startAtStartOfTheDay = dayjs(formData.get('startAt')?.toString())
      .startOf('date')
      .utc()
      .format()

    // const startAtUtc = dayjs(startAtStartOfTheDay).utc().format()

    try {
      const response = await api.post(
        '/users',
        {
          name: formData.get('name'),
          login: formData.get('login'),
          email: formData.get('email'),
          password: formData.get('password'),
          startAt: startAtStartOfTheDay,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 201) {
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

  const [formFields, setFormFields] = useState({
    name: '',
    login: '',
    email: '',
    password: '',
    startAt: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(e)
    handlePasswordChange(e)
  }

  return (
    <div>
      <form
        onSubmit={handleRegisterUser}
        id="draw"
        className="text-md flex flex-col items-center gap-10 rounded-md bg-transparent px-8 pb-16 pt-10 text-black shadow-2xl"
      >
        <div className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-3xl font-bold uppercase text-transparent">
          Novo usuário
        </div>
        <div className="w-full justify-center">
          <input
            name="name"
            type="text"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Nome"
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full justify-center">
          <input
            name="login"
            type="text"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Login"
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full justify-center">
          <input
            name="email"
            type="text"
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="E-mail"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="flex w-[80%] justify-between rounded-md border border-gray-100 bg-white p-3">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full border-none p-0  text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
              placeholder="Senha"
              onChange={handleInputPasswordChange}
            />
            {formFields.password !== '' && (
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="w-full justify-center">
          <input
            name="startAt"
            type={inputType}
            className="w-[80%] rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="Data de início"
            onChange={handleInputChange}
            onFocus={handleInputDateFocus}
            onBlur={handleInputDateBlur}
          />
        </div>
        <div className="items-center">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-44 rounded-md bg-gradient-to-r from-custom-purple to-custom-pink p-3 px-4 py-3 font-bold uppercase text-white shadow-2xl hover:scale-105 
                ${
                  isFormValid()
                    ? ''
                    : 'cursor-not-allowed bg-gray-500 opacity-40 hover:scale-100'
                }`}
          >
            Salvar
          </button>
        </div>
      </form>
      <Modal
        isOpen={showSuccessMessage}
        onRequestClose={() => setShowSuccessMessage(false)}
        contentLabel="Cadastro de Colaborador"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        <p>Cadastro do usuário adicionado com sucesso!</p>
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
        contentLabel="Erro no Cadastro do Usuário"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!errorMessage && (
          <p className="text-red-500">
            Ocorreu um erro ao cadastrar o usuário.
          </p>
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
