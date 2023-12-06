import { cookies } from 'next/headers'
import Events from '@/components/Events'
import PublishedEvents from '@/components/PublishedEvents'

export default async function DrawsHome() {
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
      <Events token={token} />
    </div>
  )
}
