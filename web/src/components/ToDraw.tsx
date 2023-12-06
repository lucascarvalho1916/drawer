import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { MdWarning } from 'react-icons/md'
import { ButtonExportCSV } from './ButtonExportCSV'

interface Collaborator {
  name: string
}

interface Draw {
  description: string
}

interface Event {
  id: string
  collaborator: Collaborator
  draw: Draw
  value: number
  drawn_at: string
}

interface APIResponse {
  events: {
    events: Event[]
  }
}

interface DataRequest {
  token: string
  drawId: string
  value: number
  quantity: number
  releaseDate: string
  onClose: () => void
}

export function ToDraw(data: DataRequest) {
  const token = data.token
  const [events, setEvents] = useState<Event[]>([])
  const [apiResponse, setApiResponse] = useState<Event[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [exporting, setExporting] = useState(false)

  async function handleToDraw() {
    try {
      const response = await api.post<APIResponse>(
        `/events/${data.drawId}/to-draw`,
        {
          value: data.value,
          quantity: data.quantity,
          releaseDate: data.releaseDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setEvents(response.data.events.events)
      setApiResponse(response.data.events.events)
    } catch (error) {
      const responseError = error as { response: { data: { message: string } } }
      if (
        responseError.response &&
        responseError.response.data &&
        responseError.response.data.message
      ) {
        setErrorMessage(responseError.response.data.message)
      } else {
        setErrorMessage('Ocorreu um erro ao processar a requisição.')
      }
    }
  }

  useEffect(() => {
    handleToDraw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formattedValue = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const columns = ['collaborator.name', 'value']

  const columnLabels = {
    'collaborator.name': 'Nome do Colaborador',
    value: 'Valor',
  }

  const title = 'lista de sorteados'

  return (
    <div>
      {errorMessage ? (
        <div className="text-md flex w-full flex-col items-center gap-10 bg-transparent text-black">
          <MdWarning className="text-4xl text-custom-pink" />
          <p className="text-red-500">{errorMessage}</p>
        </div>
      ) : (
        <div className="text-md flex w-full flex-col items-center gap-10 bg-transparent text-black">
          <h2 className="text-2xl font-semibold uppercase">
            Colaboradores sorteados
          </h2>
          <ul className="max-h-96 overflow-y-auto pr-4">
            {apiResponse.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between gap-10 bg-gradient-to-r from-custom-purple to-custom-pink bg-clip-text text-xl text-transparent"
              >
                <span className="justify-start text-left">
                  {event.collaborator.name}
                </span>
                <span>{formattedValue(event.value)}</span>
              </li>
            ))}
          </ul>
          <div className="flex w-full items-center justify-end">
            <ButtonExportCSV
              data={events}
              title={title}
              columns={columns}
              valueKey="value"
              columnLabels={columnLabels}
              onClick={() => setExporting(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
