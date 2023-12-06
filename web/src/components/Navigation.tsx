'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Logo from '../assets/MAIN_LOGO.png'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { User } from 'lucide-react'
import Cookies from 'js-cookie'
import Modal from 'react-modal'
import { ModalFormChangeOwnPassword } from './ModalFormChangeOwnPassword'
import { FaTimes } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const [showModalFormChangeOwnPassword, setShowModalFormChangeOwnPassword] =
    useState(false)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsDropdownOpen(false)
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const handleOpenModalFormChangeOwnPassword = () => {
    setShowModalFormChangeOwnPassword(true)
  }
  const handleCloseModalFormChangeOwnPassword = () => {
    setShowModalFormChangeOwnPassword(false)
  }

  const handleLogout = async () => {
    Cookies.remove('token')
    window.location.href = '/'
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b bg-white px-28 py-2">
        <div className="flex items-center gap-5">
          <Link href={'/'}>
            <Image src={Logo} alt="Logo custom" width={200} height={74} />
          </Link>
          <Link
            className="border-b-2 border-transparent px-5 py-3 text-center font-alt text-sm uppercase leading-none text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
            href="/draws"
          >
            sorteios
          </Link>
          <Link
            className="border-b-2 border-transparent px-5 py-3 text-center font-alt text-sm uppercase leading-none text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
            href="/collaborators/all"
          >
            colaboradores
          </Link>
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              className="flex justify-center gap-2 border-b-2 border-transparent px-5 py-3 text-center font-alt text-sm uppercase leading-none text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
              onClick={handleDropdownToggle}
            >
              outros
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 top-12 inline-block bg-white p-1 text-left font-alt text-sm shadow-lg">
                <Link
                  className="block border-b-2 border-transparent px-5 py-2 text-sm uppercase text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
                  href="/events"
                >
                  Sorteados
                </Link>
                <Link
                  className="block whitespace-nowrap border-b-2 border-transparent px-5 py-2 text-sm uppercase text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
                  href="/collaborators/not-drawns"
                >
                  Não Sorteados
                </Link>
                <Link
                  className="block whitespace-nowrap border-b-2 border-transparent px-5 py-2 text-sm uppercase text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
                  href="/users/all"
                >
                  Usuários
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="relative inline-block" ref={userDropdownRef}>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 bg-transparent text-gray-400 transition-colors hover:border-gray-200 hover:text-gray-200"
            onClick={handleUserDropdownToggle}
          >
            <User />
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-12 inline-block w-44 content-end justify-end bg-white p-1 text-right font-alt text-sm shadow-lg">
              <button
                className="text-md block w-full border-b-2 border-transparent py-2 pr-5 text-right text-gray-300 hover:border-b-2 hover:border-custom-pink hover:text-gray-400"
                onClick={handleOpenModalFormChangeOwnPassword}
              >
                Alterar minha senha
              </button>
              <button
                onClick={handleLogout}
                className="text-md block w-full gap-8 whitespace-nowrap border-b-2 border-transparent py-2 pr-5 text-right text-custom-pink hover:border-b-2 hover:border-custom-pink hover:font-bold"
              >
                Sair
                <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={showModalFormChangeOwnPassword}
        onRequestClose={handleCloseModalFormChangeOwnPassword}
        contentLabel="Cadastro de Usuário"
        className="text-md absolute right-1/2 top-1/2 w-[30%] -translate-y-1/2 translate-x-1/2 rounded-md bg-gradient-to-r from-gray-100 to-white text-center text-black shadow-2xl"
      >
        <div className="w-full text-right">
          <button onClick={handleCloseModalFormChangeOwnPassword}>
            <FaTimes className="text-custom-pink" />
          </button>
        </div>
        <ModalFormChangeOwnPassword token={'token'} />
      </Modal>
    </div>
  )
}
