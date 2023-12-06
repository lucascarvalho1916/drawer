import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import { ModalFormNewUser } from './ModalFormNewUser'

interface Data {
  token: string
}

export function ButtonAddUser(data: Data) {
  const token = data.token
  const [showModalNewUser, setShowModalNewUser] = useState(false)

  const handleOpenModalNewUser = () => {
    setShowModalNewUser(true)
  }
  const handleCloseModalNewUser = () => {
    setShowModalNewUser(false)
  }

  return (
    <div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleOpenModalNewUser}
          className="rounded-md border border-custom-pink bg-transparent px-6 py-2 text-center text-custom-pink hover:border-transparent hover:bg-gradient-to-r hover:from-custom-purple hover:to-custom-pink hover:text-white"
        >
          Adicionar Usuário
        </button>
      </div>
      <Modal
        isOpen={showModalNewUser}
        onRequestClose={handleCloseModalNewUser}
        contentLabel="Cadastro de Usuário"
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalNewUser}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        <ModalFormNewUser token={token} />
      </Modal>
    </div>
  )
}
