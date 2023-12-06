import { FormDraw } from '@/components/FormDraw'
import { cookies } from 'next/headers'
import PublishedEvents from '@/components/PublishedEvents'

export default async function Home() {
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
      <FormDraw token={token} />
    </div>
  )
}
