interface TextFinalSentenceProps {
  totalRecords: number
  responseResultsPerPage: string
  currentPage: number
}

export function TextFinalSentence(data: TextFinalSentenceProps) {
  const startRecord =
    (data.currentPage - 1) * parseInt(data.responseResultsPerPage, 10) + 1
  const endRecord = Math.min(
    data.currentPage * parseInt(data.responseResultsPerPage, 10),
    data.totalRecords,
  )

  return (
    <div>
      <p className="text-left">{`Mostrando de ${startRecord} até ${endRecord} de ${data.totalRecords} registros`}</p>
    </div>
  )
}
