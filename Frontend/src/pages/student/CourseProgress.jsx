import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useGetCourseProgressQuery,
  useMarkAsCompletedMutation,
  useMarkAsIncompletedMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    markAsCompleted,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useMarkAsCompletedMutation();
  const [
    markAsIncompleted,
    { data: markInCompleteData, isSuccess: inCompleteSuccess },
  ] = useMarkAsIncompletedMutation();

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(
        markCompleteData?.message || "Course marked as completed"
      );
    }
    if (inCompleteSuccess) {
      refetch();
      toast.success(
        markInCompleteData?.message || "Course marked as incomplete"
      );
    }
  }, [completedSuccess, inCompleteSuccess]);


  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading course progress.</div>;
  }

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // initialize the first lecture is not exists
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some(
      (lecture) => lecture.lectureId === lectureId && lecture.viewed
    );
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({
      courseId,
      lectureId,
    });
    refetch();
  };

  // handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    refetch();
    handleLectureProgress(lecture._id);
  };


  const handleCompleteCourse = async () => {
    await markAsCompleted(courseId);
    refetch();
  };

  const handleIncompleteCourse = async () => {
    await markAsIncompleted(courseId);
    refetch();
  };

  
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleIncompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() =>
                handleLectureProgress(
                  currentLecture?._id || initialLecture?._id
                )
              }
            />
          </div>

          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture: ${
                courseDetails.lectures.findIndex(
                  (lecture) =>
                    lecture._id === (currentLecture?._id || initialLecture?._id)
                ) + 1
              } : ${
                currentLecture?.lectureTitle || initialLecture?.lectureTitle
              }`}
            </h3>
          </div>
        </div>
        {/* lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture?.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
