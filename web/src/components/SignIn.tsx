'use client'

import { api } from '@/lib/api'
import React, { FormEvent, useState } from 'react'
import Cookies from 'js-cookie'
import Modal from 'react-modal'
import { MdWarning } from 'react-icons/md'
import { User } from 'lucide-react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export function SignIn() {
  const isAuthenticated = Cookies.get('token')

  if (isAuthenticated) {
    window.location.href = '/'
  }

  // eslint-disable-next-line no-unused-vars
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  const handleAuthenticate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try {
      const response = await api.post(
        '/sessions',
        {
          email: formData.get('email'),
          password: formData.get('password'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.status === 201) {
        setShowSuccessMessage(true)
      }

      const token = response.data.token

      Cookies.set('token', token, { expires: 30 })
      window.location.href = '/'
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

  // eslint-disable-next-line no-unused-vars
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
      <form
        onSubmit={handleAuthenticate}
        id="draw"
        className="text-md flex min-w-[30%] flex-col items-center gap-10 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-custom-purple to-custom-pink">
          <User className="h-12 w-12 text-white" />
        </div>
        <div className="flex w-full items-center">
          <input
            name="email"
            type="text"
            className="w-full rounded-md border-gray-100 p-3 text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
            placeholder="E-mail"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full justify-between rounded-md border border-gray-100 bg-white p-3">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full border-none p-0  text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
              placeholder="Password"
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
            Entrar
          </button>
        </div>
      </form>
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
    </div>
  )
}
