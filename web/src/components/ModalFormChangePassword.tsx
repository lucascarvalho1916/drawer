import React, { FormEvent, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '@/lib/api'
import Modal from 'react-modal'
import { MdWarning } from 'react-icons/md'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

dayjs.locale(ptBr)

interface User {
  id: string
}

interface Data {
  token: string
  user: User
}

export function ModalFormChangePassword(data: Data) {
  const token = data.token
  const user = data.user
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try {
      const response = await api.patch(
        `/users/${user.id}/change-password`,
        {
          password: formData.get('newPassword'),
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

  const [formFields, setFormFields] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleConfirmPasswordChange = (e: any) => {
    const { value } = e.target
    setConfirmPassword(value)
    setPasswordsMatch(formFields.newPassword === value)
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    setPasswordsMatch(confirmPassword === value)
  }

  const isFormValid = () => {
    return (
      formFields.newPassword.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordsMatch
    )
  }

  // eslint-disable-next-line no-unused-vars
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const handleInputNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(e)
    handleNewPasswordChange(e)
  }

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleInputConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(e)
    handleConfirmPasswordChange(e)
  }

  return (
    <div>
      <form
        onSubmit={handleChangePassword}
        id="draw"
        className="text-md flex flex-col items-center gap-10 rounded-md bg-transparent px-8 pb-16 pt-10 text-black shadow-2xl"
      >
        <div className="bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-3xl font-bold uppercase text-transparent">
          Alterar senha
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="flex w-[80%] justify-between rounded-md border border-gray-100 bg-white p-3">
            <input
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className="w-full border-none p-0  text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
              placeholder="Nova senha"
              onChange={handleInputNewPasswordChange}
            />
            {formFields.newPassword !== '' && (
              <button type="button" onClick={toggleNewPasswordVisibility}>
                {showNewPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <div className="flex w-[80%] justify-between rounded-md border border-gray-100 bg-white p-3">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full border-none p-0  text-custom-pink placeholder:text-gray-200 focus:border-custom-pink focus:ring-0"
              placeholder="Confirmar a nova senha"
              onChange={handleInputConfirmPasswordChange}
            />
            {formFields.confirmPassword !== '' && (
              <button type="button" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
        {!passwordsMatch && (
          <p className=" text-custom-pink">As senhas não correspondem</p>
        )}
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
        contentLabel="Alteração de senha de usuário"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        <p>Senha alterada com sucesso!</p>
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
        contentLabel="Erro na alteração de senha"
        className="text-md absolute right-1/2 top-1/2 flex w-[40%] -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-8 rounded-md bg-gradient-to-r from-gray-100 to-white p-10 text-right text-black shadow-2xl"
      >
        <MdWarning className="text-4xl text-custom-pink" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!errorMessage && (
          <p className="text-red-500">
            Ocorreu um erro ao alterar a senha do usuário.
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
