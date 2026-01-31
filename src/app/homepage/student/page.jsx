import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import StudentHomePage from '../../../components/StudentHomePage'

export default async function DashboardFeed() {


  const session = await auth()
  if (!session?.user) redirect('/login')



  return (
    <div >
      <StudentHomePage user={session.user}/>
    </div>
  )
}