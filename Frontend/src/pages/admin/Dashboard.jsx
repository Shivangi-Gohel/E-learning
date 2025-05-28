import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid gap-6 gris-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-20'>
      <Card>
        <CardHeader>
          <CardTitle>Totalsalse</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default Dashboard
