import { User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../assets/MAIN_LOGO.png'

export function UnauthenticatedNavigation() {
  return (
    <div>
      <div className="flex items-center justify-between gap-5 border-b border-transparent bg-transparent px-28 py-2">
        <div className="flex items-center">
          <Link href={'/'}>
            <Image src={Logo} alt="Logo custom" width={200} height={74} />
          </Link>
        </div>
        <a
          href={'/sign-in'}
          className="flex items-center gap-3 text-left transition-colors hover:text-gray-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 text-gray-400 transition-colors hover:border-gray-50 hover:text-gray-50 ">
            <User />
          </div>
        </a>
      </div>
    </div>
  )
}
