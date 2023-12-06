import { MdWarning } from 'react-icons/md'

export function ConflictPublishedDraws() {
  return (
    <div className="flex w-full items-center justify-center px-[5%] py-[5%]">
      <div className="text-md flex w-[40%] flex-col items-center gap-6 rounded-md bg-gradient-to-r from-gray-100 to-white px-8 pb-20 pt-16 text-black shadow-2xl">
        <MdWarning className="text-4xl text-custom-pink" />
        <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
          Há conflito nas divulgações dos sorteios.
        </p>
        <p className="w-full bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-center text-xl font-bold text-transparent">
          É permitida a divulgação de apenas 1 sorteio simultâneo.
        </p>
      </div>
    </div>
  )
}
