import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Importe os plugins 'utc' e 'timezone' do dayjs
dayjs.extend(utc)
dayjs.extend(timezone)

// Defina o fuso horário para Brasília
dayjs.tz.setDefault('America/Sao_Paulo')

interface ButtonExportCSVProps {
  data: any
  title: string
  columns: string[]
  valueKey: string
  columnLabels: Record<string, string>
  onClick: () => void
}

export function ButtonExportCSV({
  data,
  columns,
  columnLabels,
  title,
}: ButtonExportCSVProps) {
  const handleExportCSV = () => {
    const firstColumn = columns[0]

    const sortedEvents = [...data].sort((a, b) => {
      const valueA = a[firstColumn]
      const valueB = b[firstColumn]

      if (typeof valueA === 'undefined' || typeof valueB === 'undefined') {
        return 0
      }

      return valueA.localeCompare(valueB)
    })

    const csvHeaders = columns.map((column) => columnLabels[column])

    const csvRows = sortedEvents.map((event) => {
      const rowData = columns.map((column) => {
        const nestedKeys = column.split('.')
        let value = event
        nestedKeys.forEach((key) => {
          value = value[key]
        })

        if (typeof value === 'number') {
          value = value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
        }

        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        const isValidFormat = regex.test(value)

        if (isValidFormat) {
          value = dayjs(value).format('DD/MM/YYYY')
        }

        return value
      })
      return rowData.join(';') + ';'
    })

    const csvContent = `${csvHeaders.join(';')}\n${csvRows.join('\n')}`

    const downloadLink = document.createElement('a')
    downloadLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csvContent,
    )}`
    downloadLink.download = `${title}-${dayjs(new Date()).format(
      'YYYYMMDDHHmmss',
    )}.csv`
    downloadLink.style.display = 'none'

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div>
      <button
        className="w-40 rounded-md border border-custom-pink bg-transparent px-6 py-2 text-center text-custom-pink hover:font-bold"
        onClick={handleExportCSV}
      >
        Exportar CSV
      </button>
    </div>
  )
}
