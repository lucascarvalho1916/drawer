import { FaHourglassHalf } from 'react-icons/fa'

export function EmptyDraws() {
  return (
    <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
      <div className="text-md flex w-[40%] flex-col items-center gap-6 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl">
        <FaHourglassHalf className="animate-spin text-2xl text-custom-pink" />
        <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
          Carregando...
        </p>
      </div>
    </div>
  )
}
