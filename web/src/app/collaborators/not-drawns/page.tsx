import { cookies } from 'next/headers'
import PublishedEvents from '@/components/PublishedEvents'
import NotDraws from '@/components/NotDrawns'

export default async function NotDrawnsHome() {
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
      <NotDraws token={token} />
    </div>
  )
}
