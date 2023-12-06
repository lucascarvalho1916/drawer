import { cookies } from 'next/headers'
import PublishedEvents from '@/components/PublishedEvents'
import Users from '@/components/Users'

export default async function UsersHome() {
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
      <Users token={token} />
    </div>
  )
}
