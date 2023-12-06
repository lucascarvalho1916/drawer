import { cookies } from 'next/headers'
import { Draws } from '@/components/Draws'
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
      <Draws token={token} />
    </div>
  )
}
