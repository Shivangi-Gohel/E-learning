import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-5 mt-10">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => navigate(`/admin/courses/${courseId}/lecture`)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-bold text-xl ">Update Your Lecture</h1>
        </div>
      </div>
        <LectureTab />
    </div>
  );
};

export default EditLecture;
