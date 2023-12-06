import { ReactNode } from 'react'
import './globals.css'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import { Navigation } from '@/components/Navigation'
import { cookies } from 'next/headers'
import { UnauthenticatedNavigation } from '@/components/UnauthenticatedNavigation'

const roboto = Roboto({
  preload: true,
  subsets: ['latin'],
  variable: '--font-roboto',
})
const baiJamJuree = BaiJamjuree({
  preload: true,
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'Sorteados Vale Compras',
  description: 'O app sorteador da Unimed Poços de Caldas',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamJuree.variable} h-screen bg-gradient-to-b from-green-400 to-gray-900 bg-fixed font-sans text-gray-100 `}
      >
        {isAuthenticated ? <Navigation /> : <UnauthenticatedNavigation />}

        <main className="px-28 py-10">{children}</main>
      </body>
    </html>
  )
}
