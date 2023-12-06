interface InputPaginationProps {
  totalRecords: number
  responseResultsPerPage: string
  currentPage: number
  onClick: (pageNumber: number) => void
}

export function InputPagination(data: InputPaginationProps) {
  const pageNumbers = []
  const totalPages = Math.ceil(
    data.totalRecords / parseInt(data.responseResultsPerPage, 10),
  )

  let startPage = Math.max(1, data.currentPage - 1)
  let endPage = Math.min(totalPages, data.currentPage + 1)

  if (totalPages >= 3) {
    if (data.currentPage === 1) {
      endPage = Math.min(startPage + 2, totalPages)
    } else if (data.currentPage === totalPages) {
      startPage = Math.max(endPage - 2, 1)
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const handlePageClick = (pageNumber: number) => {
    data.onClick(pageNumber)
  }

  const handleNextPage = () => {
    if (data.currentPage < totalPages) {
      const nextPage = data.currentPage + 1
      data.onClick(nextPage)
    }
  }

  const handlePrevPage = () => {
    if (data.currentPage > 1) {
      const prevPage = data.currentPage - 1
      data.onClick(prevPage)
    }
  }

  return (
    <div className="flex items-center justify-between gap-1">
      <button
        className={`w-28 ${
          data.currentPage === 1
            ? 'cursor-default text-gray-200'
            : 'bg-transparent from-custom-purple to-custom-pink text-black hover:bg-gradient-to-r hover:text-white'
        } rounded-md px-4 py-2`}
        onClick={handlePrevPage}
        disabled={data.currentPage === 1}
      >
        Anterior
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`rounded-md px-3 py-2 ${
            pageNumber === data.currentPage
              ? 'bg-gradient-to-r from-custom-purple to-custom-pink text-white'
              : 'from-custom-purple to-custom-pink text-black hover:bg-gradient-to-r hover:text-white'
          }`}
          onClick={() => handlePageClick(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className={`w-28 ${
          data.currentPage === totalPages || data.totalRecords === 0
            ? 'cursor-default text-gray-200'
            : 'bg-transparent from-custom-purple to-custom-pink text-black hover:bg-gradient-to-r hover:text-white'
        } rounded-md px-4 py-2`}
        onClick={handleNextPage}
        disabled={data.currentPage === totalPages || data.totalRecords === 0}
      >
        Próxima
      </button>
    </div>
  )
}
