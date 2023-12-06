import { cookies } from 'next/headers'
import PublishedEvents from '@/components/PublishedEvents'
import { Collaborators } from '@/components/Collaborators'

export default async function CollaboratorsHome() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <PublishedEvents />
  }

  const token = cookies().get('token')?.value

  if (token === undefined) {
    return <PublishedEvents />
  }

  return (
    <div>
      <Collaborators token={token} />
    </div>
  )
}
