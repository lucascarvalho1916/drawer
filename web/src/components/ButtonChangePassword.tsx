import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import { ModalFormChangePassword } from './ModalFormChangePassword'

interface User {
  id: string
}

interface Data {
  token: string
  user: User
}

export function ButtonChangePassword(data: Data) {
  const token = data.token
  const [showModalFormChangePassword, setShowModalFormChangePassword] =
    useState(false)

  const handleOpenModalFormChangePassword = () => {
    setShowModalFormChangePassword(true)
  }
  const handleCloseModalFormChangePassword = () => {
    setShowModalFormChangePassword(false)
  }

  return (
    <div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleOpenModalFormChangePassword}
          className="rounded-md border border-custom-pink bg-transparent px-6 py-2 text-center text-custom-pink hover:border-transparent hover:bg-gradient-to-r hover:from-custom-purple hover:to-custom-pink hover:text-white"
        >
          Alterar senha
        </button>
      </div>
      <Modal
        isOpen={showModalFormChangePassword}
        onRequestClose={handleCloseModalFormChangePassword}
        contentLabel="Cadastro de Usuário"
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalFormChangePassword}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        <ModalFormChangePassword token={token} user={data.user} />
      </Modal>
    </div>
  )
}
