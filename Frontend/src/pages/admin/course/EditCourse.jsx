import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import CourseTab from './Coursetab';

const EditCourse = () => {
    const navigate = useNavigate();
  return (
    <div className='flex-1 mt-15'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='font-bold text-xl'>Add Detail information regarding course</h1>
        <Button variant="link" className='hover:text-blue-600' onClick={() => navigate("lecture")}>Go to lectures page</Button>
      </div>
      <CourseTab />
    </div>
  )
}

export default EditCourse
