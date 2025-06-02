import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const lectureId = params.lectureId;

  const navigate = useNavigate();

  const [CreateLecture, {data, isLoading, isSuccess, error}] = useCreateLectureMutation();
  const {data: lectureData, isLoading: isLectureLoading, isError, error: lecError, refetch} = useGetCourseLectureQuery(courseId);
  console.log(isError, lecError);
  

  const createLectureHandler = async () => {
    await CreateLecture({ lectureTitle, courseId, lectureId });
  }

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Lecture created successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isSuccess, error])

  return (
     <div className="flex-1 mx-10 mt-20">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic course details for your new lectures
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, hic!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="mb-1">Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}`)}>Back to course</Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {
              isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
                </>
              ) : "Create lecture"
            }
          </Button>
        </div>
        <div className='mt-10'>
          {
            isLectureLoading ? (
              <p>Loading lecture...</p>
            ) : isError ? (
              <p>Failed to load lectures</p>
            ) : 
            lectureData && lectureData.lectures.length > 0 ? (
              lectureData.lectures.map((lecture, index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
              ))
            ) : (
              <p>No lectures found for this course</p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
