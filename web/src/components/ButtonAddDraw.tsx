import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import { ModalFormNewDraw } from '@/components/ModalFormNewDraw'

interface Data {
  token: string
}

export function ButtonAddDraw(data: Data) {
  const token = data.token
  const [showModalNewDraw, setShowModalNewDraw] = useState(false)

  const handleOpenModalNewDraw = () => {
    setShowModalNewDraw(true)
  }
  const handleCloseModalNewDraw = () => {
    setShowModalNewDraw(false)
  }

  return (
    <div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleOpenModalNewDraw}
          className="rounded-md border border-custom-pink bg-transparent px-6 py-2 text-center text-custom-pink hover:border-transparent hover:bg-gradient-to-r hover:from-custom-purple hover:to-custom-pink hover:text-white"
        >
          Adicionar Sorteio
        </button>
      </div>
      <Modal
        isOpen={showModalNewDraw}
        onRequestClose={handleCloseModalNewDraw}
        contentLabel="Cadastro de Colaborador"
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalNewDraw}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        <ModalFormNewDraw token={token} />
      </Modal>
    </div>
  )
}
